"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalSubmitHandler = void 0;
const Config_1 = __importDefault(require("./Config"));
const Utils_1 = require("../utils/Utils");
const db_1 = __importDefault(require("../utils/db"));
const ImportantLinks_1 = require("../utils/MessageUtils/ImportantLinks");
const ConversationManage_1 = require("../utils/MessageUtils/ConversationManage");
class ModalSubmitHandler {
    interaction;
    constructor(interaction) {
        this.interaction = interaction;
    }
    async referManager() {
        await Config_1.default.config.requestHelperChannel.send({
            content: `${Config_1.default.config.managerRole}`,
            embeds: [ConversationManage_1.ConversationManageMessageUtils.EmbedMessages.referManager(this.interaction)],
            components: [ConversationManage_1.ConversationManageMessageUtils.Actions.markAsDone(false), ConversationManage_1.ConversationManageMessageUtils.Actions.tools_report_link(`https://discord.com/channels/${Config_1.default.config.guild.id}/${this.interaction.channelId}`)]
        });
        await this.interaction.reply({ content: "הבקשה שלך נשלחה בהצלחה למנהלים", ephemeral: true });
    }
    async suggestIdea() {
        await Config_1.default.config.suggestIdeasChannel.send({
            content: `${Config_1.default.config.managerRole}`,
            embeds: [ImportantLinks_1.ImportantLinksMessageUtils.EmbedMessages.suggestIdea(this.interaction)]
        });
        await this.interaction.reply({ content: "ההצעה שלך נשלחה בהצלחה למנהלים", ephemeral: true });
    }
    async reportHelper() {
        let helpers = "";
        const lastConversation = await db_1.default.conversationsCollection.findOne({ userId: this.interaction.user.id, open: true }) ||
            await db_1.default.conversationsCollection.find({ userId: this.interaction.user.id }).sort({ _id: -1 }).limit(1).next();
        (lastConversation && lastConversation.staffMemberId)
            ? helpers = Utils_1.Utils.getMembersById(...lastConversation.staffMemberId).map(member => member?.displayName).join(', ')
            : helpers = "לא נמצא צ'אט אחרון / המשתמש לא פתח צ'אט / לא שויך תומך לצ'אט האחרון";
        await Config_1.default.config.reportChannel.send({
            content: `${Config_1.default.config.managerRole}`,
            embeds: [await ImportantLinks_1.ImportantLinksMessageUtils.EmbedMessages.reportHelperMessage(this.interaction, helpers)],
            components: [ConversationManage_1.ConversationManageMessageUtils.Actions.attachReport(false)]
        });
        await this.interaction.reply({ content: "הדיווח שלך נשלח בהצלחה למנהלים", ephemeral: true });
    }
}
exports.ModalSubmitHandler = ModalSubmitHandler;
//# sourceMappingURL=ModalSubmit.js.map