"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportOnConversationHandler = void 0;
const MessageUtils_1 = require("../utils/MessageUtils");
const Config_1 = __importDefault(require("./Config"));
class ReportOnConversationHandler {
    interaction;
    constructor(interaction) {
        this.interaction = interaction;
        this.interaction = interaction;
    }
    async reply() {
        await this.interaction.reply({ content: "הדיווח שלך נשלח בהצלחה למנהלים", ephemeral: true });
    }
    async conversationReport() {
        const reportChannel = Config_1.default.config.reportChannel;
        if (!reportChannel)
            return;
        await reportChannel.send({
            content: `<@&${Config_1.default.config.managerRole}>`,
            embeds: [await MessageUtils_1.MessageUtils.EmbedMessages.reportConversationMessage(this.interaction)],
            components: [MessageUtils_1.MessageUtils.Actions.attachReport(false), MessageUtils_1.MessageUtils.Actions.tools_report_link(`https://discord.com/channels/${Config_1.default.config.guild.id}/${this.interaction.channelId}`)]
        });
    }
    async handle() {
        await this.conversationReport();
        await this.reply();
    }
}
exports.ReportOnConversationHandler = ReportOnConversationHandler;
//# sourceMappingURL=SubmitReportOnConversation.js.map