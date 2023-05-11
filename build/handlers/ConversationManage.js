"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../utils/db"));
const MessageUtils_1 = require("../utils/MessageUtils");
const Utils_1 = require("../utils/Utils");
const Logger_1 = __importDefault(require("./Logger"));
const Errors_1 = require("../utils/Errors");
const Config_1 = __importDefault(require("./Config"));
const ConversationManage_1 = require("../utils/MessageUtils/ConversationManage");
class ConversationManageHandler {
    client;
    interaction;
    channel = {};
    conversation = {};
    constructor(client, interaction) {
        this.client = client;
        this.interaction = interaction;
    }
    static async createHandler(client, interaction) {
        const handler = new ConversationManageHandler(client, interaction);
        await handler.loadConversation();
        return handler;
    }
    async loadConversation() {
        this.interaction.channel?.isDMBased()
            ? this.conversation = await db_1.default.conversationsCollection.findOne({ userId: this.interaction.user.id, open: true })
            : this.conversation = await db_1.default.conversationsCollection.findOne({ channelId: this.interaction.channelId, open: true });
        if (this.conversation) {
            this.channel = await Utils_1.Utils.getChannelById(this.client, this.conversation.channelId);
        }
        else {
            throw new Errors_1.CantLoadConversationFromDB();
        }
    }
    async saveConversation() {
        await db_1.default.conversationsCollection.updateOne({ channelId: this.conversation.channelId }, { $set: this.conversation }, { upsert: true });
    }
    static async sendManageTools(interaction) {
        if (await Utils_1.Utils.isTicketChannel(interaction.channel)) {
            await interaction.reply({
                embeds: [ConversationManage_1.ConversationManageMessageUtils.EmbedMessages.newChatStaff()],
                components: [ConversationManage_1.ConversationManageMessageUtils.Actions.supporterTools]
            });
        }
        else {
            await interaction.reply({ content: "ניתן לבצע את הפקודה הזו רק בצ'אטים", ephemeral: true });
        }
    }
    async sendSureMessageToClose() {
        await this.interaction.reply({ embeds: [MessageUtils_1.MessageUtils.EmbedMessages.sureMessageToClose], components: [ConversationManage_1.ConversationManageMessageUtils.Actions.tools_sure_close_yes_no()] });
    }
    async closeConversation(closedBy) {
        await this.interaction.deferUpdate();
        const closedMessage = { embeds: [ConversationManage_1.ConversationManageMessageUtils.EmbedMessages.chatClosed(closedBy, this.channel.name)] };
        this.conversation.open = false;
        await this.channel.send(closedMessage);
        Promise.all([
            Logger_1.default.logTicket(this.channel),
            this.interaction.message.edit({ components: [] }),
            this.client.users.cache?.get(this.conversation.userId)?.send(closedMessage) || "",
        ]).finally(() => this.channel.delete());
    }
    async attachHelper(staffMemberId) {
        if (!this.conversation.staffMemberId || this.conversation.staffMemberId.length === 0) {
            this.conversation.staffMemberId = [staffMemberId];
            await Promise.all([
                Utils_1.Utils.updatePermissionToChannel(this.client, this.conversation),
                this.interaction.reply({ embeds: [ConversationManage_1.ConversationManageMessageUtils.EmbedMessages.staffMemberAttached(this.interaction.user.toString())] })
            ]);
            return;
        }
        await this.interaction.reply({ ephemeral: true, content: "פסססטט...הצ'אט הזה כבר שויך למישהו" });
    }
    async revealUser() {
        if (!(await Config_1.default.config.guild.members.fetch(this.interaction.user.id)).permissions.has("Administrator")) {
            await this.interaction.reply({ content: "אין לך מספיק הרשאות כדי לבצע פעולה זו", ephemeral: true });
            return;
        }
        await this.interaction.reply({
            ephemeral: true,
            embeds: [await ConversationManage_1.ConversationManageMessageUtils.EmbedMessages.revealUserMessage(this.client, this.conversation.userId)]
        });
    }
    async resetHelpers() {
        this.conversation.staffMemberId = [];
        await Utils_1.Utils.updatePermissionToChannel(this.client, this.conversation);
        await this.interaction.channel.send({ embeds: [ConversationManage_1.ConversationManageMessageUtils.EmbedMessages.helpersReseted] });
    }
    async changeHelpersMessage() {
        const helpersList = (await Utils_1.Utils.getUsersWithRoleId('1036014794806939648')).map(m => m);
        if (helpersList.length) {
            await this.interaction.reply({
                ephemeral: true,
                embeds: [ConversationManage_1.ConversationManageMessageUtils.EmbedMessages.changeHelper],
                components: [ConversationManage_1.ConversationManageMessageUtils.Actions.changeHelper(helpersList),
                    ConversationManage_1.ConversationManageMessageUtils.Actions.resetHelpers]
            });
        }
        else {
            await this.interaction.reply({ content: "לא קיים משתמש עם דרגת תומך בשרת", ephemeral: true });
        }
    }
}
exports.default = ConversationManageHandler;
//# sourceMappingURL=ConversationManage.js.map