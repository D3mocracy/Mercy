"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../utils/db"));
const MessageUtils_1 = require("../utils/MessageUtils");
const Utils_1 = require("../utils/Utils");
const Logger_1 = __importDefault(require("./Logger"));
class LeaveGuildHandler {
    client;
    userId;
    conversation = {};
    constructor(client, userId) {
        this.client = client;
        this.userId = userId;
    }
    async loadConversation() {
        this.conversation = await db_1.default.conversationsCollection.findOne({ userId: this.userId, open: true });
    }
    async saveConversation() {
        await db_1.default.conversationsCollection.updateOne({ channelId: this.conversation.channelId }, { $set: this.conversation }, { upsert: true });
    }
    async closeConversation() {
        if (!this.conversation.userId)
            return;
        const channel = await Utils_1.Utils.getChannelById(this.client, this.conversation.channelId);
        const closedMessage = { embeds: [MessageUtils_1.MessageUtils.EmbedMessages.chatClosed("משתמש שיצא", channel.name)] };
        this.conversation.open = false;
        await Promise.all([
            channel.send(closedMessage),
            Logger_1.default.logTicket(channel),
        ]);
        await channel.delete();
        this.saveConversation();
    }
}
exports.default = LeaveGuildHandler;
//# sourceMappingURL=LeaveGuild.js.map