import { StringSelectMenuInteraction } from "discord.js";
declare class ChangeHelperHandler {
    private interaction;
    private conversation;
    constructor(interaction: StringSelectMenuInteraction);
    loadConversation(): Promise<void>;
    saveConversation(): Promise<void>;
    handle(): Promise<void>;
}
export default ChangeHelperHandler;
//# sourceMappingURL=ChangeHelper.d.ts.map