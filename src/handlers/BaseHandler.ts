import DataBase from "../utils/db";
import { Conversation } from "../utils/types";

export abstract class BaseHandler {
    constructor(private conversation: Conversation) { }

    async saveConversation() {
        await DataBase.conversationsCollection.updateOne(
            {
                channelId: this.conversation.channelId, open: true
            },
            {
                $set: this.conversation
            },
            { upsert: true });
    }
}