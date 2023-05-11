"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MessageUtils_1 = require("../utils/MessageUtils");
const Utils_1 = require("../utils/Utils");
const Config_1 = __importDefault(require("./Config"));
class ReportHandler {
    interaction;
    constructor(interaction) {
        this.interaction = interaction;
        this.interaction = interaction;
    }
    async reply() {
        await this.interaction.reply({ content: "הדיווח שלך נשלח בהצלחה למנהלים", ephemeral: true });
    }
    async sendReport() {
        const config = await new Config_1.default().getConfig();
        const reportChannel = await Utils_1.Utils.client.channels.fetch(config.reportChannelId);
        if (!reportChannel)
            return;
        await reportChannel.send({
            content: `<@&${config.managerRole}>`,
            embeds: [await MessageUtils_1.MessageUtils.EmbedMessages.reportMessage(this.interaction)],
            components: [MessageUtils_1.MessageUtils.Actions.attachReport(false), MessageUtils_1.MessageUtils.Actions.tools_report_link(`https://discord.com/channels/${config.guildId}/${this.interaction.channelId}`)]
        });
    }
    async handle() {
        await this.sendReport();
        await this.reply();
    }
}
exports.default = ReportHandler;
//# sourceMappingURL=Report.js.map