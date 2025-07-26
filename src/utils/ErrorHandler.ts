import { Interaction } from "discord.js";
import Logger from "../handlers/Logger";
import { MessageUtils } from "./MessageUtils";

export class ErrorHandler {
    static async handleInteractionError(interaction: Interaction, error: any): Promise<void> {
        // Don't log expected interaction handling errors
        const isExpectedError = error.code === 10062 || // Unknown interaction
                              error.code === 40060 || // Interaction already acknowledged
                              error.message?.includes('Unknown interaction') ||
                              error.message?.includes('Interaction has already been acknowledged');

        if (isExpectedError) {
            console.log('Expected interaction error (not logging to Discord):', error.message);
            return; // Don't log these to Discord or try to respond
        }

        // Only log unexpected errors
        await Logger.logError(error);
        console.error('Unexpected interaction error details:', {
            replied: interaction.isRepliable() ? (interaction as any).replied : 'not repliable',
            deferred: interaction.isRepliable() ? (interaction as any).deferred : 'not repliable',
            type: interaction.type,
            error: error.message
        });

        // Try to respond to unexpected errors only
        if (interaction.isRepliable()) {
            const repliable = interaction as any;
            if (repliable.replied || repliable.deferred) {
                console.log('Interaction was already handled, skipping error response');
                return;
            }

            try {
                await interaction.reply({
                    content: 'שגיאה בביצוע הפעולה. נסה שוב מאוחר יותר.',
                    ephemeral: true
                });
            } catch (replyError) {
                console.error('Failed to send error reply:', replyError);
                // Don't try to log this error to avoid infinite loops
            }
        }
    }

    static async handleAsyncError(error: unknown, context?: string): Promise<void> {
        const errorMessage = context ? `${context}: ${error instanceof Error ? error.message : String(error)}` : (error instanceof Error ? error.message : String(error));
        console.error(errorMessage, error);
        await Logger.logError(error as Error);
    }

    static wrapAsync<T extends any[], R>(
        fn: (...args: T) => Promise<R>
    ): (...args: T) => Promise<void> {
        return async (...args: T): Promise<void> => {
            try {
                await fn(...args);
            } catch (error) {
                await this.handleAsyncError(error, fn.name);
            }
        };
    }
}