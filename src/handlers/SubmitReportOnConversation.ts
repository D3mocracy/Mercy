import { ModalSubmitInteraction, TextChannel } from "discord.js";
import { MessageUtils } from "../utils/MessageUtils";
import { Utils } from "../utils/Utils";
import ConfigHandler from "./Config";

export class ReportOnConversationHandler {
    constructor(private interaction: ModalSubmitInteraction) {
        this.interaction = interaction;
    }

    private async reply() {
        await this.interaction.reply({ content: "הדיווח שלך נשלח בהצלחה למנהלים", ephemeral: true });
    }

    private async conversationReport() {
        const reportChannel: TextChannel = ConfigHandler.config.reportChannel;
        if (!reportChannel) return;
        await reportChannel.send({
            content: `<@&${ConfigHandler.config.managerRole}>`,
            embeds: [await MessageUtils.EmbedMessages.referManager(this.interaction)],
            components: [MessageUtils.Actions.attachReport(false), MessageUtils.Actions.tools_report_link(`https://discord.com/channels/${ConfigHandler.config.guild.id}/${this.interaction.channelId}`)]
        });
    }

    async handle() {
        await this.conversationReport();
        await this.reply();

    }
}