import { ButtonInteraction } from "discord.js";
declare class ConversationStaffToolsHandler {
    private interaction;
    private conversation;
    constructor(interaction: ButtonInteraction);
    handle(): Promise<void>;
}
export default ConversationStaffToolsHandler;
//# sourceMappingURL=ConversationTools.d.ts.map