"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const MessageUtils_1 = require("../utils/MessageUtils");
const Config_1 = __importDefault(require("./Config"));
const ImportantLinks_1 = require("../utils/MessageUtils/ImportantLinks");
const Utils_1 = require("../utils/Utils");
const db_1 = __importDefault(require("../utils/db"));
const ConversationManage_1 = require("../utils/MessageUtils/ConversationManage");
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
    async criticalChat() {
        if (!this.interaction.channel)
            return;
        if (!Utils_1.Utils.isConversationChannel(this.interaction.channel)) {
            await this.interaction.reply({
                content: "ניתן לבצע פעולה זו בצ'אטים תחת קטגוריית 'צ'טים' בלבד!",
                ephemeral: true
            });
            return;
        }
        if ((Utils_1.Utils.isHelper(this.interaction.user.id)
            && this.interaction.channel.permissionOverwrites.cache.has(this.interaction.user.id))
            || Utils_1.Utils.isSeniorStaff(this.interaction.user.id)) {
            await this.interaction.showModal(ConversationManage_1.ConversationManageMessageUtils.Modals.criticalChatModal);
        }
        else {
            await this.interaction.reply({
                content: 'אין לך גישה לבצע פעולה זו',
                ephemeral: true
            });
        }
    }
    async findChannel() {
        await this.interaction.showModal(ConversationManage_1.ConversationManageMessageUtils.Modals.findChannelModal);
    }
    async makeHelperOfTheMonth(gender) {
        const helper = this.interaction.targetMember;
        const helpersOfTheMonth = gender === "helper" ? Config_1.default.config.helperOfTheMonthRole : Config_1.default.config.helperitOfTheMonthRole;
        const staffChannel = Config_1.default.config.staffChannel;
        if (!helper || !helpersOfTheMonth || !staffChannel || !staffChannel.isTextBased())
            return;
        Config_1.default.config.guild?.members.cache.filter(member => (member.roles.cache.has(Config_1.default.config.helperOfTheMonthRole.id) || member.roles.cache.has(Config_1.default.config.helperitOfTheMonthRole.id))).forEach(async (helper) => await helper.roles.remove(helpersOfTheMonth));
        helper.roles.add(helpersOfTheMonth);
        (await staffChannel.send({ content: `${Config_1.default.config.memberRole}`, embeds: [MessageUtils_1.MessageUtils.EmbedMessages.helperOfTheMonth(helper)] })).edit({ content: "" });
        await this.interaction.reply({ content: "הפעולה בוצעה בהצלחה! חבר הצוות קיבל את הדרגה ופורסמה הכרזה", ephemeral: true });
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
    async sendManageTools() {
        const [numberOfConversation, conversation] = await Promise.all([
            Utils_1.Utils.getNumberOfConversationFromDB(),
            db_1.default.conversationsCollection.findOne({
                userId: this.interaction.user.id,
                open: true,
            }),
        ]);
        if (Utils_1.Utils.isConversationChannel(this.interaction.channel)) {
            await this.interaction.reply({
                embeds: [
                    ConversationManage_1.ConversationManageMessageUtils.EmbedMessages.newChatStaff(`צ'אט ${numberOfConversation + 1}`, `משתמש פתח צ'אט בנושא ${conversation?.subject}, נא לתת סיוע בהתאם!`),
                ],
                components: [ConversationManage_1.ConversationManageMessageUtils.Actions.supporterTools],
            });
        }
        else if (this.interaction.channel?.isDMBased() && !!conversation?.subject) {
            await this.interaction.reply({
                embeds: [MessageUtils_1.MessageUtils.EmbedMessages.newChatUser(numberOfConversation)],
                components: [
                    new discord_js_1.ActionRowBuilder().addComponents(ConversationManage_1.ConversationManageMessageUtils.Actions.tools_close),
                ],
            });
        }
        else {
            await this.interaction.reply({
                content: "שגיאה בביצוע הפקודה: שימוש שגוי בפקודה",
                ephemeral: true,
            });
        }
    }
    async importantLinks() {
        const messages = [
            {
                embeds: [ImportantLinks_1.ImportantLinksMessageUtils.EmbedMessages.volunteerMessage],
                components: [new discord_js_1.ActionRowBuilder().addComponents([
                        ImportantLinks_1.ImportantLinksMessageUtils.Actions.user_volunteer,
                    ])]
            },
            {
                embeds: [ImportantLinks_1.ImportantLinksMessageUtils.EmbedMessages.reportMessage],
                components: [new discord_js_1.ActionRowBuilder().addComponents([
                        ImportantLinks_1.ImportantLinksMessageUtils.Actions.user_report_helper,
                    ])]
            },
            {
                embeds: [ImportantLinks_1.ImportantLinksMessageUtils.EmbedMessages.suggestIdeasMessage],
                components: [new discord_js_1.ActionRowBuilder().addComponents([
                        ImportantLinks_1.ImportantLinksMessageUtils.Actions.user_suggest,
                    ])]
            }
        ];
        messages.forEach(message => this.interaction.channel?.send(message));
        await this.interaction.reply({ content: "Sent", ephemeral: true });
    }
}
exports.default = CommandHandler;
//# sourceMappingURL=Command.js.map