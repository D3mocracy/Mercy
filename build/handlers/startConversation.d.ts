import { ButtonInteraction } from "discord.js";
import { Conversation } from "../utils/types";
declare class StartConversation {
    private interaction;
    conversation: Conversation;
    constructor(interaction: ButtonInteraction);
    static createHandler(interaction: ButtonInteraction): Promise<StartConversation>;
    private load;
    handle(): Promise<void>;
    private sendSelectSubject;
}
export default StartConversation;
//# sourceMappingURL=StartConversation.d.ts.map