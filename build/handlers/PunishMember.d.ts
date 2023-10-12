import { ModalSubmitInteraction, StringSelectMenuInteraction } from "discord.js";
import { Conversation } from "../utils/types";
declare class PunishMemberHandler {
    private interaction;
    conversation: Conversation;
    punish: "kick" | "ban" | "timeout";
    reason: string;
    constructor(interaction: ModalSubmitInteraction);
    static createHandler(interaction: ModalSubmitInteraction): Promise<PunishMemberHandler>;
    private load;
    savePunish(): Promise<void>;
    static sendPunishmentHistory(interaction: StringSelectMenuInteraction): Promise<void>;
    private sendDMMessage;
    timeout(): Promise<void>;
    kick(): Promise<void>;
    ban(): Promise<void>;
    closeConversation(): Promise<void>;
}
export default PunishMemberHandler;
//# sourceMappingURL=PunishMember.d.ts.map