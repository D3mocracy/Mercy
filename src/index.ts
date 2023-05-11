require("dotenv").config();
import { ChatInputCommandInteraction, ModalSubmitInteraction, StringSelectMenuInteraction, Client, Partials, ButtonInteraction } from "discord.js";
import ChangeHelperHandler from "./handlers/ChangeHelper";
import CommandHandler from "./handlers/Command";
import CommunicateConversationHandler from "./handlers/CommunicateConversation";
import ConfigHandler from "./handlers/Config";
import ConversationManageHandler from "./handlers/ConversationManage";
import ConversationStaffToolsHandler from "./handlers/ConversationStaffTools";
import CustomEmbedMessages from "./handlers/CustomEmbedMessages";
import LeaveGuildHandler from "./handlers/LeaveGuild";
import StartConversation from "./handlers/StartConversation";
import { MessageUtils } from "./utils/MessageUtils";
import { Utils } from "./utils/Utils";
import DataBase from "./utils/db";
import Logger from "./handlers/Logger";
import { Command } from "./utils/Commands";
import { ModalSubmitHandler } from "./handlers/ModalSubmit";
import { ImportantLinksMessageUtils } from "./utils/MessageUtils/ImportantLinks";

const client: Client = new Client({ intents: 4194303, partials: [Partials.Channel, Partials.Message, Partials.User] });

DataBase.client.connect().then(async () => {
    await client.login(process.env.TOKEN);
    await client.application?.commands.set(Command.commands);
    await new ConfigHandler(client).loadConfig();
}).catch((error) => {
    Logger.logError(error)
});

client.once('ready', async () => {
    console.log(`Logged in as ${client!.user?.tag}!`);
});

client.on('messageCreate', async message => {
    try {
        if (message.author.bot
            || message.attachments.size > 0
            || message.stickers.size > 0
            || !message.channel.isTextBased()) return;

        if (message.content.startsWith('&') && message.member?.permissions.has("Administrator")) {
            await (await CustomEmbedMessages.createHandler(client, CustomEmbedMessages.getKeyFromMessage(message.content), message.channelId))?.sendMessage();
            message.delete();
        }

        if (await Utils.isGuildMember(message.author.id)) {
            const hasOpenConversation = await Utils.hasOpenConversation(message.author.id);

            if ((message.channel.isDMBased() && hasOpenConversation) || await Utils.isTicketChannel(message.channel)) {
                await new CommunicateConversationHandler(client, message, message.channel.type).handle();
            }
        } else {
            await message.reply("היי, לא נראה שאתה חלק מהשרת האנונימי");
        }
    } catch (error: any) {
        Logger.logError(error);
    }
});

client.on('interactionCreate', async interaction => {

    const actionHandler = new Map<string, () => Promise<void>>([
        ['openChatButton', async () => {
            await new StartConversation(interaction as ButtonInteraction).precondition();
        }],
        ['manager_attach_report', async () => {
            await new ConversationStaffToolsHandler(interaction as ButtonInteraction).managerAttachReport();
        }],
        ['tools_attach', async () => {
            const conversationManage = await ConversationManageHandler.createHandler(client, interaction as ButtonInteraction);
            await conversationManage.attachHelper(interaction.user.id);
            await conversationManage.saveConversation();
        }],
        ['tools_close', async () => {
            try {
                const conversationManage = await ConversationManageHandler.createHandler(client, interaction as ButtonInteraction);
                await conversationManage.sendSureMessageToClose();
            } catch (error) {
                (interaction as ButtonInteraction).message.edit({ components: [] });
                interaction.channel?.send({ embeds: [MessageUtils.EmbedMessages.chatIsNotAvailable] });
            }
        }],
        ['sure_yes', async () => {
            try {
                const conversationManage = await ConversationManageHandler.createHandler(client, interaction as ButtonInteraction);
                await (interaction as ButtonInteraction).message.edit({ components: [] });
                await conversationManage.closeConversation(interaction.channel?.isDMBased() ? "משתמש" : "איש צוות");
                await conversationManage.saveConversation();
            } catch (error) {
                (interaction as ButtonInteraction).message.edit({ components: [] });
                interaction.channel?.send({ embeds: [MessageUtils.EmbedMessages.chatIsNotAvailable] });
            }
        }],
        ['sure_no', async () => {
            await interaction.channel?.send('הפעולה בוטלה');
            (interaction as ButtonInteraction).message.edit({ components: [] });
        }],
        ['tools_manager', async () => {
            Utils.isManager(interaction.user.id)
                ? await (interaction as ButtonInteraction).reply({ ephemeral: true, embeds: [MessageUtils.EmbedMessages.ManagerTools], components: [MessageUtils.Actions.managerTools] })
                : await (interaction as ButtonInteraction).reply({ content: "ברכות על הקידום", ephemeral: true });
        }],
        ['tools_manager_reveal', async () => {
            const conversationManage = await ConversationManageHandler.createHandler(client, interaction as ButtonInteraction);
            await conversationManage.revealUser();
        }],
        ['tools_manager_change_supporter', async () => {
            const conversationManage = await ConversationManageHandler.createHandler(client, interaction as ButtonInteraction);
            await conversationManage.changeHelpersMessage();
        }],
        ['tools_reset_helpers', async () => {
            const conversationManage = await ConversationManageHandler.createHandler(client, interaction as ButtonInteraction);
            await conversationManage.resetHelpers();
            await conversationManage.saveConversation();
        }],
        ['tools_refer_manager', async () => {
            await (interaction as ButtonInteraction).showModal(MessageUtils.Modals.referManagerModal);
        }],
        ['user_report_helper', async () => {
            await (interaction as ButtonInteraction).showModal(ImportantLinksMessageUtils.Modals.reportHelperModal);
        }],
        ['user_suggest', async () => {
            await (interaction as ButtonInteraction).showModal(ImportantLinksMessageUtils.Modals.suggestIdeaModal);
        }],
        ['reportHelperModal', async () => {
            await new ModalSubmitHandler(interaction as ModalSubmitInteraction).reportHelper();
        }],
        ['referManager', async () => {
            await new ModalSubmitHandler(interaction as ModalSubmitInteraction).referManager();
        }],
        ['suggestIdea', async () => {
            await new ModalSubmitHandler(interaction as ModalSubmitInteraction).suggestIdea();
        }],
        ['helpers_list', async () => {
            await new ChangeHelperHandler(client, interaction as StringSelectMenuInteraction).handle();
        }],
        ['openchat', async () => {
            await new CommandHandler(interaction as ChatInputCommandInteraction).openChat();
        }],
        ['תומך החודש', async () => {
            await new CommandHandler(interaction as ChatInputCommandInteraction).makeHelperOfTheMonth();
        }],
        ['manage', async () => {
            await ConversationManageHandler.sendManageTools(interaction as ChatInputCommandInteraction)
        }],
        ['importantlinks', async () => {
            await new CommandHandler(interaction as ChatInputCommandInteraction).importantLinks();
        }],
        ['sendstaffmessage', async () => {
            await new CommandHandler(interaction as ChatInputCommandInteraction).sendStaffMessage();
        }]
    ]);

    try {
        if (interaction.isButton() || interaction.isModalSubmit() || interaction.isStringSelectMenu() || interaction.isCommand()) {
            const action = interaction.isCommand() ? interaction.commandName : interaction.customId;
            const handler = actionHandler.get(action);
            if (handler) {
                await handler();
                if (!(interaction.deferred || interaction.replied)) {
                    interaction.isCommand() ? await interaction.deferReply() : await interaction.deferUpdate();
                }
            }
        }

    } catch (error: any) {
        Logger.logError(error);
    }

});

client.on('guildMemberRemove', async member => {
    try {
        if (!await Utils.hasOpenConversation(member.id)) return;
        const leaveGuildHandler = new LeaveGuildHandler(client, member.user.id);
        await leaveGuildHandler.loadConversation();
        await leaveGuildHandler.closeConversation();
    } catch (error: any) {
        Logger.logError(error);
    }
});

client.on('guildMemberAdd', async member => {
    try {
        const memberRole = ConfigHandler.config.memberRole;
        memberRole && member.roles.add(memberRole);
    } catch (error: any) {
        Logger.logError(error);
    }
});

client.on('channelDelete', async channel => {
    try {
        await DataBase.conversationsCollection.updateOne({ channelId: channel.id }, { $set: { open: false } });
    } catch (error: any) {
        Logger.logError(error);
    }
})