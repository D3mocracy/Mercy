"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Config_1 = __importDefault(require("./Config"));
const ConversationManage_1 = require("../utils/MessageUtils/ConversationManage");
const db_1 = __importDefault(require("../utils/db"));
const Utils_1 = require("../utils/Utils");
const Logger_1 = __importDefault(require("./Logger"));
const UserMU_1 = require("../utils/MessageUtils/UserMU");
const MessageUtils_1 = require("../utils/MessageUtils");
class UnactiveConversationHandler {
    async checkChannels() {
        const conversationCategory = Config_1.default.config.conversationCatagory;
        const conversationChannelIds = conversationCategory.children.cache.map(c => c.id); // Only cache IDs
        const twentyFourHoursAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
        const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
        for (const channelId of conversationChannelIds) {
            let channel = Utils_1.Utils.getChannelByIdNoClient(channelId);
            const messages = await channel.messages.fetch({ limit: 1 });
            const lastMessage = messages.first();
            const conversation = await db_1.default.conversationsCollection.findOne({ channelId: channel.id });
            if (!conversation || !lastMessage)
                continue;
            const member = Utils_1.Utils.getMemberByID(conversation.userId);
            const shouldCloseByBot = lastMessage.createdTimestamp < twelveHoursAgo.getTime() &&
                lastMessage.embeds[0]?.title === UserMU_1.UserMessageUtils.CustomEmbedMessages.noMessageForTwentyFourHours.data.title &&
                lastMessage.author.bot;
            const shouldSendReminder = lastMessage.createdTimestamp < twentyFourHoursAgo.getTime() &&
                !lastMessage.author.bot;
            if (shouldCloseByBot) {
                await this.closeChannel(conversation, "הצ'אט נסגר עקב חוסר פעילות. ניתן לפנות אלינו שוב בכל עת על ידי פתיחת צ'אט חדש.", "הבוט");
                continue;
            }
            if (shouldSendReminder) {
                await Promise.all([
                    channel.send({
                        embeds: [UserMU_1.UserMessageUtils.CustomEmbedMessages.noMessageForTwentyFourHours],
                        components: [UserMU_1.UserMessageUtils.Actions.unActiveChannelButtons(true)],
                    }),
                    this.resetHelpers(conversation),
                    member.send({
                        embeds: [UserMU_1.UserMessageUtils.CustomEmbedMessages.noMessageForTwentyFourHours],
                        components: [UserMU_1.UserMessageUtils.Actions.unActiveChannelButtons(false)],
                    }),
                ]);
            }
        }
    }
    async resetHelpers(conversation) {
        await Promise.all([
            db_1.default.conversationsCollection.updateOne({ channelId: conversation.channelId }, { $set: { staffMemberId: [] } }),
            Utils_1.Utils.getChannelByIdNoClient(conversation.channelId).lockPermissions()
        ]);
    }
    async closeChannel(conversation, messageContent, reasonForClosing) {
        const channel = Utils_1.Utils.getChannelByIdNoClient(conversation.channelId);
        try {
            const closedMessage = { content: messageContent, embeds: [ConversationManage_1.ConversationManageMessageUtils.EmbedMessages.chatClosed(reasonForClosing ? reasonForClosing : 'המשתמש', channel.name)] };
            const member = Utils_1.Utils.getMemberByID(conversation.userId);
            await Promise.all([
                member.send(closedMessage),
                channel.send(closedMessage),
                db_1.default.conversationsCollection.updateOne({ channelId: channel.id }, { $set: { open: false } }, { upsert: true }),
            ]);
            await Logger_1.default.logTicket(channel, member.user);
            await channel.delete();
        }
        catch (error) {
            await channel.send({ embeds: [MessageUtils_1.MessageUtils.EmbedMessages.chatIsNotAvailable] });
        }
    }
    async continueConversation(interaction) {
        const conversation = await db_1.default.conversationsCollection.findOne({ userId: interaction.user.id, open: true });
        if (!conversation || !conversation.channelId) {
            Utils_1.Utils.getMemberByID(interaction.user.id)?.send({ embeds: [MessageUtils_1.MessageUtils.EmbedMessages.chatIsNotAvailable] });
            await interaction.message.delete();
            return;
        }
        const channel = Utils_1.Utils.getChannelByIdNoClient(conversation.channelId);
        if (channel?.lastMessage?.embeds[0]?.title === UserMU_1.UserMessageUtils.CustomEmbedMessages.userWantsToContinueConversation.data.title) {
            await interaction.message.delete();
            return;
        }
        ;
        await Promise.all([
            interaction.message.edit({
                embeds: [new discord_js_1.EmbedBuilder().setTitle('השיחה ממשיכה לבחירתך').setColor(0x33c76e)],
                components: [],
            }),
            Utils_1.Utils.getChannelByIdNoClient(conversation.channelId).send({
                embeds: [UserMU_1.UserMessageUtils.CustomEmbedMessages.userWantsToContinueConversation],
                components: [new discord_js_1.ActionRowBuilder().addComponents([ConversationManage_1.ConversationManageMessageUtils.Actions.tools_attach])]
            })
        ]);
    }
    // Optimized for error handling within `stopConversation`
    async stopConversation(interaction) {
        try {
            const conversation = await this.loadConversationByUserId(interaction.user.id); // Use separate function for clarity
            if (!conversation || !conversation.channelId) {
                Utils_1.Utils.getMemberByID(interaction.user.id)?.send({ embeds: [MessageUtils_1.MessageUtils.EmbedMessages.chatIsNotAvailable] });
                await interaction.message.delete();
                return;
            }
            await Promise.all([interaction.message.delete(), this.closeChannel(conversation, "הצ׳אט נסגר לבקשתכם. ניתן לפנות אלינו שוב בכל עת על ידי פתיחת צ'אט חדש.")]);
        }
        catch (error) {
            console.error("Error stopping conversation:", error);
            // Handle errors here (e.g., log to a different channel)
        }
    }
    async loadConversationByUserId(userId) {
        try {
            const conversation = await db_1.default.conversationsCollection.findOne({ userId, open: true });
            if (!conversation) {
                return null; // Indicate conversation not found
            }
            return conversation;
        }
        catch (error) {
            console.error("Error loading conversation:", error);
            throw error; // Re-throw for `stopConversation` to handle
        }
    }
}
exports.default = UnactiveConversationHandler;
//# sourceMappingURL=UnactiveConversation.js.map