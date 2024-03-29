import { ButtonInteraction, Client, TextChannel } from "discord.js";
import { Conversation } from "../utils/types";
declare class ConversationManageHandler {
    private client;
    private interaction;
    channel: TextChannel;
    conversation: Conversation;
    private constructor();
    static createHandler(client: Client, interaction: ButtonInteraction): Promise<ConversationManageHandler>;
    loadConversation(): Promise<void>;
    saveConversation(): Promise<void>;
    sendSureMessageToClose(): Promise<void>;
    openRefferSupervisorModal(): Promise<void>;
    closeConversation(closedBy: string): Promise<void>;
    attachHelper(staffMemberId: string): Promise<void>;
    revealUser(): Promise<void>;
    resetHelpers(): Promise<void>;
    changeHelpersMessage(): Promise<void>;
    sendPunishMessage(): Promise<void>;
}
export default ConversationManageHandler;
//# sourceMappingURL=ConversationManage.d.ts.map