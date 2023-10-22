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
const ConversationManage_2 = require("./utils/MessageUtils/ConversationManage");
const CreateConversation_1 = __importDefault(require("./handlers/CreateConversation"));
const OpenModal_1 = __importDefault(require("./handlers/OpenModal"));
const PunishMember_1 = __importDefault(require("./handlers/PunishMember"));
//4194303
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.IntentsBitField.Flags.Guilds,
        discord_js_1.IntentsBitField.Flags.GuildMembers,
        discord_js_1.IntentsBitField.Flags.GuildMessages,
        discord_js_1.IntentsBitField.Flags.GuildMessageReactions,
        discord_js_1.IntentsBitField.Flags.MessageContent,
        discord_js_1.IntentsBitField.Flags.DirectMessages,
    ], partials: [discord_js_1.Partials.Channel, discord_js_1.Partials.Message, discord_js_1.Partials.User, discord_js_1.Partials.GuildMember]
});
db_1.default.client.connect().then(async () => {
    await client.login(process.env.TOKEN);
    client.user?.setActivity({ type: discord_js_1.ActivityType.Listening, name: "your heart" });
    await client.application?.commands.set(Commands_1.Command.commands);
}).catch((error) => {
    Logger_1.default.logError(error);
});
client.once('ready', async () => {
    const config = await new Config_1.default().loadConfig(client);
    await config.guild?.members.fetch();
    console.log(`Logged in as ${client.user?.tag}! Current Date: ${new Date()}`);
    // setInterval(Utils.checkChannels, 1000 * 60 * 60); // NEED TO BE FIXED - TIMEZONE PROBLEMS
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
        if (message.channel.id === "1148286189925838858" && message.channel instanceof discord_js_1.BaseGuildTextChannel) { // ספרו על עצמכם
            message.react("🤍");
            message.member?.roles.add('1164995639743090718');
        }
        const hasOpenConversation = await Utils_1.Utils.hasOpenConversation(message.author.id);
        if ((message.channel.isDMBased() && hasOpenConversation) || Utils_1.Utils.isConversationChannel(message.channel)) {
            await new CommunicateConversation_1.default(client, message).handleSendMessage();
        }
    }
    catch (error) {
        Logger_1.default.logError(error);
    }
});
client.on('interactionCreate', async (interaction) => {
    const actionHandler = new Map([
        ['openChatButton', async () => {
                const hanlder = await StartConversation_1.default.createHandler(interaction);
                await hanlder.handle();
            }],
        ['select_subject', async () => {
                const hanlder = await CreateConversation_1.default.createHandler(interaction);
                await hanlder.handle();
            }],
        ['manager_attach_report', async () => {
                await new ConversationStaffTools_1.default(interaction).managerAttachReport();
            }],
        ['manager_mark_as_done', async () => {
                await new ConversationStaffTools_1.default(interaction).managerMarkRequestAsDone();
            }],
        ['manager_in_progress', async () => {
                await new ConversationStaffTools_1.default(interaction).supervisorInProgress();
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
                    await conversationManage.closeConversation(interaction.channel?.isDMBased() ? "משתמש" : "איש צוות");
                    await conversationManage.saveConversation();
                }
                catch (error) {
                    interaction.channel?.send({ embeds: [MessageUtils_1.MessageUtils.EmbedMessages.chatIsNotAvailable] });
                }
            }],
        ['sure_no', async () => {
                await interaction.reply({ embeds: [ConversationManage_2.ConversationManageMessageUtils.EmbedMessages.actionCancelledCloseChat], ephemeral: true });
            }],
        ['tools_manager', async () => {
                Utils_1.Utils.isSeniorStaff(interaction.user.id)
                    ? await interaction.reply({
                        ephemeral: true, embeds: [ConversationManage_2.ConversationManageMessageUtils.EmbedMessages.ManagerTools],
                        components: [ConversationManage_2.ConversationManageMessageUtils.Actions.managerTools]
                    })
                    : await interaction.reply({ content: "אין לך הרשאות להשתמש בהגדרות ניהול", ephemeral: true });
            }],
        ['tools_manager_reveal', async () => {
                const conversationManage = await ConversationManage_1.default.createHandler(client, interaction);
                await conversationManage.revealUser();
            }],
        ['tools_manager_change_supporter', async () => {
                const conversationManage = await ConversationManage_1.default.createHandler(client, interaction);
                await conversationManage.changeHelpersMessage();
            }],
        ['tools_manager_punish', async () => {
                const conversationManage = await ConversationManage_1.default.createHandler(client, interaction);
                await conversationManage.sendPunishMessage();
            }],
        ['tools_reset_helpers', async () => {
                const conversationManage = await ConversationManage_1.default.createHandler(client, interaction);
                await conversationManage.resetHelpers();
                await conversationManage.saveConversation();
            }],
        ['tools_refer_manager', async () => {
                const conversationManage = await ConversationManage_1.default.createHandler(client, interaction);
                await conversationManage.openRefferSupervisorModal();
            }],
        ['user_report_helper', async () => {
                await new OpenModal_1.default(interaction).openModal();
            }],
        ['user_volunteer', async () => {
                await new OpenModal_1.default(interaction).openModal();
            }],
        ['user_suggest', async () => {
                await new OpenModal_1.default(interaction).openModal();
            }],
        ['reportHelperModal', async () => {
                await new ModalSubmit_1.ModalSubmitHandler(interaction).reportHelper();
            }],
        ['referManager', async () => {
                await new ModalSubmit_1.ModalSubmitHandler(interaction).referManager();
            }],
        ['volunteer_modal', async () => {
                await new ModalSubmit_1.ModalSubmitHandler(interaction).sendVolunteerMessage();
            }],
        ['suggestIdea', async () => {
                await new ModalSubmit_1.ModalSubmitHandler(interaction).suggestIdea();
            }],
        ['vacationModal', async () => {
                await new ModalSubmit_1.ModalSubmitHandler(interaction).sendVacationMessage();
            }],
        ['criticalChatModal', async () => {
                await new ModalSubmit_1.ModalSubmitHandler(interaction).criticalChat();
            }],
        ['findChannelModal', async () => {
                await new ModalSubmit_1.ModalSubmitHandler(interaction).findChannel();
            }],
        ['helpers_list', async () => {
                await new ChangeHelper_1.default(client, interaction).handle();
            }],
        ['openchat', async () => {
                await new Command_1.default(interaction).openChat();
            }],
        ['חבר הצוות של החודש', async () => {
                await new Command_1.default(interaction).makeHelperOfTheMonth("helper");
            }],
        ['חברת הצוות של החודש', async () => {
                await new Command_1.default(interaction).makeHelperOfTheMonth("helperit");
            }],
        ['אשר חופשה', async () => {
                await new Command_1.default(interaction).approveVacation();
            }],
        ["דיווח כצ'אט קריטי", async () => {
                await new Command_1.default(interaction).criticalChat();
            }],
        ['manage', async () => {
                await new Command_1.default(interaction).sendManageTools();
            }],
        ['importantlinks', async () => {
                await new Command_1.default(interaction).importantLinks();
            }],
        ['sendstaffmessage', async () => {
                await new Command_1.default(interaction).sendStaffMessage();
            }],
        ['channel-info', async () => {
                await new Command_1.default(interaction).findChannel();
            }],
        ['reopen', async () => {
                await new Command_1.default(interaction).reopenChat(client);
            }],
        ['vacation', async () => {
                await interaction.showModal(MessageUtils_1.MessageUtils.Modals.vacationModal);
            }],
        ['punish_menu', async () => {
                await new OpenModal_1.default(interaction).openModal();
            }],
        ['punish_history', async () => {
                await PunishMember_1.default.sendPunishmentHistory(interaction);
            }],
        ['punishKickModal', async () => {
                const handler = (await PunishMember_1.default.createHandler(interaction));
                await handler.kick();
            }],
        ['punishBanModal', async () => {
                const handler = (await PunishMember_1.default.createHandler(interaction));
                await handler.ban();
            }],
        ['punishMuteModal', async () => {
                const handler = (await PunishMember_1.default.createHandler(interaction));
                await handler.timeout();
            }],
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
        await Logger_1.default.logError(error);
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
        await Logger_1.default.logError(error);
    }
});
client.on('messageUpdate', async (oldMessage, newMessage) => {
    if (newMessage.channel.parentId !== Config_1.default.config.conversationCatagory?.id)
        return;
    const communicateConversationHandler = new CommunicateConversation_1.default(client, newMessage);
    await communicateConversationHandler.loadConversation();
    await communicateConversationHandler.updateMessage(oldMessage, newMessage);
});
client.on('messageDelete', async (message) => {
    if (message.channel.parentId !== Config_1.default.config.conversationCatagory?.id || message.author?.bot)
        return;
    const communicateConversationHandler = new CommunicateConversation_1.default(client, message);
    await communicateConversationHandler.loadConversation();
    await communicateConversationHandler.deleteMessage(message);
});
client.on('guildMemberAdd', async (member) => {
    try {
        const memberRole = Config_1.default.config.memberRole;
        memberRole && member.roles.add(memberRole);
    }
    catch (error) {
        await Logger_1.default.logError(error);
    }
});
client.on('channelDelete', async (channel) => {
    try {
        await db_1.default.conversationsCollection.updateOne({ channelId: channel.id }, { $set: { open: false } });
    }
    catch (error) {
        await Logger_1.default.logError(error);
    }
});
//# sourceMappingURL=index.js.map