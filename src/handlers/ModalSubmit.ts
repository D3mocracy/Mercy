import { GuildMember, ModalSubmitInteraction, TextChannel } from "discord.js"
import ConfigHandler from "./Config";
import { Utils } from "../utils/Utils";
import DataBase from "../utils/db";
import { Conversation } from "../utils/types";
import { ImportantLinksMessageUtils } from "../utils/MessageUtils/ImportantLinks";
import { ConversationManageMessageUtils } from "../utils/MessageUtils/ConversationManage";
import { MessageUtils } from "../utils/MessageUtils";
import { CantLoadConversationFromDB } from "../utils/Errors";

export class ModalSubmitHandler {

    constructor(protected interaction: ModalSubmitInteraction) { }

    async referManager() {
        (await ConfigHandler.config.requestHelperChannel?.send({
            content: `${ConfigHandler.config.supervisorRole} ${ConfigHandler.config.managerRole}`,
            embeds: [ConversationManageMessageUtils.EmbedMessages.referSupervisor(this.interaction)],
            components: [ConversationManageMessageUtils.Actions.supervisorRefferedTools(true, false), ConversationManageMessageUtils.Actions.tools_report_link(`https://discord.com/channels/${ConfigHandler.config.guild?.id}/${this.interaction.channelId}`)]
        }))?.edit({ content: null })
        await this.interaction.reply({ content: "ההפנייה נשלחה בהצלחה למפקחים", ephemeral: true });
    }

    async sendVacationMessage() {
        const [type, dateOne, dateTwo, cause] = [
            this.interaction.fields.getTextInputValue('vacation_type'),
            this.interaction.fields.getTextInputValue('vacation_date_one'),
            this.interaction.fields.getTextInputValue('vacation_date_two'),
            this.interaction.fields.getTextInputValue('vacation_cause'),
        ]
        await this.interaction.reply({ content: `בקשה להיעדרות או להפחתת פעילות נשלחה בהצלחה למנהלים`, ephemeral: true });
        (await ConfigHandler.config.vacationChannel?.send({
            content: `${ConfigHandler.config.managerRole}`,
            embeds: [MessageUtils.EmbedMessages.vacation(this.interaction.member as GuildMember, type, dateOne, dateTwo, cause)],
            components: [MessageUtils.Actions.disabledGreyButton(`סטטוס: בטיפול`)]
        }))?.edit({ content: null });
    }

    async sendVolunteerMessage() {
        const [dateOfBirth, aboutYourself, why, freq, other] = [
            this.interaction.fields.getTextInputValue('date_of_birth'),
            this.interaction.fields.getTextInputValue('about_yourself'),
            this.interaction.fields.getTextInputValue('why'),
            this.interaction.fields.getTextInputValue('freq'),
            this.interaction.fields.getTextInputValue('other'),
        ];

        (await ConfigHandler.config.volunteerChannel?.send({
            content: `${ConfigHandler.config.managerRole}`,
            embeds: [ImportantLinksMessageUtils.EmbedMessages.volunteer(this.interaction.user, dateOfBirth, aboutYourself, why, freq, other)],
        }))?.edit({ content: null });

        await DataBase.volunteerCollection.insertOne({
            userId: this.interaction.user.id,
            createdAt: new Date(),
            dateOfBirth,
            aboutYourself,
            why,
            freq,
            other
        })

        await this.interaction.reply({ content: `הטופס שמילאתם עבור התנדבות לשרת נשלח בהצלחה למנהלים`, ephemeral: true });

    }

    async findChannel() {
        const channelNumber = +(this.interaction.fields.getTextInputValue("channel_number"));
        const conversation: Conversation = await DataBase.conversationsCollection.findOne({ channelNumber }) as any;
        if (!conversation) {
            await this.interaction.reply({
                content: `לא הצלחתי למצוא את הצ'אט הזה: צ'אט מספר ${channelNumber}`,
                ephemeral: true
            });
            return;
        }
        await this.interaction.reply({
            embeds: [ConversationManageMessageUtils.EmbedMessages.findChannel(conversation)],
            ephemeral: true
        })

    }

    async suggestIdea() {
        const suggestExplain = this.interaction.fields.getTextInputValue("suggest_explain");
        const suggestComments = this.interaction.fields.getTextInputValue("suggest_comments");

        (await ConfigHandler.config.suggestIdeasChannel?.send({
            content: `${ConfigHandler.config.managerRole}`,
            embeds: [ImportantLinksMessageUtils.EmbedMessages.suggestIdea(
                suggestExplain,
                suggestComments,
                this.interaction.member as GuildMember
            )]
        }))?.edit({ content: null })

        await DataBase.suggestionCollection.insertOne({
            userId: this.interaction.user.id,
            createdAt: new Date(),
            suggestExplain,
            suggestComments
        })

        await this.interaction.reply({ content: "הטופס שמילאתם עבור פידבקים, הצעות ודיווחי באגים נשלח בהצלחה למנהלים", ephemeral: true });
    }

    async reportHelper() {
        const helperName = this.interaction.fields.getTextInputValue("helperName")
        const reportCause = this.interaction.fields.getTextInputValue('reportHelperCause');

        (await ConfigHandler.config.reportChannel?.send({
            content: `${ConfigHandler.config.managerRole}`,
            embeds: [ImportantLinksMessageUtils.EmbedMessages.reportHelperMessage(helperName, reportCause)],
            components: [ConversationManageMessageUtils.Actions.attachReport(false)]
        }))?.edit({ content: null });

        await DataBase.reportCollection.insertOne({
            userId: this.interaction.user.id,
            createdAt: new Date(),
            helperName,
            reportCause,
        })

        await this.interaction.reply({ content: "הטופס שמילאתם עבור דיווחים ותלונות על חברי צוות נשלח בהצלחה למנהלים", ephemeral: true });
    }

    async criticalChat() {
        const channel = (this.interaction.channel as TextChannel);
        if (channel.name.includes('❗')) {
            await this.interaction.reply({
                content: 'הפנייה בטיפול על ידי ההנהלה הגבוהה',
                ephemeral: true
            })
        } else {
            channel.setName(channel.name + " ❗");
            (await ConfigHandler.config.requestHelperChannel?.send({
                content: `${ConfigHandler.config.memberRole}`,
                embeds: [ConversationManageMessageUtils.EmbedMessages.criticalChat(this.interaction)],
                components: [ConversationManageMessageUtils.Actions.supervisorRefferedTools(true, false), ConversationManageMessageUtils.Actions.tools_report_link(`https://discord.com/channels/${ConfigHandler.config.guild?.id}/${this.interaction.channelId}`)]
            }))?.edit({ content: null });
            await this.interaction.reply({ content: "ההפנייה נשלחה בהצלחה להנהלה הגבוהה", ephemeral: true });
        }

    }

}