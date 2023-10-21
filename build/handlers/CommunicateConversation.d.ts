import { Message, Client, PartialMessage } from "discord.js";
declare class CommunicateConversationHandler {
    private client;
    private message;
    private conversation;
    constructor(client: Client, message: Message);
    handleSendMessage(): Promise<void>;
    loadConversation(): Promise<void>;
    updateMessage(oldMessage: Message<boolean> | PartialMessage, newMessage: Message<boolean> | PartialMessage): Promise<void>;
    deleteMessage(message: Message<boolean> | PartialMessage): Promise<void>;
    sendMessage(): Promise<void>;
}
export default CommunicateConversationHandler;
//# sourceMappingURL=CommunicateConversation.d.ts.map