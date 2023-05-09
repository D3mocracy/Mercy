import { ButtonInteraction, Client, TextChannel, ChatInputCommandInteraction } from "discord.js";
import DataBase from "../utils/db";
import { MessageUtils } from "../utils/MessageUtils";
import { Conversation } from "../utils/types";
import { Utils } from "../utils/Utils";
import Logger from "./Logger";
import { CantLoadConversationFromDB } from "../utils/Errors";


class ConversationManageHandler {
    bot: Client = Utils.client;
    channel: TextChannel = {} as any;
    conversation: Conversation = {} as any;

    private constructor(private interaction: ButtonInteraction) { }

    static async createHandler(interaction: ButtonInteraction) {
        const handler = new ConversationManageHandler(interaction);
        await handler.loadConversation();
        return handler;
    }

    async loadConversation(): Promise<void> {
        this.interaction.channel?.isDMBased()
            ? this.conversation = await DataBase.conversationsCollection.findOne({ userId: this.interaction.user.id, open: true }) as any
            : this.conversation = await DataBase.conversationsCollection.findOne({ channelId: this.interaction.channelId, open: true }) as any;
        if (this.conversation) {
            this.channel = await Utils.getChannelById(this.conversation.channelId) as TextChannel;
        } else {
            throw new CantLoadConversationFromDB();
        }
    }

    async saveConversation() {
        await DataBase.conversationsCollection.updateOne({ channelId: this.conversation.channelId }, { $set: this.conversation }, { upsert: true })
    }

    static async sendManageTools(interaction: ChatInputCommandInteraction) {
        if (await Utils.isTicketChannel(interaction.channel as TextChannel)) {
            await interaction.reply({
                embeds: [MessageUtils.EmbedMessages.newChatStaff()],
                components: [MessageUtils.Actions.supporterTools]
            });
        } else {
            await interaction.reply({ content: "ניתן לבצע את הפקודה הזו רק בצ'אטים", ephemeral: true });
        }

    }

    async sendSureMessageToClose() {
        await this.interaction.reply({ embeds: [MessageUtils.EmbedMessages.sureMessageToClose], components: [MessageUtils.Actions.tools_sure_close_yes_no()] });
    }

    async closeConversation(closedBy: string) {
        const closedMessage = { embeds: [MessageUtils.EmbedMessages.chatClosed(closedBy, this.channel.name)] };
        this.conversation.open = false;
        await this.channel.send(closedMessage);
        await Promise.all([
            Logger.logTicket(this.channel),
            this.interaction.message.edit({ components: [] }),
            Utils.client.users.cache?.get(this.conversation.userId)?.send(closedMessage) || "",
            this.interaction.deferUpdate()
        ]);
        await this.channel.delete();
    }

    async attachHelper(staffMemberId: string): Promise<void> {
        if (!this.conversation.staffMemberId || this.conversation.staffMemberId.length === 0) {
            this.conversation.staffMemberId = [staffMemberId];
            await Utils.updatePermissionToChannel(this.conversation);
            await this.interaction.reply({ embeds: [MessageUtils.EmbedMessages.staffMemberAttached(this.interaction.user.toString())] })
            return;
        }
        await this.interaction.reply({ ephemeral: true, content: "פסססטט...הצ'אט הזה כבר שויך למישהו" });
    }

    async revealUser() {
        if (!(await Utils.getGuild().members.fetch(this.interaction.user.id)).permissions.has("Administrator")) {
            await this.interaction.reply({ content: "אין לך מספיק הרשאות כדי לבצע פעולה זו", ephemeral: true });
            return;
        }
        await this.interaction.reply({
            ephemeral: true,
            embeds: [await MessageUtils.EmbedMessages.revealUserMessage(this.conversation.userId)]
        });
    }

    async resetHelpers() {
        this.conversation.staffMemberId = [];
        await Utils.updatePermissionToChannel(this.conversation);
        await (this.interaction.channel as TextChannel).send({ embeds: [MessageUtils.EmbedMessages.helpersReseted] });
    }

    async changeHelpersMessage() {
        const helpersList = (await Utils.getUsersWithRoleId('1036014794806939648')).map(m => m);

        if (helpersList.length) {
            await this.interaction.reply({
                ephemeral: true,
                embeds: [MessageUtils.EmbedMessages.changeHelper],
                components: [MessageUtils.Actions.changeHelper(helpersList),
                MessageUtils.Actions.resetHelpers]
            });
        } else {
            await this.interaction.reply({ content: "לא קיים משתמש עם דרגת תומך בשרת", ephemeral: true });
        }
    }

    async userReportOnHelper() {
        if (!this.conversation.staffMemberId || this.conversation.staffMemberId.length === 0) {
            await this.interaction.reply("עדיין לא שויך תומך לצ'אט זה")
        } else {
            await this.interaction.showModal(MessageUtils.Modals.reportHelperModal);
        }
    }

}

export default ConversationManageHandler;