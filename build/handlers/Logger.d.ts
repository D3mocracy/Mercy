import { TextChannel, User } from "discord.js";
declare namespace Logger {
    function logTicket(ticketChannel: TextChannel, user?: User): Promise<void>;
    function logError(error: Error): Promise<void>;
    function logPunishemnt(punishment: any): Promise<void>;
}
export default Logger;
//# sourceMappingURL=Logger.d.ts.map