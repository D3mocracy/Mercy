import { StringSelectMenuInteraction, Client } from "discord.js";
declare class ChangeHelperHandler {
    private client;
    private interaction;
    private conversation;
    constructor(client: Client, interaction: StringSelectMenuInteraction);
    loadConversation(): Promise<void>;
    saveConversation(): Promise<void>;
    handle(): Promise<void>;
}
export default ChangeHelperHandler;
//# sourceMappingURL=ChangeHelper.d.ts.map