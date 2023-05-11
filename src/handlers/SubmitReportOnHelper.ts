import { ModalSubmitInteraction, TextChannel } from "discord.js";
import DataBase from "../utils/db";
import { MessageUtils } from "../utils/MessageUtils";
import { Conversation } from "../utils/types";
import { Utils } from "../utils/Utils";
import ConfigHandler from "./Config";

/**
 * This is not useable due the button trigger is not in the chat anymore
 * @deprecated
 */
export class ReportOnHelperHandler {
    constructor(private interaction: ModalSubmitInteraction) { }

    private async reply() {
        await this.interaction.reply({ content: "הדיווח שלך נשלח בהצלחה למנהלים", ephemeral: true });
    }

    private async StaffReport() {
        const conversation: Conversation = await DataBase.conversationsCollection.findOne({ userId: this.interaction.user.id, open: true }) ||
            await DataBase.conversationsCollection.find({ userId: this.interaction.user.id, open: false }).sort({ _id: -1 }).limit(1).next() as any;
        if (!conversation.staffMemberId) return;
        const helpers = Utils.getMembersById(...conversation.staffMemberId).map(member => member?.displayName).join(', ');
        const reportChannel: TextChannel = ConfigHandler.config.requestHelperChannel;
        if (!reportChannel) return;
        await reportChannel.send({
            content: `<@&${ConfigHandler.config.managerRole}>`,
            embeds: [await MessageUtils.EmbedMessages.reportHelperMessage(this.interaction, helpers)],
            components: [MessageUtils.Actions.attachReport(false), MessageUtils.Actions.tools_report_link(`https://discord.com/channels/${ConfigHandler.config.guild.id}/${conversation.channelId}`)]
        });
    }

    async handle() {
        await this.StaffReport();
        await this.reply();

    }
}