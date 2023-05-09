import { TextChannel } from "discord.js";
import DataBase from "../utils/db";
import { MessageUtils } from "../utils/MessageUtils";
import { Conversation } from "../utils/types";
import { Utils } from "../utils/Utils";
import ConversationManageHandler from "./ConversationManage";
import Logger from "./Logger";

class LeaveGuildHandler {
    private conversation: Conversation = {} as any;
    constructor(private userId: string) { }

    async loadConversation(): Promise<void> {
        this.conversation = await DataBase.conversationsCollection.findOne({ userId: this.userId, open: true }) as any;
    }

    async saveConversation() {
        await DataBase.conversationsCollection.updateOne({ channelId: this.conversation.channelId }, { $set: this.conversation }, { upsert: true })
    }

    async closeConversation() {
        if (!this.conversation.userId) return;
        const channel: TextChannel = await Utils.getChannelById(this.conversation.channelId) as any;
        const closedMessage = { embeds: [MessageUtils.EmbedMessages.chatClosed("משתמש שיצא", channel.name)] };
        this.conversation.open = false;
        await Promise.all([
            channel.send(closedMessage),
            Logger.logTicket(channel),
        ]);
        await channel.delete();
        this.saveConversation();
    }

}

export default LeaveGuildHandler;