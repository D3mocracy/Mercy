import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from "discord.js";
import { StringSelectMenuBuilder } from "@discordjs/builders";
export declare namespace UserMessageUtils {
    namespace CustomEmbedMessages {
        const subjects: EmbedBuilder;
        const noMessageForTwentyFourHours: EmbedBuilder;
        const userWantsToContinueConversation: EmbedBuilder;
    }
    namespace Actions {
        const selectSubject: ActionRowBuilder<StringSelectMenuBuilder>;
        function unActiveChannelButtons(disabled: boolean): ActionRowBuilder<ButtonBuilder>;
    }
}
//# sourceMappingURL=UserMU.d.ts.map