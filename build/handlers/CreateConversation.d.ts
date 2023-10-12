import { StringSelectMenuInteraction } from "discord.js";
import { Conversation } from "../utils/types";
declare class CreateConversationHandler {
    private interaction;
    conversation: Conversation;
    constructor(interaction: StringSelectMenuInteraction);
    static createHandler(interaction: StringSelectMenuInteraction): Promise<CreateConversationHandler>;
    private load;
    handle(): Promise<void>;
    createConversation(): Promise<void>;
}
export default CreateConversationHandler;
//# sourceMappingURL=CreateConversation.d.ts.map