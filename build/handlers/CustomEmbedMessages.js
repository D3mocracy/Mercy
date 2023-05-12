"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const db_1 = __importDefault(require("../utils/db"));
const Utils_1 = require("../utils/Utils");
class CustomEmbedMessages {
    client;
    key;
    channelId;
    message = {};
    constructor(client, key, channelId) {
        this.client = client;
        this.key = key;
        this.channelId = channelId;
        this.key = key;
        this.channelId = channelId;
    }
    async load() {
        return this.message = await db_1.default.embedMessagesCollection.findOne({ key: this.key });
    }
    static getKeyFromMessage(message) {
        return message.split('&')[1];
    }
    static async createHandler(client, key, channelId) {
        const handler = new CustomEmbedMessages(client, key, channelId);
        const message = await handler.load();
        if (message) {
            return handler;
        }
        else {
            return;
        }
    }
    async sendMessage() {
        Utils_1.Utils.getChannelById(this.client, this.channelId).send({
            embeds: [
                new discord_js_1.EmbedBuilder({
                    ...this.message,
                    color: undefined,
                }).setColor(this.message.color)
            ]
        });
    }
}
exports.default = CustomEmbedMessages;
//# sourceMappingURL=CustomEmbedMessages.js.map