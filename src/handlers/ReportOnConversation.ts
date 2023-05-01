import { ActionRow, ActionRowBuilder, ModalSubmitInteraction, TextChannel } from "discord.js";
import { config } from "..";
import DataBase from "../utils/db";
import { MessageUtils } from "../utils/MessageUtils";
import { Conversation } from "../utils/types";
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
        const reportChannel: TextChannel = await Utils.client.channels.fetch(config.reportChannelId) as any;
        if (!reportChannel) return;
        await reportChannel.send({
            content: `<@&${config.managerRole}>`,
            embeds: [await MessageUtils.EmbedMessages.reportConversationMessage(this.interaction)],
            components: [MessageUtils.Actions.attachReport(false), MessageUtils.Actions.tools_report_link(`https://discord.com/channels/${config.guildId}/${this.interaction.channelId}`)]
        });
    }

    async handle() {
        await this.conversationReport();
        await this.reply();

    }
}