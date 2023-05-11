import { ChannelType, Message } from "discord.js";
declare class CommunicateConversationHandler {
    private message;
    private type;
    private conversation;
    constructor(message: Message, type: ChannelType);
    handle(): Promise<void>;
    loadConversation(): Promise<void>;
    sendMessage(): Promise<void>;
}
export default CommunicateConversationHandler;
//# sourceMappingURL=CommunicateConversation.d.ts.map