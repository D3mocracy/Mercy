import { ButtonInteraction } from "discord.js";
declare class ConversationStaffToolsHandler {
    private interaction;
    constructor(interaction: ButtonInteraction);
    managerAttachReport(): Promise<void>;
    managerMarkRequestAsDone(): Promise<void>;
}
export default ConversationStaffToolsHandler;
//# sourceMappingURL=ConversationStaffTools.d.ts.map