require("dotenv").config();
import { Utils } from "./utils/Utils";
import ConversationStaffToolsHandler from "./handlers/ConversationStaffTools";
import ChangeHelperHandler from "./handlers/ChangeHelper";
import { ButtonInteraction, ModalSubmitInteraction, SelectMenuInteraction, PermissionsBitField, ChatInputCommandInteraction } from "discord.js";
import LeaveGuildHandler from "./handlers/LeaveGuild";
import ConfigHandler from "./handlers/Config";
import { Config } from "./utils/types";
import CustomEmbedMessages from "./handlers/CustomEmbedMessages";
import StartConversation from "./handlers/StartConversation";
import CommunicateConversationHandler from "./handlers/CommunicateConversation";
import { MessageUtils } from "./utils/MessageUtils";
import ConversationManageHandler from "./handlers/ConversationManage";
import { ReportOnHelperHandler } from "./handlers/SubmitReportOnHelper";
import { ReportOnConversationHandler } from "./handlers/SubmitReportOnConversation";
import DataBase from "./utils/db";
import CommandHandler from "./handlers/Command";

export let config: Config = {} as any;
const client = Utils.client;

DataBase.client.connect().then(async () => {
    await Utils.turnOnBot();
    config = await new ConfigHandler().getConfig();
});

client.once('ready', () => {
    console.log(`Logged in as ${client!.user?.tag}!`);
});

client.on('messageCreate', async message => {
    try {
        if (message.author.bot
            || message.attachments.size > 0
            || message.stickers.size > 0
            || !message.channel.isTextBased()) return;

        if (message.content.startsWith('&')) {
            await (await CustomEmbedMessages.createHandler(CustomEmbedMessages.getKeyFromMessage(message.content), message.channelId)).sendMessage();
        }

        if (await Utils.isGuildMember(message.author.id)) {
            const hasOpenConversation = await Utils.hasOpenConversation(message.author.id);
            if ((message.channel.isDMBased() && hasOpenConversation) || await Utils.isTicketChannel(message.channel)) {
                await new CommunicateConversationHandler(message, message.channel.type).handle();
            }
        } else {
            await message.reply("היי, לא נראה שאתה חלק מהשרת האנונימי");
        }
    } catch (error) {
        console.error(error);
    }
});

client.on('interactionCreate', async interaction => {

    const actionHandler: any = {
        openChatButton: async () => {
            await new StartConversation(interaction as ButtonInteraction).precondition();
        },
        manager_attach_report: async () => {
            await new ConversationStaffToolsHandler(interaction as ButtonInteraction).managerAttachReport();
        },
        tools_attach: async () => {
            const conversationManage = await ConversationManageHandler.createHandler(interaction as ButtonInteraction);
            await conversationManage.attachHelper(interaction.user.id);
            await conversationManage.saveConversation();
        },
        tools_close: async () => {
            try {
                const conversationManage = await ConversationManageHandler.createHandler(interaction as ButtonInteraction);
                await conversationManage.sendSureMessageToClose();
            } catch (error) {
                (interaction as ButtonInteraction).message.edit({ components: [] });
                interaction.channel?.send({ embeds: [MessageUtils.EmbedMessages.chatIsNotAvailable] });
            }
        },
        sure_yes: async () => {
            try {
                const conversationManage = await ConversationManageHandler.createHandler(interaction as ButtonInteraction);
                await (interaction as ButtonInteraction).message.edit({ components: [] });
                await conversationManage.closeConversation(interaction.channel?.isDMBased() ? "משתמש" : "איש צוות");
                await conversationManage.saveConversation();
            } catch (error) {
                (interaction as ButtonInteraction).message.edit({ components: [] });
                interaction.channel?.send({ embeds: [MessageUtils.EmbedMessages.chatIsNotAvailable] });
            }
        },
        sure_no: async () => {
            await interaction.channel?.send('הפעולה בוטלה');
            (interaction as ButtonInteraction).message.edit({ components: [] });
        },
        tools_manager: async () => {
            Utils.isManager(interaction.user.id)
                ? await (interaction as ButtonInteraction).reply({ ephemeral: true, embeds: [MessageUtils.EmbedMessages.ManagerTools], components: [MessageUtils.Actions.managerTools] })
                : await (interaction as ButtonInteraction).reply({ content: "ברכות על הקידום", ephemeral: true });
        },
        tools_manager_reveal: async () => {
            const conversationManage = await ConversationManageHandler.createHandler(interaction as ButtonInteraction);
            await conversationManage.revealUser();
        },
        tools_manager_change_supporter: async () => {
            const conversationManage = await ConversationManageHandler.createHandler(interaction as ButtonInteraction);
            await conversationManage.changeHelpersMessage();

        },
        tools_reset_helpers: async () => {
            const conversationManage = await ConversationManageHandler.createHandler(interaction as ButtonInteraction);
            await conversationManage.resetHelpers();
            await conversationManage.saveConversation();
        },
        tools_report: async () => {
            await (interaction as ButtonInteraction).showModal(MessageUtils.Modals.reportChatModal);
        },
        user_report_helper: async () => {
            const conversationManage = await ConversationManageHandler.createHandler(interaction as ButtonInteraction);
            await conversationManage.userReportOnHelper();
        },
        reportHelperModal: async () => {
            await new ReportOnHelperHandler(interaction as ModalSubmitInteraction).handle();
        },
        reportModal: async () => {
            await new ReportOnConversationHandler(interaction as ModalSubmitInteraction).handle();
        },
        helpers_list: async () => {
            await new ChangeHelperHandler(interaction as SelectMenuInteraction).handle();
        },
        openchat: async () => {
            await new CommandHandler(interaction as ChatInputCommandInteraction).openChat();
        },
        'תומך החודש': async () => {
            await new CommandHandler(interaction as ChatInputCommandInteraction).makeHelperOfTheMonth();
        },
        manage: async () => {
            await ConversationManageHandler.sendManageTools(interaction as ChatInputCommandInteraction)
        }
    }
    try {
        if (interaction.isButton() || interaction.isModalSubmit() || interaction.isStringSelectMenu() || interaction.isCommand()) {
            interaction.isCommand()
                ? await actionHandler[interaction.commandName]()
                : await actionHandler[interaction.customId]();

            if (!(interaction.deferred || interaction.replied)) { //interaction.isChatInputCommand don't have deferUpdate()
                interaction.isCommand()
                    ? await interaction.deferReply()
                    : await interaction.deferUpdate();
            }
        }
    } catch (error: any) {
        console.error(error)
    }

});

client.on('guildMemberRemove', async member => {
    if (!await Utils.hasOpenConversation(member.id)) return;
    const leaveGuildHandler = new LeaveGuildHandler(member.user.id);
    await leaveGuildHandler.loadConversation();
    await leaveGuildHandler.closeConversation()
});

client.on('guildMemberAdd', async member => {
    const memberRole = await Utils.getRoleById(config.memberRole);
    memberRole && member.roles.add(memberRole);
});

client.on('channelDelete', async channel => {
    await DataBase.conversationsCollection.updateOne({ channelId: channel.id }, { $set: { open: false } });
})