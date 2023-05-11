"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../utils/Utils");
const discord_js_1 = require("discord.js");
const db_1 = __importDefault(require("../utils/db"));
const MessageUtils_1 = require("../utils/MessageUtils");
const Config_1 = __importDefault(require("./Config"));
class StartConversation {
    interaction;
    constructor(interaction) {
        this.interaction = interaction;
        this.interaction = interaction;
    }
    async precondition() {
        const openConversation = await Utils_1.Utils.getOpenConversation(this.interaction.user.id);
        openConversation
            ? this.interaction.reply({
                content: "היי, נראה שכבר יש לך צ'אט פתוח",
                components: [MessageUtils_1.MessageUtils.Actions.linkButton(`https://discord.com/channels/${Config_1.default.config.guild.id}/${openConversation.channelId}`, "העבר אותי לצ'אט")],
                ephemeral: true
            })
            : this.createConversation();
    }
    async createConversation() {
        const numberOfConversation = await Utils_1.Utils.getNumberOfConversationFromDB() + 1;
        const convChannel = await Config_1.default.config.guild.channels.create({
            name: `צ'אט מספר ${numberOfConversation}`,
            type: discord_js_1.ChannelType.GuildText,
            parent: Config_1.default.config.conversationCatagory
        });
        await Promise.all([
            this.interaction.user.send({
                embeds: [MessageUtils_1.MessageUtils.EmbedMessages.newChatUser(numberOfConversation)],
                components: [new discord_js_1.ActionRowBuilder().addComponents(MessageUtils_1.MessageUtils.Actions.tools_close)]
            }),
            convChannel.send({
                content: `<@&${Config_1.default.config.helperRole}>`,
                embeds: [MessageUtils_1.MessageUtils.EmbedMessages.newChatStaff()],
                components: [MessageUtils_1.MessageUtils.Actions.supporterTools]
            }).then(message => message.edit({ content: null })),
            db_1.default.conversationsCollection.insertOne({
                userId: this.interaction.user.id,
                guildId: Config_1.default.config.guild.id,
                channelId: convChannel.id,
                open: true,
                date: new Date()
            }),
        ]);
    }
}
exports.default = StartConversation;
//# sourceMappingURL=StartConversation.js.map