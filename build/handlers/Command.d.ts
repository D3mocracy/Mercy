import { ChatInputCommandInteraction, ContextMenuCommandInteraction } from "discord.js";
declare class CommandHandler {
    private interaction;
    constructor(interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction);
    openChat(): Promise<void>;
    reopenChat(): Promise<void>;
    sendStaffMessage(): Promise<void>;
    criticalChat(): Promise<void>;
    findChannel(): Promise<void>;
    makeHelperOfTheMonth(gender: "helper" | "helperit"): Promise<void>;
    approveVacation(): Promise<void>;
    sendManageTools(): Promise<void>;
    importantLinks(): Promise<void>;
}
export default CommandHandler;
//# sourceMappingURL=Command.d.ts.map