import { ChatInputCommandInteraction, UserContextMenuCommandInteraction } from "discord.js";
declare class CommandHandler {
    private interaction;
    constructor(interaction: ChatInputCommandInteraction | UserContextMenuCommandInteraction);
    openChat(): Promise<void>;
    sendStaffMessage(): Promise<void>;
    makeHelperOfTheMonth(): Promise<void>;
    importantLinks(): Promise<void>;
}
export default CommandHandler;
//# sourceMappingURL=Command.d.ts.map