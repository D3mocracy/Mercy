import { ObjectId } from "mongodb";
import DataBase from "../utils/db";
import { Conversation } from "../utils/types";

export class ConversationRepository {
    async findOpenByUserId(userId: string): Promise<Conversation | null> {
        return DataBase.conversationsCollection.findOne({ userId, open: true }) as Promise<Conversation | null>;
    }

    async findOpenByChannelId(channelId: string): Promise<Conversation | null> {
        return DataBase.conversationsCollection.findOne({ channelId, open: true }) as Promise<Conversation | null>;
    }

    async findByChannelId(channelId: string): Promise<Conversation | null> {
        return DataBase.conversationsCollection.findOne({ channelId }) as Promise<Conversation | null>;
    }

    async findById(id: ObjectId | string): Promise<Conversation | null> {
        const objectId = typeof id === 'string' ? new ObjectId(id) : id;
        return DataBase.conversationsCollection.findOne({ _id: objectId }) as Promise<Conversation | null>;
    }

    async save(conversation: Conversation): Promise<void> {
        const { _id, ...updateData } = conversation;
        await DataBase.conversationsCollection.updateOne(
            { _id: _id },
            { $set: updateData }
        );
    }

    async insert(conversation: Omit<Conversation, '_id'>): Promise<Conversation> {
        const result = await DataBase.conversationsCollection.insertOne(conversation as Conversation);
        return { ...conversation, _id: result.insertedId };
    }

    async hasOpenConversation(userId: string): Promise<boolean> {
        const count = await DataBase.conversationsCollection.countDocuments({ userId, open: true }, { limit: 1 });
        return count > 0;
    }
}

export const conversationRepo = new ConversationRepository();
