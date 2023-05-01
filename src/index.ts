require("dotenv").config();
import { Utils } from "./utils/Utils";
import ConversationStaffToolsHandler from "./handlers/ConversationStaffTools";
import ChangeHelperHandler from "./handlers/ChangeHelper";
import ReportHandler from "./handlers/Report";
import { ButtonInteraction, CommandInteraction, ModalSubmitInteraction, SelectMenuInteraction } from "discord.js";
import LeaveGuildHandler from "./handlers/LeaveGuild";
import ConfigHandler from "./handlers/Config";
import { Config } from "./utils/types";
import CustomEmbedMessages from "./handlers/CustomEmbedMessages";
import StartConversation from "./handlers/StartConversation";
import CommunicateConversationHandler from "./handlers/CommunicateConversation";
import { MessageUtils } from "./utils/MessageUtils";
import ConversationManageHandler from "./handlers/ConversationManage";

export let config: Config = {} as any;

Utils.turnOnBot().then(async () => {
    config = await new ConfigHandler().getConfig();
});

const bot = Utils.client;

bot.once('ready', () => {
    console.log(`Logged in as ${bot!.user?.tag}!`);
});

bot.on('messageCreate', async message => {
    if (message.author.bot || message.attachments.size > 0 || message.stickers.size > 0) return;
    if (message.author.id === '844537722466205706' || message.author.id === '243380679763558400') {
        if (message.content === '!openchat') {
            await message.channel.send({
                embeds: [MessageUtils.EmbedMessages.openChat],
                components: [MessageUtils.Actions.openChatButton]
            })
            await message.delete();
        }
    }

    try {
        if (message.content.startsWith('&')) {
            await (await CustomEmbedMessages.createHandler(CustomEmbedMessages.getKeyFromMessage(message.content), message.channelId)).sendMessage();
        }
    } catch (error) { console.log(error) }

    if (await Utils.isGuildMember(message.author.id)) {
        const hasOpenConversation = await Utils.hasOpenConversation(message.author.id);
        if ((message.channel.isDMBased() && hasOpenConversation) || await Utils.isTicketChannel(message.channel)) {
            await new CommunicateConversationHandler(message, message.channel.type).createHandler();
        }
    } else {
        await message.reply("היי, לא נראה שאתה חלק מהשרת האנונימי");
    }
});

bot.on('interactionCreate', async interaction => {
    const actionHandler: any = {
        openChatButton: async () => {
            const startConversationHandler = new StartConversation(interaction as ButtonInteraction);
            await startConversationHandler.precondition();
        },
        manager_attach_report: async () => {
            const conversationStaffToolHandler = new ConversationStaffToolsHandler(interaction as ButtonInteraction);
            await conversationStaffToolHandler.managerAttachReport();
        },
        tools_attach: async () => {
            const conversationManage = await ConversationManageHandler.createHandler(interaction as ButtonInteraction);
            await conversationManage.attachHelper(interaction.user.id);
            await conversationManage.saveConversation();
        },
        tools_close: async () => {
            const conversationManage = await ConversationManageHandler.createHandler(interaction as ButtonInteraction);
            await conversationManage.closeConversation(interaction.channel?.isDMBased() ? "משתמש" : "איש צוות");
            await conversationManage.saveConversation();
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
        tools_report: async () => { //
            await (interaction as ButtonInteraction).showModal(MessageUtils.Modals.reportChatModal);
        },
        user_report_helper: async () => {
            const conversationManage = await ConversationManageHandler.createHandler(interaction as ButtonInteraction);
            await conversationManage.userReportOnHelper();
        },
        reportHelperModal: async () => { //User report on helper submit modal
            const reportHelper = new ReportHandler(interaction as ModalSubmitInteraction);
            await reportHelper.handle();
        },
        reportModal: async () => { //Helper report on user chat sunbmit handler
            const reportHelper = new ReportHandler(interaction as ModalSubmitInteraction);
            await reportHelper.handle();
        },
        helpers_list: async () => {
            await new ChangeHelperHandler(interaction as SelectMenuInteraction).handle();
        },
    }

    if (interaction.isChatInputCommand()) {
        interaction.reply({ content: "", ephemeral: true })
    }

    if (interaction.isButton() || interaction.isModalSubmit() || interaction.isSelectMenu()) {
        console.log(`User clicked on ${interaction.customId}`);

        await actionHandler[interaction.customId]();
        if (!(interaction.deferred || interaction.replied)) {
            try {
                await interaction.deferUpdate();
            } catch (error) {
                console.log(error);
            }
        }
        return;
    }

});

bot.on('guildMemberRemove', async member => {
    const leaveGuildHandler = new LeaveGuildHandler(member.user.id);
    await leaveGuildHandler.loadConversation();
    await leaveGuildHandler.closeConversation()
});