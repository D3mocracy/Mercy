import { ButtonInteraction, EmbedBuilder } from "discord.js"

class ConversationStaffToolsHandler {
    constructor(private interaction: ButtonInteraction) {
        this.interaction = interaction;
    }

    async managerAttachReport() {
        const newEmbed = new EmbedBuilder(this.interaction.message.embeds[0].data);
        newEmbed.setColor(0x33C76E);
        newEmbed.data.fields!.find(field => field.name === "מנהל מטפל")!.value = this.interaction.user.username;
        await this.interaction.message.edit({ embeds: [newEmbed] });
    }
}
export default ConversationStaffToolsHandler;