import { ButtonInteraction } from "discord.js";
import { Conversation } from "../utils/types";
declare class UnactiveConversationHandler {
    checkChannels(): Promise<void>;
    resetHelpers(conversation: Conversation): Promise<void>;
    closeChannel(conversation: Conversation, messageContent: string, reasonForClosing?: string): Promise<void>;
    continueConversation(interaction: ButtonInteraction): Promise<void>;
    stopConversation(interaction: ButtonInteraction): Promise<void>;
    private loadConversationByUserId;
}
export default UnactiveConversationHandler;
//# sourceMappingURL=UnactiveConversation.d.ts.map