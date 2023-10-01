import DataBase from "../utils/db";
import { Conversation } from "../utils/types";
import { ChannelType, Message, TextChannel, Client, ActionRowBuilder, ButtonBuilder } from "discord.js"
import { Utils } from "../utils/Utils";
import { CantLoadConversationFromDB } from "../utils/Errors";
import { ConversationManageMessageUtils } from "../utils/MessageUtils/ConversationManage";

class CommunicateConversationHandler {
    private conversation: Conversation = {} as any;
    constructor(private client: Client, private message: Message, private type: ChannelType) { }

    async handle() {
        await this.loadConversation();
        await this.sendMessage();
    }

    async loadConversation(): Promise<void> {
        if (this.type === ChannelType.DM) {
            this.conversation = await DataBase.conversationsCollection.findOne({ userId: this.message.author.id, open: true }) as any;
        } else if (this.type === ChannelType.GuildText) {
            this.conversation = await DataBase.conversationsCollection.findOne({ channelId: this.message.channel.id, open: true }) as any;
        } else {
            throw new CantLoadConversationFromDB();
        }
    }

    async sendMessage() {
        if (this.type === ChannelType.DM) {
            const channel = (Utils.getChannelById(this.client, this.conversation.channelId) as TextChannel);
            await channel.sendTyping();
            channel.send(this.message.content);

        } else if (this.type === ChannelType.GuildText) {
            if (this.message.content.startsWith('!')) return;
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

export default CommunicateConversationHandler;