"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../utils/db"));
const discord_js_1 = require("discord.js");
const Utils_1 = require("../utils/Utils");
const Errors_1 = require("../utils/Errors");
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
        console.log(this.type);
        if (this.type === discord_js_1.ChannelType.DM) {
            await (await Utils_1.Utils.getChannelById(this.client, this.conversation.channelId)).send(this.message.content);
        }
        else if (this.type === discord_js_1.ChannelType.GuildText) {
            console.log('check');
            if (this.message.content.startsWith('!'))
                return;
            (await this.client.users.fetch(this.conversation.userId)).send(this.message.content);
        }
    }
}
exports.default = CommunicateConversationHandler;
//# sourceMappingURL=CommunicateConversation.js.map