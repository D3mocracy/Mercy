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
            ? (this.conversation = (await db_1.default.conversationsCollection.findOne({
                userId: this.interaction.user.id,
                open: true,
            })))
            : (this.conversation = (await db_1.default.conversationsCollection.findOne({
                channelId: this.interaction.channelId,
                open: true,
            })));
        if (this.conversation) {
            this.channel = Utils_1.Utils.getChannelById(this.client, this.conversation.channelId);
        }
        else {
            throw new Errors_1.CantLoadConversationFromDB();
        }
    }
    async saveConversation() {
        await db_1.default.conversationsCollection.updateOne({ channelId: this.conversation.channelId }, { $set: this.conversation }, { upsert: true });
    }
    async sendSureMessageToClose() {
        await this.interaction.reply({
            embeds: [MessageUtils_1.MessageUtils.EmbedMessages.sureMessageToClose],
            components: [
                ConversationManage_1.ConversationManageMessageUtils.Actions.tools_sure_close_yes_no(),
            ],
            ephemeral: true
        });
    }
    async openRefferSupervisorModal() {
        if ((!this.conversation.staffMemberId?.includes(this.interaction.user.id)
            && Utils_1.Utils.isHelper(this.interaction.user.id)
            && !Utils_1.Utils.isAdministrator(this.interaction.user.id)) || Utils_1.Utils.isSupervisor(this.interaction.user.id)) {
            await this.interaction.reply({
                content: "אין לך הרשאות להפנות למפקחים",
                ephemeral: true,
            });
            return;
        }
        else {
            await this.interaction.showModal(MessageUtils_1.MessageUtils.Modals.referManagerModal);
        }
    }
    async closeConversation(closedBy) {
        if (!this.conversation.staffMemberId?.includes(this.interaction.user.id)
            && Utils_1.Utils.isHelper(this.interaction.user.id)
            && !this.interaction.channel?.isDMBased()
            && !Utils_1.Utils.isAdministrator(this.interaction.user.id)) {
            await this.interaction.reply({
                content: "אין לך הרשאות לסגור את הצ'אט",
                ephemeral: true,
            });
            return;
        }
        const closedMessage = {
            embeds: [
                ConversationManage_1.ConversationManageMessageUtils.EmbedMessages.chatClosed(closedBy, this.channel?.name),
            ],
        };
        this.conversation.open = false;
        await this.channel.send(closedMessage);
        const user = this.client.users.cache.get(this.conversation.userId);
        Promise.all([
            Logger_1.default.logTicket(this.channel, user),
            user?.send(closedMessage) || "",
        ])
            .catch((error) => {
            console.log("Can not send message to this user - This Error is fine");
            Logger_1.default.logError(error);
        })
            .finally(() => this.channel.delete());
    }
    async attachHelper(staffMemberId) {
        if ((Utils_1.Utils.getHelperClaimedConversationNumber(staffMemberId) >= 2) && Utils_1.Utils.isHelper(staffMemberId)) {
            await this.interaction.reply({
                ephemeral: true,
                content: "ניתן לשייך עד 2 צ'אטים",
            });
            return;
        }
        if (!this.conversation.staffMemberId
            || this.conversation.staffMemberId.length === 0
            || Utils_1.Utils.isSeniorStaff(this.interaction.user.id)) {
            this.conversation.staffMemberId = [staffMemberId];
            await Promise.all([
                Utils_1.Utils.updatePermissionToChannel(this.client, this.conversation),
                this.interaction.reply({
                    embeds: [
                        ConversationManage_1.ConversationManageMessageUtils.EmbedMessages.staffMemberAttached(this.interaction.user.toString()),
                    ],
                }),
            ]);
            return;
        }
        await this.interaction.reply({
            ephemeral: true,
            content: "לא ניתן לבצע שיוך עצמי - הצ'אט כבר משויך לחבר צוות",
        });
    }
    async revealUser() {
        if (!Config_1.default.config.guild?.members.cache
            .get(this.interaction.user.id)
            ?.permissions.has("Administrator")) {
            await this.interaction.reply({
                content: "אין לך מספיק הרשאות כדי לבצע פעולה זו",
                ephemeral: true,
            });
            return;
        }
        await this.interaction.reply({
            ephemeral: true,
            embeds: [
                await ConversationManage_1.ConversationManageMessageUtils.EmbedMessages.revealUserMessage(this.conversation.userId),
            ],
        });
    }
    async resetHelpers() {
        this.conversation.staffMemberId = [];
        await Utils_1.Utils.updatePermissionToChannel(this.client, this.conversation);
        await this.interaction.channel.send({
            embeds: [ConversationManage_1.ConversationManageMessageUtils.EmbedMessages.helpersReseted],
        });
    }
    async changeHelpersMessage() {
        const helpersList = Config_1.default.config.helperRole?.members.map((m) => m);
        if (helpersList?.length) {
            await this.interaction.reply({
                ephemeral: true,
                embeds: [ConversationManage_1.ConversationManageMessageUtils.EmbedMessages.changeHelper],
                components: [
                    ConversationManage_1.ConversationManageMessageUtils.Actions.changeHelper(helpersList),
                    ConversationManage_1.ConversationManageMessageUtils.Actions.resetHelpers,
                ],
            });
        }
        else {
            await this.interaction.reply({
                content: "לא קיים משתמש עם דרגת תומך בשרת",
                ephemeral: true,
            });
        }
    }
    async sendPunishMessage() {
        await this.interaction.reply({
            embeds: [ConversationManage_1.ConversationManageMessageUtils.EmbedMessages.punishMessage],
            components: [ConversationManage_1.ConversationManageMessageUtils.Actions.punishMenu()],
            ephemeral: true
        });
    }
}
exports.default = ConversationManageHandler;
//# sourceMappingURL=ConversationManage.js.map