import { ButtonBuilder, EmbedBuilder, GuildMember, ModalBuilder, User } from "discord.js";
export declare namespace ImportantLinksMessageUtils {
    namespace EmbedMessages {
        function mainMessage(): EmbedBuilder;
        function suggestIdea(expain: string, comments: string, member: GuildMember): EmbedBuilder;
        function reportHelperMessage(helperName: string, reportCause: string): EmbedBuilder;
        const volunteerMessage: EmbedBuilder;
        const reportMessage: EmbedBuilder;
        const suggestIdeasMessage: EmbedBuilder;
        function volunteer(user: User, dateVolunteer: string, aboutYourselfVolunteer: string, whyVolunteer: string, freqVolunteer: string, moreVolunteer: string): EmbedBuilder;
    }
    namespace Actions {
        const user_report_helper: ButtonBuilder;
        const user_suggest: ButtonBuilder;
        const user_volunteer: ButtonBuilder;
    }
    namespace Modals {
        const volunteerModal: ModalBuilder;
        const suggestIdeaModal: ModalBuilder;
        const reportHelperModal: ModalBuilder;
    }
}
//# sourceMappingURL=ImportantLinks.d.ts.map