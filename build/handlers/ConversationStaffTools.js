"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const ConversationManage_1 = require("../utils/MessageUtils/ConversationManage");
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
        newEmbed.data.thumbnail = { url: "https://cdn3.iconfinder.com/data/icons/action-states-vol-3-flat/48/Action___States_-_Vol._3-30-512.png" };
        await this.interaction.message.edit({ embeds: [newEmbed], components: [ConversationManage_1.ConversationManageMessageUtils.Actions.attachReport(true)] });
    }
}
exports.default = ConversationStaffToolsHandler;
//# sourceMappingURL=ConversationStaffTools.js.map