"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalSubmitHandler = void 0;
const Config_1 = __importDefault(require("./Config"));
const db_1 = __importDefault(require("../utils/db"));
const ImportantLinks_1 = require("../utils/MessageUtils/ImportantLinks");
const ConversationManage_1 = require("../utils/MessageUtils/ConversationManage");
const MessageUtils_1 = require("../utils/MessageUtils");
const Errors_1 = require("../utils/Errors");
class ModalSubmitHandler {
    interaction;
    constructor(interaction) {
        this.interaction = interaction;
    }
    async referManager() {
        (await Config_1.default.config.requestHelperChannel?.send({
            content: `${Config_1.default.config.supervisorRole} ${Config_1.default.config.managerRole}`,
            embeds: [ConversationManage_1.ConversationManageMessageUtils.EmbedMessages.referSupervisor(this.interaction)],
            components: [ConversationManage_1.ConversationManageMessageUtils.Actions.supervisorRefferedTools(true, false), ConversationManage_1.ConversationManageMessageUtils.Actions.tools_report_link(`https://discord.com/channels/${Config_1.default.config.guild?.id}/${this.interaction.channelId}`)]
        }))?.edit({ content: null });
        await this.interaction.reply({ content: "ההפנייה נשלחה בהצלחה למפקחים", ephemeral: true });
    }
    async sendVacationMessage() {
        const [type, dateOne, dateTwo, cause] = [
            this.interaction.fields.getTextInputValue('vacation_type'),
            this.interaction.fields.getTextInputValue('vacation_date_one'),
            this.interaction.fields.getTextInputValue('vacation_date_two'),
            this.interaction.fields.getTextInputValue('vacation_cause'),
        ];
        await this.interaction.reply({ content: `בקשה להיעדרות או להפחתת פעילות נשלחה בהצלחה למנהלים`, ephemeral: true });
        (await Config_1.default.config.vacationChannel?.send({
            content: `${Config_1.default.config.managerRole}`,
            embeds: [MessageUtils_1.MessageUtils.EmbedMessages.vacation(this.interaction.member, type, dateOne, dateTwo, cause)],
            components: [MessageUtils_1.MessageUtils.Actions.disabledGreyButton(`סטטוס: בטיפול`)]
        }))?.edit({ content: null });
    }
    async sendVolunteerMessage() {
        const [dateOfBirth, aboutYourself, why, freq, other] = [
            this.interaction.fields.getTextInputValue('date_of_birth'),
            this.interaction.fields.getTextInputValue('about_yourself'),
            this.interaction.fields.getTextInputValue('why'),
            this.interaction.fields.getTextInputValue('freq'),
            this.interaction.fields.getTextInputValue('other'),
        ];
        (await Config_1.default.config.volunteerChannel?.send({
            content: `${Config_1.default.config.managerRole}`,
            embeds: [ImportantLinks_1.ImportantLinksMessageUtils.EmbedMessages.volunteer(this.interaction.user, dateOfBirth, aboutYourself, why, freq, other)],
        }))?.edit({ content: null });
        await db_1.default.volunteerCollection.insertOne({
            userId: this.interaction.user.id,
            createdAt: new Date(),
            dateOfBirth,
            aboutYourself,
            why,
            freq,
            other
        });
        await this.interaction.reply({ content: `הטופס שמילאתם עבור התנדבות לשרת נשלח בהצלחה למנהלים`, ephemeral: true });
    }
    async findChannel() {
        const channelNumber = +(this.interaction.fields.getTextInputValue("channel_number"));
        const conversation = await db_1.default.conversationsCollection.findOne({ channelNumber });
        if (!conversation)
            throw new Errors_1.CantLoadConversationFromDB;
        await this.interaction.reply({
            embeds: [ConversationManage_1.ConversationManageMessageUtils.EmbedMessages.findChannel(conversation)],
            ephemeral: true
        });
    }
    async suggestIdea() {
        const suggestExplain = this.interaction.fields.getTextInputValue("suggest_explain");
        const suggestComments = this.interaction.fields.getTextInputValue("suggest_comments");
        (await Config_1.default.config.suggestIdeasChannel?.send({
            content: `${Config_1.default.config.managerRole}`,
            embeds: [ImportantLinks_1.ImportantLinksMessageUtils.EmbedMessages.suggestIdea(suggestExplain, suggestComments, this.interaction.member)]
        }))?.edit({ content: null });
        await db_1.default.suggestionCollection.insertOne({
            userId: this.interaction.user.id,
            createdAt: new Date(),
            suggestExplain,
            suggestComments
        });
        await this.interaction.reply({ content: "הטופס שמילאתם עבור פידבקים, הצעות ודיווחי באגים נשלח בהצלחה למנהלים", ephemeral: true });
    }
    async reportHelper() {
        const helperName = this.interaction.fields.getTextInputValue("helperName");
        const reportCause = this.interaction.fields.getTextInputValue('reportHelperCause');
        (await Config_1.default.config.reportChannel?.send({
            content: `${Config_1.default.config.managerRole}`,
            embeds: [ImportantLinks_1.ImportantLinksMessageUtils.EmbedMessages.reportHelperMessage(helperName, reportCause)],
            components: [ConversationManage_1.ConversationManageMessageUtils.Actions.attachReport(false)]
        }))?.edit({ content: null });
        await db_1.default.reportCollection.insertOne({
            userId: this.interaction.user.id,
            createdAt: new Date(),
            helperName,
            reportCause,
        });
        await this.interaction.reply({ content: "הטופס שמילאתם עבור דיווחים ותלונות על חברי צוות נשלח בהצלחה למנהלים", ephemeral: true });
    }
    async criticalChat() {
        const channel = this.interaction.channel;
        if (channel.name.includes('❗')) {
            await this.interaction.reply({
                content: 'הפנייה בטיפול על ידי ההנהלה הגבוהה',
                ephemeral: true
            });
        }
        else {
            channel.setName(channel.name + " ❗");
            (await Config_1.default.config.requestHelperChannel?.send({
                content: `${Config_1.default.config.memberRole}`,
                embeds: [ConversationManage_1.ConversationManageMessageUtils.EmbedMessages.criticalChat(this.interaction)],
                components: [ConversationManage_1.ConversationManageMessageUtils.Actions.supervisorRefferedTools(true, false), ConversationManage_1.ConversationManageMessageUtils.Actions.tools_report_link(`https://discord.com/channels/${Config_1.default.config.guild?.id}/${this.interaction.channelId}`)]
            }))?.edit({ content: null });
            await this.interaction.reply({ content: "ההפנייה נשלחה בהצלחה להנהלה הגבוהה", ephemeral: true });
        }
    }
}
exports.ModalSubmitHandler = ModalSubmitHandler;
//# sourceMappingURL=ModalSubmit.js.map