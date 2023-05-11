import { ChannelType, Message, Client } from "discord.js";
declare class CommunicateConversationHandler {
    private client;
    private message;
    private type;
    private conversation;
    constructor(client: Client, message: Message, type: ChannelType);
    handle(): Promise<void>;
    loadConversation(): Promise<void>;
    sendMessage(): Promise<void>;
}
export default CommunicateConversationHandler;
//# sourceMappingURL=CommunicateConversation.d.ts.map