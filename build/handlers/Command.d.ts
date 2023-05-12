import { ChatInputCommandInteraction, ContextMenuCommandInteraction } from "discord.js";
declare class CommandHandler {
    private interaction;
    constructor(interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction);
    openChat(): Promise<void>;
    sendStaffMessage(): Promise<void>;
    makeHelperOfTheMonth(): Promise<void>;
    approveVacation(): Promise<void>;
    importantLinks(): Promise<void>;
}
export default CommandHandler;
//# sourceMappingURL=Command.d.ts.map