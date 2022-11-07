import DataBase from "../utils/db";
import { Conversation } from "../utils/types";
import { ChannelType, Message, TextChannel } from "discord.js"
import { Utils } from "../utils/Utils";
import { CantLoadConversationFromDB } from "../utils/Errors";
import { MessageUtils } from "../utils/MessageUtils";

class CommunicateConversationHandler {
    private conversation: Conversation = {} as any;
    constructor(private message: Message, private type: ChannelType) {
        this.message = message;
        this.type = type;
    }

    async createHandler() {
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
            await ((await Utils.getChannelById(this.conversation.channelId)) as TextChannel).send(this.message.content);
        } else if (this.type === ChannelType.GuildText) {
            if (this.message.content === "!manage") {
                await this.message.reply({
                    embeds: [MessageUtils.EmbedMessages.newChatStaff(await Utils.getNumberOfConversationFromDB())],
                    components: [MessageUtils.Actions.supporterTools]
                });
                return;
            }
            if (this.message.content.startsWith("!")) return;
            (await Utils.client.users.fetch(this.conversation.userId)).send(this.message.content);
        }

    }
}

export default CommunicateConversationHandler;