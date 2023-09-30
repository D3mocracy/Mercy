import { ModalSubmitInteraction, StringSelectMenuInteraction, TextChannel } from "discord.js";
import { ConversationManageMessageUtils } from "../utils/MessageUtils/ConversationManage";
import { Conversation } from "../utils/types";
import DataBase from "../utils/db";
import { Utils } from "../utils/Utils";
import Logger from "./Logger";
import { ObjectId } from "mongodb";

class PunishMemberHandler {
    conversation: Conversation = {} as any;
    punish: "kick" | "ban" | "timeout" = "" as any;
    reason: string = "";

    constructor(private interaction: ModalSubmitInteraction) { }

    static async createHandler(interaction: ModalSubmitInteraction) {
        const handler = new PunishMemberHandler(interaction);
        await handler.load();
        return handler;
    }

    private async load() {
        this.conversation = await DataBase.conversationsCollection.findOne({ channelId: this.interaction.channelId }) as any;
    }

    async savePunish() {
        const punishment = {
            ...this.conversation,
            _id: new ObjectId(),
            punishType: this.punish,
            reason: this.reason,
            punisherId: this.interaction.user.id,
            channelName: (Utils.getChannelByIdNoClient(this.conversation.channelId) as TextChannel).name,
            punishDate: new Date(),
        }
        console.log(punishment);

        await DataBase.punishmentsCollection.insertOne({
            ...punishment
        });

        Logger.logPunishemnt(punishment);
    }

    static async sendPunishmentHistory(interaction: StringSelectMenuInteraction) {

        const conversation: Conversation = await DataBase.conversationsCollection.findOne({ channelId: interaction.channelId }) as any;
        const member = Utils.getMemberByID(conversation.userId);
        const punishments = await DataBase.punishmentsCollection.find({ userId: member?.id }).toArray();

        await interaction.reply({
            embeds: [ConversationManageMessageUtils.EmbedMessages.punishmentHistoryMessage(punishments)],
            ephemeral: true
        })
    }

    private async sendDMMessage() {
        const member = Utils.getMemberByID(this.conversation.userId);
        await member?.send({
            embeds: [ConversationManageMessageUtils.EmbedMessages.punishDMMessage(this.punish, this.reason, Utils.getMemberByID("844537722466205706")!)]
        });
    }

    async mute() {
        const time = this.interaction.fields.getTextInputValue('punish_mute_time');
        const reason = this.interaction.fields.getTextInputValue('punish_mute_cause');
        const member = Utils.getMemberByID(this.conversation.userId);

        console.log(isNaN(+time), +time > 27, +time < 1);

        if (isNaN(+time) || +time > 27 || +time < 1) {
            await this.interaction.reply({
                content: "שגיאה בכמות הימים - יש לכתוב ערך מספרי שלם בין 1 ל27 בלבד!",
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

        this.punish = "timeout";
        this.reason = reason;

        await this.sendDMMessage();

        await this.interaction.reply({
            content: "הפעולה בוצעה בהצלחה, המשתמש הושתק ונשלחה אליו הודעת הסבר",
            ephemeral: true
        });

        await this.savePunish();

        await member?.timeout(1000 * 60 * 60 * 24 * +time, reason);

    }

    async kick() {
        const reason = this.interaction.fields.getTextInputValue('punish_kick_reason');

        this.punish = "kick";
        this.reason = reason;

        await this.sendDMMessage();

        await this.interaction.reply({
            content: "הפעולה בוצעה בהצלחה, המשתמש הוסר מהשרת ונשלחה אליו הודעת הסבר",
            ephemeral: true
        });
        await this.savePunish();

        await Utils.getMemberByID(this.conversation.userId)?.kick(reason);

    }

    async ban() {
        const reason = this.interaction.fields.getTextInputValue('punish_ban_reason');

        this.punish = "ban";
        this.reason = reason;

        await this.sendDMMessage();

        await this.interaction.reply({
            content: "הפעולה בוצעה בהצלחה, המשתמש הוסר מהשרת לצמיתות ונשלחה אליו הודעת הסבר",
            ephemeral: true
        });
        await this.savePunish();

        await Utils.getMemberByID(this.conversation.userId)?.ban({
            reason: reason
        });
    }
}

export default PunishMemberHandler;