import { GuildMember, EmbedBuilder, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, ModalBuilder, ModalSubmitInteraction } from "discord.js";
export declare namespace MessageUtils {
    namespace EmbedMessages {
        const StartConversationAsk: EmbedBuilder;
        const chatIsNotAvailable: EmbedBuilder;
        function errorLog(error: Error): EmbedBuilder;
        function newChatStaff(): EmbedBuilder;
        function newChatUser(numberOfConversation: number): EmbedBuilder;
        function staffMemberAttached(staffMemberUsername: string): EmbedBuilder;
        const ManagerTools: EmbedBuilder;
        function revealUserMessage(userId: string): Promise<EmbedBuilder>;
        const changeHelper: EmbedBuilder;
        const answerOpenConversationTimeEnd: EmbedBuilder;
        const userChooseNo: EmbedBuilder;
        const helpersReseted: EmbedBuilder;
        function chatClosed(closedBy: string, chatTitle: string): EmbedBuilder;
        function ticketLog(channelTitle: string): Promise<EmbedBuilder>;
        function referManager(interaction: ModalSubmitInteraction): Promise<EmbedBuilder>;
        function reportHelperMessage(interaction: ModalSubmitInteraction, helpers: string): Promise<EmbedBuilder>;
        const openChat: EmbedBuilder;
        const sureMessageToClose: EmbedBuilder;
        function helperOfTheMonth(helper: GuildMember): EmbedBuilder;
        function importantLinks(): EmbedBuilder;
        function staffMembers(): Promise<EmbedBuilder>;
    }
    namespace Actions {
        const openChatButton: ActionRowBuilder<ButtonBuilder>;
        function linkButton(url: string, label: string): ActionRowBuilder<ButtonBuilder>;
        function attachReport(isAttached: boolean): ActionRowBuilder<ButtonBuilder>;
        function tools_report_link(url: string): ActionRowBuilder<ButtonBuilder>;
        function tools_sure_close_yes_no(): ActionRowBuilder<ButtonBuilder>;
        const tools_attach: ButtonBuilder;
        const tools_manager: ButtonBuilder;
        const tools_close: ButtonBuilder;
        const tools_report: ButtonBuilder;
        const user_report_helper: ButtonBuilder;
        const user_suggest: ButtonBuilder;
        const supporterTools: ActionRowBuilder<ButtonBuilder>;
        const managerTools: ActionRowBuilder<ButtonBuilder>;
        function changeHelper(helpers: any[]): ActionRowBuilder<StringSelectMenuBuilder>;
        const resetHelpers: ActionRowBuilder<ButtonBuilder>;
    }
    namespace Modals {
        const referManagerModal: ModalBuilder;
        const reportHelperModal: ModalBuilder;
        const suggestIdeaModal: ModalBuilder;
    }
}
//# sourceMappingURL=MessageUtils.d.ts.map