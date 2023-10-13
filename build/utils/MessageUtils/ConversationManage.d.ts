import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, GuildMember, ModalBuilder, ModalSubmitInteraction, StringSelectMenuBuilder } from "discord.js";
import { Conversation } from "../types";
export declare namespace ConversationManageMessageUtils {
    namespace EmbedMessages {
        function referSupervisor(interaction: ModalSubmitInteraction): EmbedBuilder;
        function criticalChat(interaction: ModalSubmitInteraction): EmbedBuilder;
        function staffMemberAttached(staffMemberUsername: string): EmbedBuilder;
        const ManagerTools: EmbedBuilder;
        function newChatStaff(title: string, description: string): EmbedBuilder;
        function revealUserMessage(userId: string): Promise<EmbedBuilder>;
        function findChannel(conversation: Conversation): EmbedBuilder;
        const changeHelper: EmbedBuilder;
        const helpersReseted: EmbedBuilder;
        function chatClosed(closedBy: string, chatTitle: string): EmbedBuilder;
        const punishMessage: EmbedBuilder;
        function punishDMMessage(punish: "kick" | "ban" | "timeout", reason: string, mayUser: GuildMember): EmbedBuilder;
        const actionCancelledCloseChat: EmbedBuilder;
        function punishmentHistoryMessage(punishments: any[]): EmbedBuilder;
    }
    namespace Actions {
        function attachReport(isAttached: boolean): ActionRowBuilder<ButtonBuilder>;
        function supervisorRefferedTools(doneDisabled: boolean, inProgressDisabled: boolean): ActionRowBuilder<ButtonBuilder>;
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
        function punishMenu(): ActionRowBuilder<StringSelectMenuBuilder>;
    }
    namespace Modals {
        const findChannelModal: ModalBuilder;
        const punishMuteModal: ModalBuilder;
        const punishKickModal: ModalBuilder;
        const punishBanModal: ModalBuilder;
        const criticalChatModal: ModalBuilder;
    }
}
//# sourceMappingURL=ConversationManage.d.ts.map