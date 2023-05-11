"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const MessageUtils_1 = require("../utils/MessageUtils");
const Utils_1 = require("../utils/Utils");
const ConversationManage_1 = __importDefault(require("./ConversationManage"));
class ConversationStaffToolsHandler {
    interaction;
    conversation = {};
    constructor(interaction) {
        this.interaction = interaction;
        this.interaction = interaction;
    }
    // async loadConversation(): Promise<void> {
    //     this.conversation = await DataBase.conversationsCollection.findOne({ channelId: this.interaction.channelId, open: true }) ||
    //         await DataBase.conversationsCollection.findOne({ userId: this.interaction.user.id, open: true }) as any;
    // }
    // async saveConversation() {
    //     await DataBase.conversationsCollection.updateOne({ channelId: this.conversation.channelId, open: true }, { $set: this.conversation }, { upsert: true })
    // }
    async handle() {
        const conversationManage = await ConversationManage_1.default.createHandler(this.conversation.channelId);
        await conversationManage.loadConversation();
        switch (this.interaction.customId) {
            case "tools_attach":
                if (!conversationManage.conversation.staffMemberId || conversationManage.conversation.staffMemberId.length === 0) {
                    conversationManage.conversation.staffMemberId?.push(this.interaction.user.id);
                    await Utils_1.Utils.updatePermissionToChannel(conversationManage.conversation);
                    await this.interaction.reply({ embeds: [MessageUtils_1.MessageUtils.EmbedMessages.staffMemberAttached(this.interaction.user.toString())] });
                }
                else {
                    await this.interaction.reply({ ephemeral: true, content: "פסססטט...הצ'אט הזה כבר שויך למישהו" });
                }
                break;
            case "tools_close":
                await conversationManage.closeConversation(this.interaction.channel?.isDMBased() ? "משתמש" : "איש צוות", this.interaction);
                break;
            case "tools_manager":
                await this.interaction.reply({ ephemeral: true, embeds: [MessageUtils_1.MessageUtils.EmbedMessages.ManagerTools], components: [MessageUtils_1.MessageUtils.Actions.managerTools] });
                break;
            case "tools_manager_reveal":
                await this.interaction.reply({
                    ephemeral: true,
                    embeds: [await MessageUtils_1.MessageUtils.EmbedMessages.revealUserMessage(conversationManage.conversation.userId)]
                });
                break;
            case "tools_manager_change_supporter":
                await this.interaction.reply({
                    ephemeral: true,
                    embeds: [MessageUtils_1.MessageUtils.EmbedMessages.changeHelper],
                    components: [MessageUtils_1.MessageUtils.Actions.changeHelper((await Utils_1.Utils.getUsersWithRoleId('1036014794806939648')).map(m => m)),
                        MessageUtils_1.MessageUtils.Actions.resetHelpers]
                });
                break;
            case "tools_reset_helpers":
                conversationManage.conversation.staffMemberId = [];
                await Utils_1.Utils.updatePermissionToChannel(conversationManage.conversation);
                await this.interaction.channel.send({ embeds: [MessageUtils_1.MessageUtils.EmbedMessages.helpersReseted] });
                break;
            case "tools_report":
                await this.interaction.showModal(MessageUtils_1.MessageUtils.Modals.reportModal);
                break;
            case "tools_attach_report":
                const newEmbed = new discord_js_1.EmbedBuilder(this.interaction.message.embeds[0].data);
                newEmbed.setColor(0x33C76E);
                newEmbed.data.fields.find(field => field.name === "מנהל מטפל").value = this.interaction.user.username;
                await this.interaction.message.edit({ embeds: [newEmbed] });
                break;
            default:
                break;
        }
        if (!(this.interaction.deferred || this.interaction.replied))
            await this.interaction.deferUpdate();
        await conversationManage.saveConversation();
        // await this.saveConversation();
    }
}
exports.default = ConversationStaffToolsHandler;
//# sourceMappingURL=ConversationTools.js.map