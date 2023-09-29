import { ModalSubmitInteraction, StringSelectMenuInteraction } from "discord.js";
import { ConversationManageMessageUtils } from "../utils/MessageUtils/ConversationManage";
import { Conversation } from "../utils/types";
import DataBase from "../utils/db";
import { Utils } from "../utils/Utils";

class PunishMemberHandler {
    conversation: Conversation = {} as any;

    constructor(private interaction: ModalSubmitInteraction) { }

    static async createHandler(interaction: ModalSubmitInteraction) {
        const handler = new PunishMemberHandler(interaction);
        handler.load();
        return handler;
    }

    private async load() {
        this.conversation = await DataBase.conversationsCollection.findOne({ channelId: this.interaction.channelId }) as any;
    }

    async mute() {
        const time = this.interaction.fields.getTextInputValue('punish_mute_time');
        const reason = this.interaction.fields.getTextInputValue('punish_mute_cause');
        const member = Utils.getMemberByID(this.conversation.userId);

        if (isNaN(+time) || +time > 28 || +time < 1) {
            await this.interaction.reply({
                content: "שגיאה בכמות הימים - יש לכתוב ערך מספרי שלם בין 1 ל28 בלבד!",
                ephemeral: true
            })
            return;
        }

        if (member?.isCommunicationDisabled()) {
            this.interaction.reply({
                content: "לא ניתן להשתיק את המשתמש. קיימת השתקה קיימת",
                ephemeral: true
            });
            return;
        }

        await member?.send({
            content: `קיבלת טיים אאוט מהשרת אתם לא לבד \n
            סיבה: ${reason} \n
            ניתן להגיש ערעור למנהלת השרת בהודעה פרטית ${Utils.getMemberByID("844537722466205706")}
            `
        });
        await this.interaction.reply({
            content: "הפעולה בוצעה בהצלחה, המשתמש הושתק ונשלחה אליו הודעת הסבר",
            ephemeral: true
        });

        await member?.timeout(1000 * 60 * 60 * 24 * +time, reason);


    }

    async kick() {
        const reason = this.interaction.fields.getTextInputValue('punish_kick_reason');
        await Utils.getMemberByID(this.conversation.userId)?.send({
            content: `קיבלת קיק מהשרת אתם לא לבד \n
            סיבה: ${reason} \n
            ניתן להגיש ערעור למנהלת השרת בהודעה פרטית ${Utils.getMemberByID("844537722466205706")}
            `
        });
        await this.interaction.reply({
            content: "הפעולה בוצעה בהצלחה, המשתמש הוסר מהשרת ונשלחה אליו הודעת הסבר",
            ephemeral: true
        });

        await Utils.getMemberByID(this.conversation.userId)?.kick(reason);

    }

    async ban() {
        const reason = this.interaction.fields.getTextInputValue('punish_ban_reason');
        await Utils.getMemberByID(this.conversation.userId)?.send({
            content: `קיבלת באן מהשרת אתם לא לבד \n
            סיבה: ${reason} \n
            ניתן להגיש ערעור למנהלת השרת בהודעה פרטית ${Utils.getMemberByID("844537722466205706")}
            `
        });
        await this.interaction.reply({
            content: "הפעולה בוצעה בהצלחה, המשתמש הוסר מהשרת לצמיתות ונשלחה אליו הודעת הסבר",
            ephemeral: true
        });

        await Utils.getMemberByID(this.conversation.userId)?.ban({
            reason: reason
        });
    }
}

export default PunishMemberHandler;