import { Client, Interaction, RepliableInteraction, PermissionsBitField } from "discord.js";
import Logger from "./Logger";
import { Conversation } from "../utils/types";
import DataBase from "../utils/db";
import { CantLoadConversationFromDB } from "../utils/Errors";
import { Utils } from "../utils/Utils";

export abstract class BaseHandler<T extends Interaction = Interaction> {
    protected conversation?: Conversation;
    protected client: Client;
    protected interaction: T;

    constructor(client: Client, interaction: T) {
        this.client = client;
        this.interaction = interaction;
    }

    protected async safeExecute<R>(operation: () => Promise<R>, errorMessage?: string): Promise<R | null> {
        try {
            return await operation();
        } catch (error: unknown) {
            await Logger.logError(error as Error);
            if (errorMessage) {
                console.error(errorMessage, error);
            }
            return null;
        }
    }

    protected async loadConversationByUser(userId: string): Promise<Conversation | null> {
        try {
            const conversation = await DataBase.conversationsCollection.findOne({
                userId: userId,
                open: true,
            }) as Conversation | null;

            if (!conversation) {
                throw new CantLoadConversationFromDB();
            }

            this.conversation = conversation;
            return conversation;
        } catch (error: unknown) {
            await Logger.logError(error as Error);
            throw new CantLoadConversationFromDB();
        }
    }

    protected async loadConversationByChannel(channelId: string): Promise<Conversation | null> {
        try {
            const conversation = await DataBase.conversationsCollection.findOne({
                channelId: channelId,
                open: true,
            }) as Conversation | null;

            if (!conversation) {
                throw new CantLoadConversationFromDB();
            }

            this.conversation = conversation;
            return conversation;
        } catch (error: unknown) {
            await Logger.logError(error as Error);
            throw new CantLoadConversationFromDB();
        }
    }

    protected async loadConversation(): Promise<void> {
        if (this.interaction.channel?.isDMBased()) {
            await this.loadConversationByUser(this.interaction.user.id);
        } else {
            await this.loadConversationByChannel(this.interaction.channelId || "");
        }
    }

    protected async saveConversation(): Promise<void> {
        if (!this.conversation) {
            throw new Error("No conversation loaded to save");
        }

        try {
            await DataBase.conversationsCollection.updateOne(
                { _id: this.conversation._id },
                { $set: this.conversation }
            );
        } catch (error: unknown) {
            await Logger.logError(error as Error);
            throw error;
        }
    }

    protected getChannelById(channelId: string) {
        return Utils.getChannelById(this.client, channelId);
    }

    protected async hasPermission(userId: string, permission: 'admin' | 'staff' | 'senior'): Promise<boolean> {
        switch (permission) {
            case 'admin':
                const permissions = this.interaction.member?.permissions;
                return permissions instanceof PermissionsBitField ? permissions.has("Administrator") : false;
            case 'staff':
                return typeof Utils.isStaff === 'function' ? !!Utils.isStaff(userId) : false;
            case 'senior':
                return typeof Utils.isSeniorStaff === 'function' ? !!Utils.isSeniorStaff(userId) : false;
            default:
                return false;
        }
    }

    protected async respondSafely(content: any): Promise<void> {
        try {
            if ('deferred' in this.interaction && 'replied' in this.interaction) {
                const repliableInteraction = this.interaction as RepliableInteraction;
                if (repliableInteraction.deferred || repliableInteraction.replied) {
                    return;
                }
                
                if ('reply' in repliableInteraction) {
                    await repliableInteraction.reply(content);
                }
            }
        } catch (error: unknown) {
            await Logger.logError(error as Error);
        }
    }
}