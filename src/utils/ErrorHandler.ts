import { Interaction } from "discord.js";
import Logger from "../handlers/Logger";
import { MessageUtils } from "./MessageUtils";

export class ErrorHandler {
    static async handleInteractionError(interaction: Interaction, error: any): Promise<void> {
        await Logger.logError(error);

        try {
            if (interaction.isRepliable()) {
                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({
                        embeds: [MessageUtils.EmbedMessages.chatIsNotAvailable],
                        ephemeral: true
                    });
                } else if (interaction.deferred && !interaction.replied) {
                    await interaction.editReply({
                        embeds: [MessageUtils.EmbedMessages.chatIsNotAvailable]
                    });
                } else if (interaction.replied) {
                    // Try to send a follow-up, but don't fail if it doesn't work
                    try {
                        await interaction.followUp({
                            embeds: [MessageUtils.EmbedMessages.chatIsNotAvailable],
                            ephemeral: true
                        });
                    } catch (followUpError) {
                        // Silently ignore follow-up errors since the interaction was already handled
                        console.warn('Could not send error follow-up message:', followUpError);
                    }
                }
            }
        } catch (followUpError) {
            await Logger.logError(followUpError as Error);
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