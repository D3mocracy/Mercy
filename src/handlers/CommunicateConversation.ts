import DataBase from "../utils/db";
import { Conversation } from "../utils/types";
import { ChannelType, Message, TextChannel, Client, ActionRowBuilder, ButtonBuilder, PartialMessage, DMChannel } from "discord.js"
import { Utils } from "../utils/Utils";
import { CantLoadConversationFromDB } from "../utils/Errors";
import { ConversationManageMessageUtils } from "../utils/MessageUtils/ConversationManage";
import WhatsAppClient from "../services/WhatsAppClient";

class CommunicateConversationHandler {
    private conversation: Conversation = {} as any;
    constructor(private client: Client, private message: Message, private whatsappClient?: WhatsAppClient) { }

    async handleSendMessage() {
        await this.loadConversation();
        await this.sendMessage();
    }

    async loadConversation(): Promise<void> {
        if (this.message.channel.type === ChannelType.DM) {
            this.conversation = await DataBase.conversationsCollection.findOne({ userId: this.message.author.id, open: true }) as any;
        } else if (this.message.channel.type === ChannelType.GuildText) {
            this.conversation = await DataBase.conversationsCollection.findOne({ channelId: this.message.channel.id, open: true }) as any;
        } else {
            throw new CantLoadConversationFromDB();
        }
    }

    async updateMessage(oldMessage: Message<boolean> | PartialMessage, newMessage: Message<boolean> | PartialMessage) {
        if (!oldMessage.content || !newMessage.content || !this.conversation) return;
        if (this.message.channel.type === ChannelType.DM) {
            const channel = Utils.getChannelById(this.client, this.conversation.channelId) as TextChannel;
            const conversationMessage = (await channel.messages.fetch({ limit: 10 })).find(m => (m.content === oldMessage.content && m.author.bot));
            await conversationMessage?.edit(newMessage.content);
        } else if (this.message.channel.type === ChannelType.GuildText) {
            const channel = this.client.users.cache.get(this.conversation.userId)?.dmChannel as DMChannel;
            const dmMessage = (await channel.messages.fetch({ limit: 10 })).find(m => (m.content === oldMessage.content && m.author.bot));
            await dmMessage?.edit(newMessage.content);
        }

    }

    async deleteMessage(message: Message<boolean> | PartialMessage) {
        if (!message.content || !this.conversation) return;
        if (this.message.channel.type === ChannelType.GuildText) {
            const channel = this.client.users.cache.get(this.conversation.userId)?.dmChannel as DMChannel;
            const dmMessage = (await channel.messages.fetch({ limit: 10 })).find(m => (m.content === message.content && m.author.bot));
            await dmMessage?.delete();
        }

    }

    async sendMessage() {
        if (this.message.channel.type === ChannelType.DM) {
            const channel = (Utils.getChannelById(this.client, this.conversation.channelId) as TextChannel);
            await channel.sendTyping();
            channel.send(this.message.content);

        } else if (this.message.channel.type === ChannelType.GuildText) {
            // Check if this is a WhatsApp conversation
            if (this.conversation.source === 'whatsapp' && this.conversation.whatsappNumber) {
                // Send to WhatsApp
                if (this.whatsappClient && this.whatsappClient.isClientReady()) {
                    try {
                        await this.whatsappClient.sendMessage(this.conversation.whatsappNumber, this.message.content);
                    } catch (error) {
                        console.error('Failed to send WhatsApp message:', error);
                        await this.message.reply({
                            content: "❌ שגיאה בשליחת הודעה ל-WhatsApp",
                            components: [new ActionRowBuilder<ButtonBuilder>().addComponents(ConversationManageMessageUtils.Actions.tools_close)]
                        });
                    }
                }
            } else {
                // Send to Discord DM (original behavior)
                await this.client.users.cache.get(this.conversation.userId)?.dmChannel?.sendTyping();
                this.client.users.send(this.conversation.userId, this.message.content)
                    .catch(() => {
                        this.message.reply({
                            content: "המשתמש ביטל את האפשרות לכתיבת הודעות לאחר פתיחת הצ'אט",
                            components: [new ActionRowBuilder<ButtonBuilder>().addComponents(ConversationManageMessageUtils.Actions.tools_close)]
                        })
                    });
            }
        }

    }
}

export default CommunicateConversationHandler;