import { ButtonInteraction, StringSelectMenuInteraction } from "discord.js";
import { ImportantLinksMessageUtils } from "../utils/MessageUtils/ImportantLinks";
import DataBase from "../utils/db";
import { ConversationManageMessageUtils } from "../utils/MessageUtils/ConversationManage";
import PunishMemberHandler from "./PunishMember";

class OpenModalHandler {

    constructor(private interaction: ButtonInteraction | StringSelectMenuInteraction) { }

    static async load() {

    }

    async openModal() {
        const checkUpDate = new Date();
        const customId = this.interaction instanceof ButtonInteraction ? this.interaction.customId : this.interaction.values[0];

        switch (customId) {
            case "user_report_helper":
                checkUpDate.setDate(checkUpDate.getDate() - 1);
                const reports = await DataBase.reportCollection.find({
                    userId: this.interaction.user.id,
                    createdAt: { $gt: checkUpDate }
                }).toArray();

                reports.length >= 1
                    ? await this.interaction.reply({ content: "ניתן להגיש טופס דיווחים ותלונות על חברי צוות אחת ל-24 שעות, נסו שוב במועד מאוחר יותר", ephemeral: true })
                    : await this.interaction.showModal(ImportantLinksMessageUtils.Modals.reportHelperModal);
                break;

            case "user_volunteer":
                checkUpDate.setDate(checkUpDate.getDate() - 14);
                const volunteers = await DataBase.volunteerCollection.find({
                    userId: this.interaction.user.id,
                    createdAt: { $gt: checkUpDate }
                }).toArray();

                volunteers.length >= 1
                    ? await this.interaction.reply({ content: "ניתן להגיש טופס התנדבות בשרת אחת לשבועיים, נסו שוב במועד מאוחר יותר", ephemeral: true })
                    : await this.interaction.showModal(ImportantLinksMessageUtils.Modals.volunteerModal);
                break;

            case "user_suggest":
                checkUpDate.setDate(checkUpDate.getDate() - 1);
                const suggestion = await DataBase.suggestionCollection.find({
                    userId: this.interaction.user.id,
                    createdAt: { $gt: checkUpDate }
                }).toArray();

                suggestion.length >= 1
                    ? await this.interaction.reply({ content: "ניתן להגיש טופס פידבקים, הצעות ודיווחי באגים אחת ל-24 שעות, נסו שוב במועד מאוחר יותר", ephemeral: true })
                    : await this.interaction.showModal(ImportantLinksMessageUtils.Modals.suggestIdeaModal);
                break;

            case "punish_timeout":
                await this.interaction.showModal(ConversationManageMessageUtils.Modals.punishMuteModal);
                break;

            case "punish_kick":
                await this.interaction.showModal(ConversationManageMessageUtils.Modals.punishKickModal);
                break;

            case "punish_ban":
                await this.interaction.showModal(ConversationManageMessageUtils.Modals.punishBanModal);
                break;

            case "punish_history":
                await PunishMemberHandler.sendPunishmentHistory(this.interaction as StringSelectMenuInteraction)
                break;

            default:
                break;
        }
    }


}

export default OpenModalHandler;