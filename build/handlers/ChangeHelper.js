"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../utils/db"));
const MessageUtils_1 = require("../utils/MessageUtils");
const Utils_1 = require("../utils/Utils");
class ChangeHelperHandler {
    interaction;
    conversation = {};
    constructor(interaction) {
        this.interaction = interaction;
    }
    async loadConversation() {
        this.conversation = await db_1.default.conversationsCollection.findOne({ channelId: this.interaction.channelId, open: true });
    }
    async saveConversation() {
        await db_1.default.conversationsCollection.updateOne({ channelId: this.interaction.channelId, open: true }, { $set: this.conversation }, { upsert: true });
    }
    async handle() {
        await this.loadConversation();
        if (this.interaction.customId === "helpers_list") {
            this.conversation.staffMemberId = (this.interaction.values || "");
        }
        await this.saveConversation();
        const newPermission = await Utils_1.Utils.updatePermissionToChannel(this.conversation); //Can't import messageUtils from Utils
        if (!newPermission)
            return;
        await newPermission.channel.send({ embeds: [MessageUtils_1.MessageUtils.EmbedMessages.staffMemberAttached(newPermission.usernames.join(', '))] });
        await this.interaction.deferUpdate();
    }
}
exports.default = ChangeHelperHandler;
//# sourceMappingURL=ChangeHelper.js.map