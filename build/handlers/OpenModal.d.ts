import { ButtonInteraction, StringSelectMenuInteraction } from "discord.js";
declare class OpenModalHandler {
    private interaction;
    constructor(interaction: ButtonInteraction | StringSelectMenuInteraction);
    static load(): Promise<void>;
    openModal(): Promise<void>;
}
export default OpenModalHandler;
//# sourceMappingURL=OpenModal.d.ts.map