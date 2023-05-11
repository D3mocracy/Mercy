"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const MessageUtils_1 = require("./utils/MessageUtils");
const Utils_1 = require("./utils/Utils");
const db_1 = __importDefault(require("./utils/db"));
const Logger_1 = __importDefault(require("./handlers/Logger"));
const Commands_1 = require("./utils/Commands");
const ModalSubmit_1 = require("./handlers/ModalSubmit");
const ImportantLinks_1 = require("./utils/MessageUtils/ImportantLinks");
const client = new discord_js_1.Client({ intents: 4194303, partials: [discord_js_1.Partials.Channel, discord_js_1.Partials.Message, discord_js_1.Partials.User] });
db_1.default.client.connect().then(async () => {
    await client.login(process.env.TOKEN);
    await client.application?.commands.set(Commands_1.Command.commands);
    await new Config_1.default(client).loadConfig();
}).catch((error) => {
    Logger_1.default.logError(error);
});
client.once('ready', async () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});
client.on('messageCreate', async (message) => {
    try {
        if (message.author.bot
            || message.attachments.size > 0
            || message.stickers.size > 0
            || !message.channel.isTextBased())
            return;
        if (message.content.startsWith('&') && message.member?.permissions.has("Administrator")) {
            await (await CustomEmbedMessages_1.default.createHandler(client, CustomEmbedMessages_1.default.getKeyFromMessage(message.content), message.channelId))?.sendMessage();
            message.delete();
        }
        if (await Utils_1.Utils.isGuildMember(message.author.id)) {
            const hasOpenConversation = await Utils_1.Utils.hasOpenConversation(message.author.id);
            if ((message.channel.isDMBased() && hasOpenConversation) || await Utils_1.Utils.isTicketChannel(message.channel)) {
                await new CommunicateConversation_1.default(client, message, message.channel.type).handle();
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
client.on('interactionCreate', async (interaction) => {
    const actionHandler = new Map([
        ['openChatButton', async () => {
                await new StartConversation_1.default(interaction).precondition();
            }],
        ['manager_attach_report', async () => {
                await new ConversationStaffTools_1.default(interaction).managerAttachReport();
            }],
        ['tools_attach', async () => {
                const conversationManage = await ConversationManage_1.default.createHandler(client, interaction);
                await conversationManage.attachHelper(interaction.user.id);
                await conversationManage.saveConversation();
            }],
        ['tools_close', async () => {
                try {
                    const conversationManage = await ConversationManage_1.default.createHandler(client, interaction);
                    await conversationManage.sendSureMessageToClose();
                }
                catch (error) {
                    interaction.message.edit({ components: [] });
                    interaction.channel?.send({ embeds: [MessageUtils_1.MessageUtils.EmbedMessages.chatIsNotAvailable] });
                }
            }],
        ['sure_yes', async () => {
                try {
                    const conversationManage = await ConversationManage_1.default.createHandler(client, interaction);
                    await interaction.message.edit({ components: [] });
                    await conversationManage.closeConversation(interaction.channel?.isDMBased() ? "משתמש" : "איש צוות");
                    await conversationManage.saveConversation();
                }
                catch (error) {
                    interaction.message.edit({ components: [] });
                    interaction.channel?.send({ embeds: [MessageUtils_1.MessageUtils.EmbedMessages.chatIsNotAvailable] });
                }
            }],
        ['sure_no', async () => {
                await interaction.channel?.send('הפעולה בוטלה');
                interaction.message.edit({ components: [] });
            }],
        ['tools_manager', async () => {
                Utils_1.Utils.isManager(interaction.user.id)
                    ? await interaction.reply({ ephemeral: true, embeds: [MessageUtils_1.MessageUtils.EmbedMessages.ManagerTools], components: [MessageUtils_1.MessageUtils.Actions.managerTools] })
                    : await interaction.reply({ content: "ברכות על הקידום", ephemeral: true });
            }],
        ['tools_manager_reveal', async () => {
                const conversationManage = await ConversationManage_1.default.createHandler(client, interaction);
                await conversationManage.revealUser();
            }],
        ['tools_manager_change_supporter', async () => {
                const conversationManage = await ConversationManage_1.default.createHandler(client, interaction);
                await conversationManage.changeHelpersMessage();
            }],
        ['tools_reset_helpers', async () => {
                const conversationManage = await ConversationManage_1.default.createHandler(client, interaction);
                await conversationManage.resetHelpers();
                await conversationManage.saveConversation();
            }],
        ['tools_refer_manager', async () => {
                await interaction.showModal(MessageUtils_1.MessageUtils.Modals.referManagerModal);
            }],
        ['user_report_helper', async () => {
                await interaction.showModal(ImportantLinks_1.ImportantLinksMessageUtils.Modals.reportHelperModal);
            }],
        ['user_suggest', async () => {
                await interaction.showModal(ImportantLinks_1.ImportantLinksMessageUtils.Modals.suggestIdeaModal);
            }],
        ['reportHelperModal', async () => {
                await new ModalSubmit_1.ModalSubmitHandler(interaction).reportHelper();
            }],
        ['referManager', async () => {
                await new ModalSubmit_1.ModalSubmitHandler(interaction).referManager();
            }],
        ['suggestIdea', async () => {
                await new ModalSubmit_1.ModalSubmitHandler(interaction).suggestIdea();
            }],
        ['helpers_list', async () => {
                await new ChangeHelper_1.default(client, interaction).handle();
            }],
        ['openchat', async () => {
                await new Command_1.default(interaction).openChat();
            }],
        ['תומך החודש', async () => {
                await new Command_1.default(interaction).makeHelperOfTheMonth();
            }],
        ['manage', async () => {
                await ConversationManage_1.default.sendManageTools(interaction);
            }],
        ['importantlinks', async () => {
                await new Command_1.default(interaction).importantLinks();
            }],
        ['sendstaffmessage', async () => {
                await new Command_1.default(interaction).sendStaffMessage();
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
    }
    catch (error) {
        Logger_1.default.logError(error);
    }
});
client.on('guildMemberRemove', async (member) => {
    try {
        if (!await Utils_1.Utils.hasOpenConversation(member.id))
            return;
        const leaveGuildHandler = new LeaveGuild_1.default(client, member.user.id);
        await leaveGuildHandler.loadConversation();
        await leaveGuildHandler.closeConversation();
    }
    catch (error) {
        Logger_1.default.logError(error);
    }
});
client.on('guildMemberAdd', async (member) => {
    try {
        const memberRole = Config_1.default.config.memberRole;
        memberRole && member.roles.add(memberRole);
    }
    catch (error) {
        Logger_1.default.logError(error);
    }
});
client.on('channelDelete', async (channel) => {
    try {
        await db_1.default.conversationsCollection.updateOne({ channelId: channel.id }, { $set: { open: false } });
    }
    catch (error) {
        Logger_1.default.logError(error);
    }
});
//# sourceMappingURL=index.js.map