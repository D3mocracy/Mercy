import DataBase from "../utils/db";
import { Conversation } from "../utils/types";
import { ChannelType, Message, TextChannel, Client } from "discord.js"
import { Utils } from "../utils/Utils";
import { CantLoadConversationFromDB } from "../utils/Errors";

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
            await ((await Utils.getChannelById(this.client, this.conversation.channelId)) as TextChannel).send(this.message.content);

        } else if (this.type === ChannelType.GuildText) {
            if (this.message.content.startsWith('!')) return;

            (await this.client.users.fetch(this.conversation.userId)).send(this.message.content);
        }

    }
}

export default CommunicateConversationHandler;