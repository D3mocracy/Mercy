import DataBase from "../utils/db";
import { Conversation } from "../utils/types";
import { Utils } from "../utils/Utils";
import ConversationManageHandler from "./ConversationManage";

class LeaveGuildHandler {
    private conversation: Conversation = {} as any;
    constructor(private userId: string) {
        this.userId = userId;
    }

    async loadConversation(): Promise<void> {
        this.conversation = await DataBase.conversationsCollection.findOne({ userId: this.userId, open: true }) as any;
    }

    async saveConversation() {
        await DataBase.conversationsCollection.updateOne({ channelId: this.conversation.channelId }, { $set: this.conversation }, { upsert: true })
    }

    async handle() {
        await this.loadConversation();
        if (!this.conversation) return;
        const conversationManage = await ConversationManageHandler.createHandler(this.conversation.channelId);
        await conversationManage.closeConversation("הבוט");
        await conversationManage.saveConversation();
    }

}

export default LeaveGuildHandler;