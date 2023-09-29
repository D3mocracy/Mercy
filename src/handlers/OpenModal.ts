import { ButtonInteraction } from "discord.js";
import { ImportantLinksMessageUtils } from "../utils/MessageUtils/ImportantLinks";
import DataBase from "../utils/db";

class OpenModalHandler {

    constructor(private interaction: ButtonInteraction) { }

    static async load() {

    }

    async openModal() {
        const checkUpDate = new Date();

        switch (this.interaction.customId) {
            case "user_report_helper":
                checkUpDate.setDate(checkUpDate.getDate() - 1);
                const reports = await DataBase.reportCollection.find({
                    userId: this.interaction.user.id,
                    createdAt: { $gt: checkUpDate }
                }).toArray();

                reports.length >= 1
                    ? await this.interaction.reply({ content: "ניתן לשלוח תלונה על חבר צוות אחת ל24 שעות, נסה שוב במועד מאוחר יותר", ephemeral: true })
                    : await this.interaction.showModal(ImportantLinksMessageUtils.Modals.reportHelperModal);
                break;

            case "user_volunteer":
                checkUpDate.setDate(checkUpDate.getDate() - 14);
                const volunteers = await DataBase.volunteerCollection.find({
                    userId: this.interaction.user.id,
                    createdAt: { $gt: checkUpDate }
                }).toArray();

                volunteers.length >= 1
                    ? await this.interaction.reply({ content: "ניתן להגיש טופס התנדבות בשרת אחת לשבועיים, נסה שוב במועד מאוחר יותר", ephemeral: true })
                    : await this.interaction.showModal(ImportantLinksMessageUtils.Modals.volunteerModal);
                break;

            case "user_suggest":
                checkUpDate.setDate(checkUpDate.getDate() - 1);
                const suggestion = await DataBase.suggestionCollection.find({
                    userId: this.interaction.user.id,
                    createdAt: { $gt: checkUpDate }
                }).toArray();

                suggestion.length >= 1
                    ? await this.interaction.reply({ content: "ניתן לשלוח הצעת שיפור ופידבק אחת ל24 שעות, נסה שוב במועד מאוחר יותר", ephemeral: true })
                    : await this.interaction.showModal(ImportantLinksMessageUtils.Modals.suggestIdeaModal);
                break;

            default:
                break;
        }
    }


}

export default OpenModalHandler;