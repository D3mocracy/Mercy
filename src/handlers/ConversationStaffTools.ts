import { ButtonInteraction, EmbedBuilder } from "discord.js"
import { MessageUtils } from "../utils/MessageUtils";
import { ConversationManageMessageUtils } from "../utils/MessageUtils/ConversationManage";

class ConversationStaffToolsHandler {
    constructor(private interaction: ButtonInteraction) {
        this.interaction = interaction;
    }

    async managerAttachReport() {
        const newEmbed = new EmbedBuilder(this.interaction.message.embeds[0].data);
        newEmbed.setColor(0x33C76E);
        newEmbed.data.fields!.find(field => field.name === "מנהל מטפל")!.value = this.interaction.user.username;
        newEmbed.data.thumbnail = { url: "https://cdn3.iconfinder.com/data/icons/action-states-vol-3-flat/48/Action___States_-_Vol._3-30-512.png" }
        await this.interaction.message.edit({ embeds: [newEmbed], components: [ConversationManageMessageUtils.Actions.attachReport(true)] });
    }

    async managerMarkRequestAsDone() {
        const newEmbed = new EmbedBuilder(this.interaction.message.embeds[0].data);
        newEmbed.setColor(0x33C76E);
        newEmbed.data.fields!.find(field => field.name === "סטטוס טיפול")!.value = "טופל";
        await this.interaction.message.edit({ embeds: [newEmbed], components: [ConversationManageMessageUtils.Actions.markAsDone(true)] });
    }
}
export default ConversationStaffToolsHandler;