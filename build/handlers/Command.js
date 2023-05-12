"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const MessageUtils_1 = require("../utils/MessageUtils");
const Config_1 = __importDefault(require("./Config"));
const ImportantLinks_1 = require("../utils/MessageUtils/ImportantLinks");
class CommandHandler {
    interaction;
    constructor(interaction) {
        this.interaction = interaction;
    }
    async openChat() {
        this.interaction.channel?.send({
            embeds: [MessageUtils_1.MessageUtils.EmbedMessages.openChat],
            components: [MessageUtils_1.MessageUtils.Actions.openChatButton]
        });
        await this.interaction.reply({ content: 'Sent!', ephemeral: true });
    }
    async sendStaffMessage() {
        this.interaction.channel?.send({
            embeds: [MessageUtils_1.MessageUtils.EmbedMessages.staffMembers()]
        });
        await this.interaction.reply({ content: 'Sent!', ephemeral: true });
    }
    async makeHelperOfTheMonth() {
        const helper = this.interaction.targetMember;
        const helperOfTheMonth = Config_1.default.config.helperOfTheMonthRole;
        const staffChannel = Config_1.default.config.staffChannel;
        if (!helper || !helperOfTheMonth || !staffChannel || !staffChannel.isTextBased())
            return;
        Config_1.default.config.guild?.members.cache.filter(member => member.roles.cache.has(helperOfTheMonth.id)).forEach(async (helper) => await helper.roles.remove(helperOfTheMonth));
        helper.roles.add(helperOfTheMonth);
        staffChannel.send({ embeds: [MessageUtils_1.MessageUtils.EmbedMessages.helperOfTheMonth(helper)] });
        await this.interaction.reply({ content: "הפעולה בוצעה בהצלחה! התומך קיבל את הדרגה ונשלחה הכרזה", ephemeral: true });
    }
    async approveVacation() {
        if (!this.interaction.isMessageContextMenuCommand())
            return;
        if (this.interaction.channelId === Config_1.default.config.vacationChannel?.id) {
            const newEmbed = new discord_js_1.EmbedBuilder(this.interaction.targetMessage.embeds[0].data);
            newEmbed.setColor(0x33C76E);
            this.interaction.targetMessage.edit({
                content: "",
                embeds: [newEmbed],
                components: [MessageUtils_1.MessageUtils.Actions.disabledGreenButton("סטטוס: טופל")]
            });
            await this.interaction.reply({ content: "הבקשה אושרה", ephemeral: true });
        }
        else {
            await this.interaction.reply({ content: "ניתן להשתמש בפקודה זו רק בצ'אנל היעדרות והפחתה", ephemeral: true });
        }
    }
    async importantLinks() {
        await this.interaction.channel?.send({
            embeds: [ImportantLinks_1.ImportantLinksMessageUtils.EmbedMessages.mainMessage()],
            components: [new discord_js_1.ActionRowBuilder().addComponents([
                    ImportantLinks_1.ImportantLinksMessageUtils.Actions.user_report_helper,
                    ImportantLinks_1.ImportantLinksMessageUtils.Actions.user_suggest
                ])]
        });
        await this.interaction.reply({ content: "Sent", ephemeral: true });
    }
}
exports.default = CommandHandler;
//# sourceMappingURL=Command.js.map