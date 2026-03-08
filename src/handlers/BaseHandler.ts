import { Client, Interaction, RepliableInteraction, PermissionsBitField } from "discord.js";
import Logger from "./Logger";
import { Conversation } from "../utils/types";
import { CantLoadConversationFromDB } from "../utils/Errors";
import { Utils } from "../utils/Utils";
import { ResponseHandler, SafeInteraction } from "../utils/ResponseHandler";
import { ErrorHandler } from "../utils/ErrorHandler";
import { conversationRepo } from "../repositories/ConversationRepository";

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
            const conversation = await conversationRepo.findOpenByUserId(userId);

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
            const conversation = await conversationRepo.findOpenByChannelId(channelId);

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
            await conversationRepo.save(this.conversation);
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
        if (this.interaction.isRepliable()) {
            await ResponseHandler.respond(this.interaction as SafeInteraction, content);
        }
    }

    protected async deferSafely(options?: { ephemeral?: boolean }): Promise<boolean> {
        if (this.interaction.isRepliable()) {
            return await ResponseHandler.deferSafely(this.interaction as SafeInteraction, options);
        }
        return false;
    }

    protected async editDeferredReply(content: any): Promise<void> {
        if (this.interaction.isRepliable()) {
            await ResponseHandler.editDeferredReply(this.interaction as SafeInteraction, content);
        }
    }

    protected canRespond(): boolean {
        if (this.interaction.isRepliable()) {
            return ResponseHandler.canRespond(this.interaction as SafeInteraction);
        }
        return false;
    }

    protected getInteractionState(): string {
        if (this.interaction.isRepliable()) {
            return ResponseHandler.getInteractionState(this.interaction as SafeInteraction);
        }
        return 'not-repliable';
    }
}