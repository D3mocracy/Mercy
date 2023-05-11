import { GuildMember, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder } from "discord.js";
export declare namespace MessageUtils {
    namespace EmbedMessages {
        const StartConversationAsk: EmbedBuilder;
        const chatIsNotAvailable: EmbedBuilder;
        function errorLog(error: Error): EmbedBuilder;
        function newChatUser(numberOfConversation: number): EmbedBuilder;
        function ticketLog(channelTitle: string): Promise<EmbedBuilder>;
        const openChat: EmbedBuilder;
        const sureMessageToClose: EmbedBuilder;
        function helperOfTheMonth(helper: GuildMember): EmbedBuilder;
        function staffMembers(): Promise<EmbedBuilder>;
    }
    namespace Actions {
        const openChatButton: ActionRowBuilder<ButtonBuilder>;
        function linkButton(url: string, label: string): ActionRowBuilder<ButtonBuilder>;
    }
    namespace Modals {
        const referManagerModal: ModalBuilder;
    }
}
//# sourceMappingURL=MessageUtils.d.ts.map