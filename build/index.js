"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
require("dotenv").config();
const discord_js_1 = require("discord.js");
const ChangeHelper_1 = __importDefault(require("./handlers/ChangeHelper"));
const Command_1 = __importDefault(require("./handlers/Command"));
const CommunicateConversation_1 = __importDefault(require("./handlers/CommunicateConversation"));
const Config_1 = __importDefault(require("./handlers/Config"));
const ConversationManage_1 = __importDefault(require("./handlers/ConversationManage"));
const ConversationStaffTools_1 = __importDefault(require("./handlers/ConversationStaffTools"));
const CustomEmbedMessages_1 = __importDefault(require("./handlers/CustomEmbedMessages"));
const LeaveGuild_1 = __importDefault(require("./handlers/LeaveGuild"));
const StartConversation_1 = __importDefault(require("./handlers/StartConversation"));
const SubmitReportOnConversation_1 = require("./handlers/SubmitReportOnConversation");
const SubmitReportOnHelper_1 = require("./handlers/SubmitReportOnHelper");
const MessageUtils_1 = require("./utils/MessageUtils");
const Utils_1 = require("./utils/Utils");
const db_1 = __importDefault(require("./utils/db"));
const Logger_1 = __importDefault(require("./handlers/Logger"));
const Commands_1 = require("./utils/Commands");
exports.client = new discord_js_1.Client({ intents: 4194303, partials: [discord_js_1.Partials.Channel, discord_js_1.Partials.Message, discord_js_1.Partials.User] });
db_1.default.client.connect().then(async () => {
    await exports.client.login(process.env.TOKEN);
    await exports.client.application?.commands.set(Commands_1.Command.commands);
    await new Config_1.default().loadConfig();
}).catch((error) => {
    Logger_1.default.logError(error);
});
exports.client.once('ready', () => {
    console.log(`Logged in as ${exports.client.user?.tag}!`);
});
exports.client.on('messageCreate', async (message) => {
    try {
        if (message.author.bot
            || message.attachments.size > 0
            || message.stickers.size > 0
            || !message.channel.isTextBased())
            return;
        if (message.content.startsWith('&') && message.member?.permissions.has("Administrator")) {
            await (await CustomEmbedMessages_1.default.createHandler(CustomEmbedMessages_1.default.getKeyFromMessage(message.content), message.channelId))?.sendMessage();
        }
        if (await Utils_1.Utils.isGuildMember(message.author.id)) {
            const hasOpenConversation = await Utils_1.Utils.hasOpenConversation(message.author.id);
            if ((message.channel.isDMBased() && hasOpenConversation) || await Utils_1.Utils.isTicketChannel(message.channel)) {
                await new CommunicateConversation_1.default(message, message.channel.type).handle();
            }
        }
        else {
            await message.reply("היי, לא נראה שאתה חלק מהשרת האנונימי");
        }
    }
    catch (error) {
        Logger_1.default.logError(error);
    }
});
exports.client.on('interactionCreate', async (interaction) => {
    const actionHandler = {
        openChatButton: async () => {
            await new StartConversation_1.default(interaction).precondition();
        },
        manager_attach_report: async () => {
            await new ConversationStaffTools_1.default(interaction).managerAttachReport();
        },
        tools_attach: async () => {
            const conversationManage = await ConversationManage_1.default.createHandler(interaction);
            await conversationManage.attachHelper(interaction.user.id);
            await conversationManage.saveConversation();
        },
        tools_close: async () => {
            try {
                const conversationManage = await ConversationManage_1.default.createHandler(interaction);
                await conversationManage.sendSureMessageToClose();
            }
            catch (error) {
                interaction.message.edit({ components: [] });
                interaction.channel?.send({ embeds: [MessageUtils_1.MessageUtils.EmbedMessages.chatIsNotAvailable] });
            }
        },
        sure_yes: async () => {
            try {
                const conversationManage = await ConversationManage_1.default.createHandler(interaction);
                await interaction.message.edit({ components: [] });
                await conversationManage.closeConversation(interaction.channel?.isDMBased() ? "משתמש" : "איש צוות");
                await conversationManage.saveConversation();
            }
            catch (error) {
                interaction.message.edit({ components: [] });
                interaction.channel?.send({ embeds: [MessageUtils_1.MessageUtils.EmbedMessages.chatIsNotAvailable] });
            }
        },
        sure_no: async () => {
            await interaction.channel?.send('הפעולה בוטלה');
            interaction.message.edit({ components: [] });
        },
        tools_manager: async () => {
            Utils_1.Utils.isManager(interaction.user.id)
                ? await interaction.reply({ ephemeral: true, embeds: [MessageUtils_1.MessageUtils.EmbedMessages.ManagerTools], components: [MessageUtils_1.MessageUtils.Actions.managerTools] })
                : await interaction.reply({ content: "ברכות על הקידום", ephemeral: true });
        },
        tools_manager_reveal: async () => {
            const conversationManage = await ConversationManage_1.default.createHandler(interaction);
            await conversationManage.revealUser();
        },
        tools_manager_change_supporter: async () => {
            const conversationManage = await ConversationManage_1.default.createHandler(interaction);
            await conversationManage.changeHelpersMessage();
        },
        tools_reset_helpers: async () => {
            const conversationManage = await ConversationManage_1.default.createHandler(interaction);
            await conversationManage.resetHelpers();
            await conversationManage.saveConversation();
        },
        tools_report: async () => {
            await interaction.showModal(MessageUtils_1.MessageUtils.Modals.reportChatModal);
        },
        user_report_helper: async () => {
            const conversationManage = await ConversationManage_1.default.createHandler(interaction);
            await conversationManage.userReportOnHelper();
        },
        reportHelperModal: async () => {
            await new SubmitReportOnHelper_1.ReportOnHelperHandler(interaction).handle();
        },
        reportModal: async () => {
            await new SubmitReportOnConversation_1.ReportOnConversationHandler(interaction).handle();
        },
        helpers_list: async () => {
            await new ChangeHelper_1.default(interaction).handle();
        },
        openchat: async () => {
            await new Command_1.default(interaction).openChat();
        },
        'תומך החודש': async () => {
            await new Command_1.default(interaction).makeHelperOfTheMonth();
        },
        manage: async () => {
            await ConversationManage_1.default.sendManageTools(interaction);
        },
        importantlinks: async () => {
            await new Command_1.default(interaction).importantLinks();
        }
    };
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
    }
    catch (error) {
        Logger_1.default.logError(error);
    }
});
exports.client.on('guildMemberRemove', async (member) => {
    try {
        if (!await Utils_1.Utils.hasOpenConversation(member.id))
            return;
        const leaveGuildHandler = new LeaveGuild_1.default(member.user.id);
        await leaveGuildHandler.loadConversation();
        await leaveGuildHandler.closeConversation();
    }
    catch (error) {
        Logger_1.default.logError(error);
    }
});
exports.client.on('guildMemberAdd', async (member) => {
    try {
        const memberRole = Config_1.default.config.memberRole;
        memberRole && member.roles.add(memberRole);
    }
    catch (error) {
        Logger_1.default.logError(error);
    }
});
exports.client.on('channelDelete', async (channel) => {
    try {
        await db_1.default.conversationsCollection.updateOne({ channelId: channel.id }, { $set: { open: false } });
    }
    catch (error) {
        Logger_1.default.logError(error);
    }
});
//# sourceMappingURL=index.js.map