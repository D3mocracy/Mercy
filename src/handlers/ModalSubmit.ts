import { ModalSubmitInteraction } from "discord.js"
import ConfigHandler from "./Config";
import { Utils } from "../utils/Utils";
import DataBase from "../utils/db";
import { Conversation } from "../utils/types";
import { ImportantLinksMessageUtils } from "../utils/MessageUtils/ImportantLinks";
import { ConversationManageMessageUtils } from "../utils/MessageUtils/ConversationManage";

export class ModalSubmitHandler {

    constructor(protected interaction: ModalSubmitInteraction) { }

    async referManager() {
        await ConfigHandler.config.requestHelperChannel.send({
            content: `${ConfigHandler.config.managerRole}`,
            embeds: [ConversationManageMessageUtils.EmbedMessages.referManager(this.interaction)],
            components: [ConversationManageMessageUtils.Actions.markAsDone(false), ConversationManageMessageUtils.Actions.tools_report_link(`https://discord.com/channels/${ConfigHandler.config.guild.id}/${this.interaction.channelId}`)]
        });
        await this.interaction.reply({ content: "הבקשה שלך נשלחה בהצלחה למנהלים", ephemeral: true });
    }

    async suggestIdea() {
        await ConfigHandler.config.suggestIdeasChannel.send({
            content: `${ConfigHandler.config.managerRole}`,
            embeds: [ImportantLinksMessageUtils.EmbedMessages.suggestIdea(this.interaction)]
        });
        await this.interaction.reply({ content: "ההצעה שלך נשלחה בהצלחה למנהלים", ephemeral: true });
    }

    async reportHelper() {
        let helpers: string = "";
        const lastConversation: Conversation = await DataBase.conversationsCollection.findOne({ userId: this.interaction.user.id, open: true }) ||
            await DataBase.conversationsCollection.find({ userId: this.interaction.user.id }).sort({ _id: -1 }).limit(1).next() as any;

        (lastConversation && lastConversation.staffMemberId)
            ? helpers = Utils.getMembersById(...lastConversation.staffMemberId).map(member => member?.displayName).join(', ')
            : helpers = "לא נמצא צ'אט אחרון / המשתמש לא פתח צ'אט / לא שויך תומך לצ'אט האחרון"

        await ConfigHandler.config.reportChannel.send({
            content: `${ConfigHandler.config.managerRole}`,
            embeds: [await ImportantLinksMessageUtils.EmbedMessages.reportHelperMessage(this.interaction, helpers)],
            components: [ConversationManageMessageUtils.Actions.attachReport(false)]
        });
        await this.interaction.reply({ content: "הדיווח שלך נשלח בהצלחה למנהלים", ephemeral: true });
    }

}