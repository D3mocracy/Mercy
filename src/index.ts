require("dotenv").config();
import { Utils } from "./utils/Utils";
import ConversationHandler from "./handlers/Conversation";
import ConversationStaffToolsHandler from "./handlers/ConversationStaffTools";
import ChangeHelperHandler from "./handlers/ChangeHelper";
import ReportHandler from "./handlers/Report";
import { TextChannel } from "discord.js";
import LeaveGuildHandler from "./handlers/LeaveGuild";
import DMConversationHandler from "./handlers/DMConversation";
import ConfigHandler from "./handlers/Config";
import { Config } from "./utils/types";
import CustomEmbedMessages from "./handlers/CustomEmbedMessages";

export let config: Config = {} as any;

Utils.turnOnBot().then(async () => {
    config = await new ConfigHandler().getConfig();
});

const bot = Utils.client;

bot.once('ready', () => {
    console.log(`Logged in as ${bot!.user?.tag}!`);
    // (bot.channels.cache.get("1035880270064259084") as TextChannel)?.send("I'm awake!") || "";
});

bot.on('messageCreate', async message => {
    if (message.author.bot || message.attachments.size > 0 || message.stickers.size > 0) return;

    try {
        if (message.content.startsWith('&')) {
            await (await CustomEmbedMessages.createHandler(CustomEmbedMessages.getKeyFromMessage(message.content), message.channelId)).sendMessage();
        }
    } catch (error) {
        console.log(error);

    }

    if (await Utils.isGuildMember(message.author.id)) {
        await new ConversationHandler(message).handle();

    } else {
        await message.reply("היי, לא נראה שאתה חלק מהשרת האנונימי");
    }
});

bot.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        if (interaction.customId === "yes_conv" || interaction.customId === "no_conv") return;
        if (interaction.channel?.isDMBased()) {
            await new DMConversationHandler(interaction).handle();
        } else {
            await new ConversationStaffToolsHandler(interaction).handle();
        }
    } else if (interaction.isSelectMenu()) {
        await new ChangeHelperHandler(interaction).handle();
    } else if (interaction.isModalSubmit()) {
        await new ReportHandler(interaction).handle();
    }
});

bot.on('guildMemberRemove', async member => {
    await new LeaveGuildHandler(member.user.id).handle();
});