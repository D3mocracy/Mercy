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

import { Client, Partials, IntentsBitField, ActivityType, BaseGuildTextChannel, Message, TextChannel } from "discord.js";
import CommunicateConversationHandler from "./handlers/CommunicateConversation";
import ConfigHandler from "./handlers/Config";
import CustomEmbedMessages from "./handlers/CustomEmbedMessages";
import LeaveGuildHandler from "./handlers/LeaveGuild";
import { Utils } from "./utils/Utils";
import DataBase from "./utils/db";
import Logger from "./handlers/Logger";
import { Command } from "./utils/Commands";
import UnactiveConversationHandler from "./handlers/UnactiveConversation";
import { InteractionRouter } from "./handlers/InteractionRouter";
import { ErrorHandler } from "./utils/ErrorHandler";
import { CONSTANTS } from "./utils/Constants";

//4194303
const client: Client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.DirectMessages,
    ], partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember]
});

const interactionRouter = new InteractionRouter(client);

DataBase.client.connect().then(async () => {
    await client.login(process.env.TOKEN);
    client.user?.setActivity({ type: ActivityType.Listening, name: CONSTANTS.BOT.ACTIVITY_NAME })
    await client.application?.commands.set(Command.commands);
}).catch((error) => {
    console.error('Failed to connect to database or login to Discord:', error);
    process.exit(1);
});

client.once('ready', async () => {
    try {
        console.log(`Bot connected as ${client!.user?.tag}! Loading configuration...`);
        const config = await new ConfigHandler().loadConfig(client);
        await config.guild?.members.fetch();
        console.log(`Configuration loaded successfully! Current Date: ${new Date()}`);
        
        const unactiveConversationHandler = new UnactiveConversationHandler();
        setInterval(() => unactiveConversationHandler.checkChannels(), CONSTANTS.TIMERS.UNACTIVE_CHECK_INTERVAL);
        
        console.log('Bot is fully ready and operational!');
    } catch (error) {
        console.error('Failed to load configuration:', error);
        await Logger.logError(error as Error); // Now it's safe to use Logger since we're in ready event
        process.exit(1);
    }
});

client.on('messageCreate', async message => {
    try {
        if (message.author.bot
            || message.attachments.size > 0
            || message.stickers.size > 0
            || !message.channel.isTextBased()) return;

        if (message.content.startsWith(CONSTANTS.BOT.COMMAND_PREFIX) && message.member?.permissions.has("Administrator")) {
            await (await CustomEmbedMessages.createHandler(client, CustomEmbedMessages.getKeyFromMessage(message.content), message.channelId))?.sendMessage();
            message.delete();
        }

        if (message.channel.id === CONSTANTS.CHANNEL_IDS.TELL_ABOUT_YOURSELF && message.channel instanceof BaseGuildTextChannel) {
            message.react(CONSTANTS.EMOJIS.WHITE_HEART);
            message.member?.roles.add(CONSTANTS.ROLE_IDS.MEMBER_ROLE);
        }

        const hasOpenConversation = await Utils.hasOpenConversation(message.author.id);
        if ((message.channel.isDMBased() && hasOpenConversation) || Utils.isConversationChannel(message.channel)) {
            await new CommunicateConversationHandler(client, message).handleSendMessage();
        }

    } catch (error: any) {
        Logger.logError(error);
    }
});

client.on('interactionCreate', async interaction => {
    try {
        if (interaction.isButton() || interaction.isModalSubmit() || interaction.isStringSelectMenu() || interaction.isCommand()) {
            await interactionRouter.handleInteraction(interaction);
            
            if (!(interaction.deferred || interaction.replied)) {
                interaction.isCommand() ? await interaction.deferReply() : await interaction.deferUpdate();
            }
        }
    } catch (error: any) {
        await ErrorHandler.handleInteractionError(interaction, error);
    }
});

client.on('guildMemberRemove', ErrorHandler.wrapAsync(async member => {
    if (!await Utils.hasOpenConversation(member.id)) return;
    const leaveGuildHandler = new LeaveGuildHandler(client, member.user.id);
    await leaveGuildHandler.loadConversation();
    await leaveGuildHandler.closeConversation();
}));

client.on('messageUpdate', ErrorHandler.wrapAsync(async (oldMessage, newMessage) => {
    if ((newMessage.channel as TextChannel).parentId !== ConfigHandler.config.conversationCatagory?.id) return;
    const communicateConversationHandler = new CommunicateConversationHandler(client, newMessage as Message);
    await communicateConversationHandler.loadConversation();
    await communicateConversationHandler.updateMessage(oldMessage, newMessage);
}));

client.on('messageDelete', ErrorHandler.wrapAsync(async (message) => {
    if ((message.channel as TextChannel).parentId !== ConfigHandler.config.conversationCatagory?.id || message.author?.bot) return;
    const communicateConversationHandler = new CommunicateConversationHandler(client, message as Message);
    await communicateConversationHandler.loadConversation();
    await communicateConversationHandler.deleteMessage(message);
}));

client.on('guildMemberAdd', ErrorHandler.wrapAsync(async member => {
    const memberRole = ConfigHandler.config.memberRole;
    memberRole && member.roles.add(memberRole);
}));

client.on('channelDelete', ErrorHandler.wrapAsync(async channel => {
    await DataBase.conversationsCollection.updateOne({ channelId: channel.id }, { $set: { open: false } });
}));