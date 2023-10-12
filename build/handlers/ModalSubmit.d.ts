import { ModalSubmitInteraction } from "discord.js";
export declare class ModalSubmitHandler {
    protected interaction: ModalSubmitInteraction;
    constructor(interaction: ModalSubmitInteraction);
    referManager(): Promise<void>;
    sendVacationMessage(): Promise<void>;
    sendVolunteerMessage(): Promise<void>;
    suggestIdea(): Promise<void>;
    reportHelper(): Promise<void>;
    criticalChat(): Promise<void>;
}
//# sourceMappingURL=ModalSubmit.d.ts.map