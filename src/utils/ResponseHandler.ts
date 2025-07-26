import { 
    Interaction, 
    RepliableInteraction, 
    ChatInputCommandInteraction, 
    UserContextMenuCommandInteraction,
    MessageContextMenuCommandInteraction,
    ButtonInteraction,
    ModalSubmitInteraction,
    StringSelectMenuInteraction 
} from "discord.js";
import { ErrorHandler } from "./ErrorHandler";

export type SafeInteraction = ChatInputCommandInteraction | UserContextMenuCommandInteraction | MessageContextMenuCommandInteraction | ButtonInteraction | ModalSubmitInteraction | StringSelectMenuInteraction;

export class ResponseHandler {
    /**
     * Safely responds to any repliable interaction, handling deferred/replied states
     */
    static async respond(interaction: SafeInteraction, content: any): Promise<void> {
        try {
            if (!interaction.isRepliable()) {
                console.log('Interaction is not repliable');
                return;
            }

            const repliable = interaction as RepliableInteraction;
            
            if (repliable.replied) {
                console.log('Interaction already replied, cannot respond again');
                return;
            }

            if (repliable.deferred) {
                await repliable.editReply(content);
            } else {
                await repliable.reply(content);
            }
        } catch (error: any) {
            await ErrorHandler.handleInteractionError(interaction, error);
        }
    }

    /**
     * Safely defers a repliable interaction if not already deferred or replied
     */
    static async deferSafely(interaction: SafeInteraction, options?: { ephemeral?: boolean }): Promise<boolean> {
        try {
            if (!interaction.isRepliable()) {
                return false;
            }

            const repliable = interaction as RepliableInteraction;
            
            if (repliable.replied || repliable.deferred) {
                return true; // Already handled
            }

            await repliable.deferReply(options);
            return true;
        } catch (error: any) {
            console.log('Failed to defer interaction:', error.message);
            return false;
        }
    }

    /**
     * Updates a deferred interaction response
     */
    static async editDeferredReply(interaction: SafeInteraction, content: any): Promise<void> {
        try {
            if (!interaction.isRepliable()) {
                return;
            }

            const repliable = interaction as RepliableInteraction;
            
            if (!repliable.deferred) {
                console.log('Interaction not deferred, cannot edit reply');
                return;
            }

            await repliable.editReply(content);
        } catch (error: any) {
            await ErrorHandler.handleInteractionError(interaction, error);
        }
    }

    /**
     * Checks if an interaction can be responded to
     */
    static canRespond(interaction: SafeInteraction): boolean {
        if (!interaction.isRepliable()) {
            return false;
        }

        const repliable = interaction as RepliableInteraction;
        return !repliable.replied;
    }

    /**
     * Gets the current state of an interaction for debugging
     */
    static getInteractionState(interaction: SafeInteraction): string {
        if (!interaction.isRepliable()) {
            return 'not-repliable';
        }

        const repliable = interaction as RepliableInteraction;
        
        if (repliable.replied) return 'replied';
        if (repliable.deferred) return 'deferred';
        return 'fresh';
    }
}