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
    type;
    conversation = {};
    constructor(client, message, type) {
        this.client = client;
        this.message = message;
        this.type = type;
    }
    async handle() {
        await this.loadConversation();
        await this.sendMessage();
    }
    async loadConversation() {
        if (this.type === discord_js_1.ChannelType.DM) {
            this.conversation = await db_1.default.conversationsCollection.findOne({ userId: this.message.author.id, open: true });
        }
        else if (this.type === discord_js_1.ChannelType.GuildText) {
            this.conversation = await db_1.default.conversationsCollection.findOne({ channelId: this.message.channel.id, open: true });
        }
        else {
            throw new Errors_1.CantLoadConversationFromDB();
        }
    }
    async sendMessage() {
        if (this.type === discord_js_1.ChannelType.DM) {
            const channel = Utils_1.Utils.getChannelById(this.client, this.conversation.channelId);
            await channel.sendTyping();
            channel.send(this.message.content);
        }
        else if (this.type === discord_js_1.ChannelType.GuildText) {
            if (this.message.content.startsWith('!'))
                return;
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