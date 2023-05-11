import { Client } from "discord.js";
declare class LeaveGuildHandler {
    private client;
    private userId;
    private conversation;
    constructor(client: Client, userId: string);
    loadConversation(): Promise<void>;
    saveConversation(): Promise<void>;
    closeConversation(): Promise<void>;
}
export default LeaveGuildHandler;
//# sourceMappingURL=LeaveGuild.d.ts.map