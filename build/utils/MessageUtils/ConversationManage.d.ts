import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ModalSubmitInteraction, StringSelectMenuBuilder } from "discord.js";
export declare namespace ConversationManageMessageUtils {
    namespace EmbedMessages {
        function referManager(interaction: ModalSubmitInteraction): EmbedBuilder;
        function staffMemberAttached(staffMemberUsername: string): EmbedBuilder;
        const ManagerTools: EmbedBuilder;
        function newChatStaff(): EmbedBuilder;
        function revealUserMessage(userId: string): Promise<EmbedBuilder>;
        const changeHelper: EmbedBuilder;
        const helpersReseted: EmbedBuilder;
        function chatClosed(closedBy: string, chatTitle: string): EmbedBuilder;
    }
    namespace Actions {
        function attachReport(isAttached: boolean): ActionRowBuilder<ButtonBuilder>;
        function markAsDone(isAttached: boolean): ActionRowBuilder<ButtonBuilder>;
        function tools_report_link(url: string): ActionRowBuilder<ButtonBuilder>;
        function tools_sure_close_yes_no(): ActionRowBuilder<ButtonBuilder>;
        const tools_attach: ButtonBuilder;
        const tools_manager: ButtonBuilder;
        const tools_close: ButtonBuilder;
        const tools_report: ButtonBuilder;
        const supporterTools: ActionRowBuilder<ButtonBuilder>;
        const managerTools: ActionRowBuilder<ButtonBuilder>;
        function changeHelper(helpers: any[]): ActionRowBuilder<StringSelectMenuBuilder>;
        const resetHelpers: ActionRowBuilder<ButtonBuilder>;
    }
    namespace Modals {
    }
}
//# sourceMappingURL=ConversationManage.d.ts.map