import { ButtonInteraction } from "discord.js";
declare class StartConversation {
    private interaction;
    constructor(interaction: ButtonInteraction);
    precondition(): Promise<void>;
    private createConversation;
}
export default StartConversation;
//# sourceMappingURL=StartConversation.d.ts.map