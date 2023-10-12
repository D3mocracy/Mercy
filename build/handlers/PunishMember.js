"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConversationManage_1 = require("../utils/MessageUtils/ConversationManage");
const db_1 = __importDefault(require("../utils/db"));
const Utils_1 = require("../utils/Utils");
const Logger_1 = __importDefault(require("./Logger"));
const mongodb_1 = require("mongodb");
class PunishMemberHandler {
    interaction;
    conversation = {};
    punish = "";
    reason = "";
    constructor(interaction) {
        this.interaction = interaction;
    }
    static async createHandler(interaction) {
        const handler = new PunishMemberHandler(interaction);
        await handler.load();
        return handler;
    }
    async load() {
        this.conversation = await db_1.default.conversationsCollection.findOne({ channelId: this.interaction.channelId });
    }
    async savePunish() {
        const punishment = {
            ...this.conversation,
            _id: new mongodb_1.ObjectId(),
            punishType: this.punish,
            reason: this.reason,
            punisherId: this.interaction.user.id,
            channelName: Utils_1.Utils.getChannelByIdNoClient(this.conversation.channelId).name,
            punishDate: new Date(),
        };
        await db_1.default.punishmentsCollection.insertOne({
            ...punishment
        });
        Logger_1.default.logPunishemnt(punishment);
    }
    static async sendPunishmentHistory(interaction) {
        const conversation = await db_1.default.conversationsCollection.findOne({ channelId: interaction.channelId });
        const member = Utils_1.Utils.getMemberByID(conversation.userId);
        const punishments = await db_1.default.punishmentsCollection.find({ userId: member?.id }).toArray();
        await interaction.reply({
            embeds: [ConversationManage_1.ConversationManageMessageUtils.EmbedMessages.punishmentHistoryMessage(punishments)],
            ephemeral: true
        });
    }
    async sendDMMessage() {
        const member = Utils_1.Utils.getMemberByID(this.conversation.userId);
        await member?.send({
            embeds: [ConversationManage_1.ConversationManageMessageUtils.EmbedMessages.punishDMMessage(this.punish, this.reason, Utils_1.Utils.getMemberByID("844537722466205706"))]
        });
    }
    async timeout() {
        const time = this.interaction.fields.getTextInputValue('punish_mute_time');
        const reason = this.interaction.fields.getTextInputValue('punish_mute_cause');
        const member = Utils_1.Utils.getMemberByID(this.conversation.userId);
        console.log(isNaN(+time), +time > 27, +time < 1);
        if (isNaN(+time) || +time > 27 || +time < 1) {
            this.interaction.reply({
                content: "שגיאה בכמות הימים - יש לכתוב ערך מספרי שלם בין 1 ל27 בלבד!",
                ephemeral: true
            });
            return;
        }
        if (member?.isCommunicationDisabled()) {
            this.interaction.reply({
                content: "לא ניתן להשתיק את המשתמש. קיימת השתקה קיימת",
                ephemeral: true
            });
            return;
        }
        this.punish = "timeout";
        this.reason = reason;
        await Promise.all([
            this.sendDMMessage(),
            this.interaction.reply({
                content: "הפעולה בוצעה בהצלחה, המשתמש הושתק ונשלחה אליו הודעת הסבר",
                ephemeral: true
            }),
            this.savePunish(),
            member?.timeout(1000 * 60 * 60 * 24 * +time, reason)
        ]);
        await this.closeConversation();
    }
    async kick() {
        const reason = this.interaction.fields.getTextInputValue('punish_kick_reason');
        this.punish = "kick";
        this.reason = reason;
        await Promise.all([
            this.sendDMMessage(),
            this.interaction.reply({
                content: "הפעולה בוצעה בהצלחה, המשתמש הוסר מהשרת ונשלחה אליו הודעת הסבר",
                ephemeral: true
            }),
            this.savePunish()
        ]);
        await Utils_1.Utils.getMemberByID(this.conversation.userId)?.kick(reason);
    }
    async ban() {
        const reason = this.interaction.fields.getTextInputValue('punish_ban_reason');
        this.punish = "ban";
        this.reason = reason;
        await Promise.all([
            this.sendDMMessage(),
            this.interaction.reply({
                content: "הפעולה בוצעה בהצלחה, המשתמש הוסר מהשרת לצמיתות ונשלחה אליו הודעת הסבר",
                ephemeral: true
            }),
            this.savePunish()
        ]);
        await Utils_1.Utils.getMemberByID(this.conversation.userId)?.ban({
            reason: reason
        });
    }
    async closeConversation() {
        const channel = Utils_1.Utils.getChannelByIdNoClient(this.conversation.channelId);
        const closedMessage = { embeds: [ConversationManage_1.ConversationManageMessageUtils.EmbedMessages.chatClosed("משתמש שיצא", channel.name)] };
        this.conversation.open = false;
        await Promise.all([
            channel.send(closedMessage),
            Logger_1.default.logTicket(channel),
            db_1.default.conversationsCollection.updateOne({ channelId: this.conversation.channelId }, { $set: this.conversation }, { upsert: true })
        ]);
        await channel.delete();
    }
}
exports.default = PunishMemberHandler;
//# sourceMappingURL=PunishMember.js.map