declare class LeaveGuildHandler {
    private userId;
    private conversation;
    constructor(userId: string);
    loadConversation(): Promise<void>;
    saveConversation(): Promise<void>;
    closeConversation(): Promise<void>;
}
export default LeaveGuildHandler;
//# sourceMappingURL=LeaveGuild.d.ts.map