import { ButtonInteraction } from "discord.js";
import DataBase from "../utils/db";
import { MessageUtils } from "../utils/MessageUtils";
import { Conversation } from "../utils/types";
import ConversationManageHandler from "./ConversationManage";

class DMConversationHandler {

    conversation: Conversation = {} as any;

    constructor(private interaction: ButtonInteraction) {
        this.interaction = interaction;
    }

    async load() {
        this.conversation = await DataBase.conversationsCollection.findOne({ userId: this.interaction.user.id, open: true }) ||
            await DataBase.conversationsCollection.find({ userId: this.interaction.user.id, open: false }).sort({ _id: -1 }).limit(1).next() as any;
    }

    async handle() {
        await this.load();
        switch (this.interaction.customId) {
            case "tools_close":
                if (!this.conversation.open) {
                    await this.interaction.reply("היי, אני חושב שהצ'אט הזה כבר נסגר, אתה תמיד מוזמן לכתוב לי הודעה חדשה!");
                    return;
                }
                const conversationManage = await ConversationManageHandler.createHandler(this.conversation.channelId);
                await conversationManage.loadConversation();
                await conversationManage.closeConversation("משתמש", this.interaction);
                await conversationManage.saveConversation();
                break;

            case "user_report_helper":
                if (!this.conversation.staffMemberId || this.conversation.staffMemberId.length === 0) {
                    await this.interaction.reply("עדיין לא שויך תומך לצ'אט זה")
                } else {
                    await this.interaction.showModal(MessageUtils.Modals.reportHelperModal);
                }

                break;
        }

    }


}

export default DMConversationHandler;