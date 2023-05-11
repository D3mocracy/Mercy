import { TextChannel } from "discord.js";
declare namespace Logger {
    function logTicket(ticketChannel: TextChannel): Promise<void>;
    function logError(error: Error): Promise<void>;
}
export default Logger;
//# sourceMappingURL=Logger.d.ts.map