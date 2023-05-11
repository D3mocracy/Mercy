"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class ConversationStaffToolsHandler {
    interaction;
    constructor(interaction) {
        this.interaction = interaction;
        this.interaction = interaction;
    }
    async managerAttachReport() {
        const newEmbed = new discord_js_1.EmbedBuilder(this.interaction.message.embeds[0].data);
        newEmbed.setColor(0x33C76E);
        newEmbed.data.fields.find(field => field.name === "מנהל מטפל").value = this.interaction.user.username;
        await this.interaction.message.edit({ embeds: [newEmbed] });
    }
}
exports.default = ConversationStaffToolsHandler;
//# sourceMappingURL=ConversationStaffTools.js.map