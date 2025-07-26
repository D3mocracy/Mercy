"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
// Validate required environment variables
if (!process.env.TOKEN) {
    console.error('ERROR: TOKEN environment variable is required');
    process.exit(1);
}
if (!process.env.MongoURL) {
    console.error('ERROR: MongoURL environment variable is required');
    process.exit(1);
}
const discord_js_1 = require("discord.js");
const CommunicateConversation_1 = __importDefault(require("./handlers/CommunicateConversation"));
const Config_1 = __importDefault(require("./handlers/Config"));
const CustomEmbedMessages_1 = __importDefault(require("./handlers/CustomEmbedMessages"));
const LeaveGuild_1 = __importDefault(require("./handlers/LeaveGuild"));
const Utils_1 = require("./utils/Utils");
const db_1 = __importDefault(require("./utils/db"));
const Logger_1 = __importDefault(require("./handlers/Logger"));
const Commands_1 = require("./utils/Commands");
const UnactiveConversation_1 = __importDefault(require("./handlers/UnactiveConversation"));
const InteractionRouter_1 = require("./handlers/InteractionRouter");
const ErrorHandler_1 = require("./utils/ErrorHandler");
const Constants_1 = require("./utils/Constants");
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
const interactionRouter = new InteractionRouter_1.InteractionRouter(client);
db_1.default.client.connect().then(async () => {
    await client.login(process.env.TOKEN);
    client.user?.setActivity({ type: discord_js_1.ActivityType.Listening, name: Constants_1.CONSTANTS.BOT.ACTIVITY_NAME });
    await client.application?.commands.set(Commands_1.Command.commands);
}).catch((error) => {
    console.error('Failed to connect to database or login to Discord:', error);
    process.exit(1);
});
client.once('ready', async () => {
    try {
        console.log(`Bot connected as ${client.user?.tag}! Loading configuration...`);
        const config = await new Config_1.default().loadConfig(client);
        await config.guild?.members.fetch();
        console.log(`Configuration loaded successfully! Current Date: ${new Date()}`);
        const unactiveConversationHandler = new UnactiveConversation_1.default();
        setInterval(() => unactiveConversationHandler.checkChannels(), Constants_1.CONSTANTS.TIMERS.UNACTIVE_CHECK_INTERVAL);
        console.log('Bot is fully ready and operational!');
    }
    catch (error) {
        console.error('Failed to load configuration:', error);
        await Logger_1.default.logError(error); // Now it's safe to use Logger since we're in ready event
        process.exit(1);
    }
});
client.on('messageCreate', async (message) => {
    try {
        if (message.author.bot
            || message.attachments.size > 0
            || message.stickers.size > 0
            || !message.channel.isTextBased())
            return;
        if (message.content.startsWith(Constants_1.CONSTANTS.BOT.COMMAND_PREFIX) && message.member?.permissions.has("Administrator")) {
            await (await CustomEmbedMessages_1.default.createHandler(client, CustomEmbedMessages_1.default.getKeyFromMessage(message.content), message.channelId))?.sendMessage();
            message.delete();
        }
        if (message.channel.id === Constants_1.CONSTANTS.CHANNEL_IDS.TELL_ABOUT_YOURSELF && message.channel instanceof discord_js_1.BaseGuildTextChannel) {
            message.react(Constants_1.CONSTANTS.EMOJIS.WHITE_HEART);
            message.member?.roles.add(Constants_1.CONSTANTS.ROLE_IDS.MEMBER_ROLE);
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
    try {
        if (interaction.isButton() || interaction.isModalSubmit() || interaction.isStringSelectMenu() || interaction.isCommand()) {
            await interactionRouter.handleInteraction(interaction);
            if (!(interaction.deferred || interaction.replied)) {
                interaction.isCommand() ? await interaction.deferReply() : await interaction.deferUpdate();
            }
        }
    }
    catch (error) {
        await ErrorHandler_1.ErrorHandler.handleInteractionError(interaction, error);
    }
});
client.on('guildMemberRemove', ErrorHandler_1.ErrorHandler.wrapAsync(async (member) => {
    if (!await Utils_1.Utils.hasOpenConversation(member.id))
        return;
    const leaveGuildHandler = new LeaveGuild_1.default(client, member.user.id);
    await leaveGuildHandler.loadConversation();
    await leaveGuildHandler.closeConversation();
}));
client.on('messageUpdate', ErrorHandler_1.ErrorHandler.wrapAsync(async (oldMessage, newMessage) => {
    if (newMessage.channel.parentId !== Config_1.default.config.conversationCatagory?.id)
        return;
    const communicateConversationHandler = new CommunicateConversation_1.default(client, newMessage);
    await communicateConversationHandler.loadConversation();
    await communicateConversationHandler.updateMessage(oldMessage, newMessage);
}));
client.on('messageDelete', ErrorHandler_1.ErrorHandler.wrapAsync(async (message) => {
    if (message.channel.parentId !== Config_1.default.config.conversationCatagory?.id || message.author?.bot)
        return;
    const communicateConversationHandler = new CommunicateConversation_1.default(client, message);
    await communicateConversationHandler.loadConversation();
    await communicateConversationHandler.deleteMessage(message);
}));
client.on('guildMemberAdd', ErrorHandler_1.ErrorHandler.wrapAsync(async (member) => {
    const memberRole = Config_1.default.config.memberRole;
    memberRole && member.roles.add(memberRole);
}));
client.on('channelDelete', ErrorHandler_1.ErrorHandler.wrapAsync(async (channel) => {
    await db_1.default.conversationsCollection.updateOne({ channelId: channel.id }, { $set: { open: false } });
}));
//# sourceMappingURL=index.js.map