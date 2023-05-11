import { ModalSubmitInteraction } from "discord.js";
declare class ReportHandler {
    private interaction;
    constructor(interaction: ModalSubmitInteraction);
    private reply;
    private sendReport;
    handle(): Promise<void>;
}
export default ReportHandler;
//# sourceMappingURL=Report.d.ts.map