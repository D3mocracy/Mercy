"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportOnHelperHandler = void 0;
const db_1 = __importDefault(require("../utils/db"));
const MessageUtils_1 = require("../utils/MessageUtils");
const Utils_1 = require("../utils/Utils");
const Config_1 = __importDefault(require("./Config"));
/**
 * This is not useable due the button trigger is not in the chat anymore
 * @deprecated
 */
class ReportOnHelperHandler {
    interaction;
    constructor(interaction) {
        this.interaction = interaction;
    }
    async reply() {
        await this.interaction.reply({ content: "הדיווח שלך נשלח בהצלחה למנהלים", ephemeral: true });
    }
    async StaffReport() {
        const conversation = await db_1.default.conversationsCollection.findOne({ userId: this.interaction.user.id, open: true }) ||
            await db_1.default.conversationsCollection.find({ userId: this.interaction.user.id, open: false }).sort({ _id: -1 }).limit(1).next();
        if (!conversation.staffMemberId)
            return;
        const helpers = Utils_1.Utils.getMembersById(...conversation.staffMemberId).map(member => member?.displayName).join(', ');
        const reportChannel = Config_1.default.config.requestHelperChannel;
        if (!reportChannel)
            return;
        await reportChannel.send({
            content: `<@&${Config_1.default.config.managerRole}>`,
            embeds: [await MessageUtils_1.MessageUtils.EmbedMessages.reportHelperMessage(this.interaction, helpers)],
            components: [MessageUtils_1.MessageUtils.Actions.attachReport(false), MessageUtils_1.MessageUtils.Actions.tools_report_link(`https://discord.com/channels/${Config_1.default.config.guild.id}/${conversation.channelId}`)]
        });
    }
    async handle() {
        await this.StaffReport();
        await this.reply();
    }
}
exports.ReportOnHelperHandler = ReportOnHelperHandler;
//# sourceMappingURL=SubmitReportOnHelper.js.map