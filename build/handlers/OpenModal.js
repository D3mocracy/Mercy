"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const ImportantLinks_1 = require("../utils/MessageUtils/ImportantLinks");
const db_1 = __importDefault(require("../utils/db"));
const ConversationManage_1 = require("../utils/MessageUtils/ConversationManage");
const PunishMember_1 = __importDefault(require("./PunishMember"));
class OpenModalHandler {
    interaction;
    constructor(interaction) {
        this.interaction = interaction;
    }
    static async load() {
    }
    async openModal() {
        const checkUpDate = new Date();
        const customId = this.interaction instanceof discord_js_1.ButtonInteraction ? this.interaction.customId : this.interaction.values[0];
        switch (customId) {
            case "user_report_helper":
                checkUpDate.setDate(checkUpDate.getDate() - 1);
                const reports = await db_1.default.reportCollection.find({
                    userId: this.interaction.user.id,
                    createdAt: { $gt: checkUpDate }
                }).toArray();
                reports.length >= 1
                    ? await this.interaction.reply({ content: "ניתן להגיש טופס דיווחים ותלונות על חברי צוות אחת ל-24 שעות, נסו שוב במועד מאוחר יותר", ephemeral: true })
                    : await this.interaction.showModal(ImportantLinks_1.ImportantLinksMessageUtils.Modals.reportHelperModal);
                break;
            case "user_volunteer":
                checkUpDate.setDate(checkUpDate.getDate() - 14);
                const volunteers = await db_1.default.volunteerCollection.find({
                    userId: this.interaction.user.id,
                    createdAt: { $gt: checkUpDate }
                }).toArray();
                volunteers.length >= 1
                    ? await this.interaction.reply({ content: "ניתן להגיש טופס התנדבות בשרת אחת לשבועיים, נסו שוב במועד מאוחר יותר", ephemeral: true })
                    : await this.interaction.showModal(ImportantLinks_1.ImportantLinksMessageUtils.Modals.volunteerModal);
                break;
            case "user_suggest":
                checkUpDate.setDate(checkUpDate.getDate() - 1);
                const suggestion = await db_1.default.suggestionCollection.find({
                    userId: this.interaction.user.id,
                    createdAt: { $gt: checkUpDate }
                }).toArray();
                suggestion.length >= 1
                    ? await this.interaction.reply({ content: "ניתן להגיש טופס פידבקים, הצעות ודיווחי באגים אחת ל-24 שעות, נסו שוב במועד מאוחר יותר", ephemeral: true })
                    : await this.interaction.showModal(ImportantLinks_1.ImportantLinksMessageUtils.Modals.suggestIdeaModal);
                break;
            case "punish_timeout":
                await this.interaction.showModal(ConversationManage_1.ConversationManageMessageUtils.Modals.punishMuteModal);
                break;
            case "punish_kick":
                await this.interaction.showModal(ConversationManage_1.ConversationManageMessageUtils.Modals.punishKickModal);
                break;
            case "punish_ban":
                await this.interaction.showModal(ConversationManage_1.ConversationManageMessageUtils.Modals.punishBanModal);
                break;
            case "punish_history":
                await PunishMember_1.default.sendPunishmentHistory(this.interaction);
                break;
            default:
                break;
        }
    }
}
exports.default = OpenModalHandler;
//# sourceMappingURL=OpenModal.js.map