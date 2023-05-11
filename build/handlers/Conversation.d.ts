import { Message } from "discord.js";
declare class ConversationHandler {
    private message;
    constructor(message: Message);
    handle(): Promise<void>;
}
export default ConversationHandler;
//# sourceMappingURL=Conversation.d.ts.map