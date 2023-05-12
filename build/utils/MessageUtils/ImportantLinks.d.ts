import { ButtonBuilder, EmbedBuilder, GuildMember, ModalBuilder, ModalSubmitInteraction } from "discord.js";
export declare namespace ImportantLinksMessageUtils {
    namespace EmbedMessages {
        function mainMessage(): EmbedBuilder;
        function suggestIdea(expain: string, comments: string, member: GuildMember): EmbedBuilder;
        function reportHelperMessage(interaction: ModalSubmitInteraction, helpers: string): Promise<EmbedBuilder>;
    }
    namespace Actions {
        const user_report_helper: ButtonBuilder;
        const user_suggest: ButtonBuilder;
    }
    namespace Modals {
        const suggestIdeaModal: ModalBuilder;
        const reportHelperModal: ModalBuilder;
    }
}
//# sourceMappingURL=ImportantLinks.d.ts.map