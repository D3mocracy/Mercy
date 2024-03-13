import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, CategoryChannel, EmbedBuilder, GuildMember, Message, TextChannel } from "discord.js";
import ConfigHandler from "./Config";
import { ConversationManageMessageUtils } from "../utils/MessageUtils/ConversationManage";
import DataBase from "../utils/db";
import { Conversation } from "../utils/types";
import { Utils } from "../utils/Utils";
import Logger from "./Logger";
import { UserMessageUtils } from "../utils/MessageUtils/UserMU";
import { MessageUtils } from "../utils/MessageUtils";

class UnactiveConversationHandler {
    async checkChannels() {
        const conversationCategory = ConfigHandler.config.conversationCatagory as CategoryChannel;
        const conversationChannelIds = conversationCategory.children.cache.map(c => c.id); // Only cache IDs

        const twentyFourHoursAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
        const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

        for (const channelId of conversationChannelIds) {
            let channel = Utils.getChannelByIdNoClient(channelId) as TextChannel;
            const messages = await channel.messages.fetch({ limit: 1 });
            const lastMessage = messages.first() as Message;
            const conversation = await DataBase.conversationsCollection.findOne({ channelId: channel.id }) as Conversation;

            if (!conversation || !lastMessage) continue;

            const member = Utils.getMemberByID(conversation.userId) as GuildMember;

            const shouldCloseByBot =
                lastMessage.createdTimestamp < twelveHoursAgo.getTime() &&
                lastMessage.embeds[0]?.title === UserMessageUtils.CustomEmbedMessages.noMessageForTwentyFourHours.data.title &&
                lastMessage.author.bot;

            const shouldSendReminder =
                lastMessage.createdTimestamp < twentyFourHoursAgo.getTime() &&
                !lastMessage.author.bot;


            if (shouldCloseByBot) {
                await this.closeChannel(conversation, "הצ'אט נסגר עקב חוסר פעילות. ניתן לפנות אלינו שוב בכל עת על ידי פתיחת צ'אט חדש.", "הבוט");
                continue;
            }

            if (shouldSendReminder) {

                await Promise.all([
                    channel.send({
                        embeds: [UserMessageUtils.CustomEmbedMessages.noMessageForTwentyFourHours],
                        components: [UserMessageUtils.Actions.unActiveChannelButtons(true)],
                    }),
                    this.resetHelpers(conversation),
                    member.send({
                        embeds: [UserMessageUtils.CustomEmbedMessages.noMessageForTwentyFourHours],
                        components: [UserMessageUtils.Actions.unActiveChannelButtons(false)],
                    }),
                ]);
            }
        }
    }

    async resetHelpers(conversation: Conversation) {
        await Promise.all([
            DataBase.conversationsCollection.updateOne(
                { channelId: conversation.channelId },
                { $set: { staffMemberId: [] } }
            ),
            (Utils.getChannelByIdNoClient(conversation.channelId) as TextChannel).lockPermissions()
        ])
    }


    async closeChannel(conversation: Conversation, messageContent: string, reasonForClosing?: string) {
        const channel = Utils.getChannelByIdNoClient(conversation.channelId) as TextChannel;

        try {
            const closedMessage = { content: messageContent, embeds: [ConversationManageMessageUtils.EmbedMessages.chatClosed(reasonForClosing ? reasonForClosing : 'המשתמש', channel.name)] };
            const member = Utils.getMemberByID(conversation.userId) as GuildMember;
            await Promise.all([
                member.send(closedMessage),
                channel.send(closedMessage),
                DataBase.conversationsCollection.updateOne({ channelId: channel.id }, { $set: { open: false } }, { upsert: true }),
            ]);
            await Logger.logTicket(channel, member.user);
            await channel.delete();
        } catch (error) {
            await channel.send({ embeds: [MessageUtils.EmbedMessages.chatIsNotAvailable] });
        }
    }

    async continueConversation(interaction: ButtonInteraction) {
        const conversation = await DataBase.conversationsCollection.findOne({ userId: interaction.user.id, open: true }) as Conversation;
        if (!conversation || !conversation.channelId) {
            Utils.getMemberByID(interaction.user.id)?.send({ embeds: [MessageUtils.EmbedMessages.chatIsNotAvailable] });
            await interaction.message.delete();
            return;
        }
        const channel = Utils.getChannelByIdNoClient(conversation.channelId) as TextChannel;
        if (channel?.lastMessage?.embeds[0]?.title === UserMessageUtils.CustomEmbedMessages.userWantsToContinueConversation.data.title) {
            await interaction.message.delete();
            return;
        };

        await Promise.all([
            interaction.message.edit({
                embeds: [new EmbedBuilder().setTitle('השיחה ממשיכה לבחירתך').setColor(0x33c76e)],
                components: [],
            }),
            (Utils.getChannelByIdNoClient(conversation.channelId) as TextChannel).send({
                embeds: [UserMessageUtils.CustomEmbedMessages.userWantsToContinueConversation],
                components: [new ActionRowBuilder<ButtonBuilder>().addComponents([ConversationManageMessageUtils.Actions.tools_attach])]
            })
        ])
    }

    // Optimized for error handling within `stopConversation`
    async stopConversation(interaction: ButtonInteraction) {
        try {
            const conversation = await this.loadConversationByUserId(interaction.user.id); // Use separate function for clarity
            if (!conversation || !conversation.channelId) {
                Utils.getMemberByID(interaction.user.id)?.send({ embeds: [MessageUtils.EmbedMessages.chatIsNotAvailable] });
                await interaction.message.delete();
                return;
            }
            await Promise.all([interaction.message.delete(), this.closeChannel(conversation, "הצ׳אט נסגר לבקשתכם. ניתן לפנות אלינו שוב בכל עת על ידי פתיחת צ'אט חדש.")]);
        } catch (error) {
            console.error("Error stopping conversation:", error);
            // Handle errors here (e.g., log to a different channel)
        }
    }

    private async loadConversationByUserId(userId: string): Promise<Conversation | null> {
        try {
            const conversation = await DataBase.conversationsCollection.findOne({ userId, open: true }) as Conversation;
            if (!conversation) {
                return null; // Indicate conversation not found
            }
            return conversation;
        } catch (error) {
            console.error("Error loading conversation:", error);
            throw error; // Re-throw for `stopConversation` to handle
        }
    }
}

export default UnactiveConversationHandler;
