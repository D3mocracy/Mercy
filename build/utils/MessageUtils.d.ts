import { GuildMember, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder } from "discord.js";
export declare namespace MessageUtils {
    namespace EmbedMessages {
        const StartConversationAsk: EmbedBuilder;
        const chatIsNotAvailable: EmbedBuilder;
        function errorLog(error: Error): EmbedBuilder;
        function punishmentLog(punishment: any): EmbedBuilder;
        function newChatUser(numberOfConversation: number): EmbedBuilder;
        function ticketLog(channelTitle: string): Promise<EmbedBuilder>;
        const openChat: EmbedBuilder;
        const sureMessageToClose: EmbedBuilder;
        function helperOfTheMonth(helper: GuildMember): EmbedBuilder;
        function helperitOfTheMonth(helper: GuildMember): EmbedBuilder;
        function staffMembers(): EmbedBuilder;
        function vacation(helperMember: GuildMember, vacationType: string, dateOne: string, dateTwo: string, cause: string): EmbedBuilder;
    }
    namespace Actions {
        const openChatButton: ActionRowBuilder<ButtonBuilder>;
        function linkButton(url: string, label: string): ActionRowBuilder<ButtonBuilder>;
        function disabledGreyButton(label: string): ActionRowBuilder<ButtonBuilder>;
        function disabledGreenButton(label: string): ActionRowBuilder<ButtonBuilder>;
    }
    namespace Modals {
        const referManagerModal: ModalBuilder;
        const vacationModal: ModalBuilder;
        const volunteerModal: ModalBuilder;
    }
}
//# sourceMappingURL=MessageUtils.d.ts.map