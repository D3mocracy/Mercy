"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../utils/db"));
const discord_js_1 = require("discord.js");
const Utils_1 = require("../utils/Utils");
const Errors_1 = require("../utils/Errors");
const ConversationManage_1 = require("../utils/MessageUtils/ConversationManage");
class CommunicateConversationHandler {
    client;
    message;
    conversation = {};
    constructor(client, message) {
        this.client = client;
        this.message = message;
    }
    async handleSendMessage() {
        await this.loadConversation();
        await this.sendMessage();
    }
    async loadConversation() {
        if (this.message.channel.type === discord_js_1.ChannelType.DM) {
            this.conversation = await db_1.default.conversationsCollection.findOne({ userId: this.message.author.id, open: true });
        }
        else if (this.message.channel.type === discord_js_1.ChannelType.GuildText) {
            this.conversation = await db_1.default.conversationsCollection.findOne({ channelId: this.message.channel.id, open: true });
        }
        else {
            throw new Errors_1.CantLoadConversationFromDB();
        }
    }
    async updateMessage(oldMessage, newMessage) {
        if (!oldMessage.content || !newMessage.content || !this.conversation)
            return;
        if (this.message.channel.type === discord_js_1.ChannelType.DM) {
            const channel = Utils_1.Utils.getChannelById(this.client, this.conversation.channelId);
            const conversationMessage = (await channel.messages.fetch({ limit: 10 })).find(m => (m.content === oldMessage.content && m.author.bot));
            await conversationMessage?.edit(newMessage.content);
        }
        else if (this.message.channel.type === discord_js_1.ChannelType.GuildText) {
            const channel = this.client.users.cache.get(this.conversation.userId)?.dmChannel;
            const dmMessage = (await channel.messages.fetch({ limit: 10 })).find(m => (m.content === oldMessage.content && m.author.bot));
            await dmMessage?.edit(newMessage.content);
        }
    }
    async deleteMessage(message) {
        if (!message.content || !this.conversation)
            return;
        if (this.message.channel.type === discord_js_1.ChannelType.GuildText) {
            const channel = this.client.users.cache.get(this.conversation.userId)?.dmChannel;
            const dmMessage = (await channel.messages.fetch({ limit: 10 })).find(m => (m.content === message.content && m.author.bot));
            await dmMessage?.delete();
        }
    }
    async sendMessage() {
        if (this.message.channel.type === discord_js_1.ChannelType.DM) {
            const channel = Utils_1.Utils.getChannelById(this.client, this.conversation.channelId);
            await channel.sendTyping();
            channel.send(this.message.content);
        }
        else if (this.message.channel.type === discord_js_1.ChannelType.GuildText) {
            await this.client.users.cache.get(this.conversation.userId)?.dmChannel?.sendTyping();
            this.client.users.send(this.conversation.userId, this.message.content)
                .catch(() => {
                this.message.reply({
                    content: "המשתמש ביטל את האפשרות לכתיבת הודעות לאחר פתיחת הצ'אט",
                    components: [new discord_js_1.ActionRowBuilder().addComponents(ConversationManage_1.ConversationManageMessageUtils.Actions.tools_close)]
                });
            });
        }
    }
}
exports.default = CommunicateConversationHandler;
//# sourceMappingURL=CommunicateConversation.js.map