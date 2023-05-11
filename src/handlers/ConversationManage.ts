import { ButtonInteraction, Client, TextChannel, ChatInputCommandInteraction } from "discord.js";
import DataBase from "../utils/db";
import { MessageUtils } from "../utils/MessageUtils";
import { Conversation } from "../utils/types";
import { Utils } from "../utils/Utils";
import Logger from "./Logger";
import { CantLoadConversationFromDB } from "../utils/Errors";
import ConfigHandler from "./Config";
import { ImportantLinksMessageUtils } from "../utils/MessageUtils/ImportantLinks";


class ConversationManageHandler {
    channel: TextChannel = {} as any;
    conversation: Conversation = {} as any;

    private constructor(private client: Client, private interaction: ButtonInteraction) { }

    static async createHandler(client: Client, interaction: ButtonInteraction) {
        const handler = new ConversationManageHandler(client, interaction);
        await handler.loadConversation();
        return handler;
    }

    async loadConversation(): Promise<void> {
        this.interaction.channel?.isDMBased()
            ? this.conversation = await DataBase.conversationsCollection.findOne({ userId: this.interaction.user.id, open: true }) as any
            : this.conversation = await DataBase.conversationsCollection.findOne({ channelId: this.interaction.channelId, open: true }) as any;
        if (this.conversation) {
            this.channel = await Utils.getChannelById(this.client, this.conversation.channelId) as TextChannel;
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
        await this.interaction.deferUpdate()
        const closedMessage = { embeds: [MessageUtils.EmbedMessages.chatClosed(closedBy, this.channel.name)] };
        this.conversation.open = false;
        await this.channel.send(closedMessage);
        Promise.all([
            Logger.logTicket(this.channel),
            this.interaction.message.edit({ components: [] }),
            this.client.users.cache?.get(this.conversation.userId)?.send(closedMessage) || "",
        ]).finally(() => this.channel.delete());
    }

    async attachHelper(staffMemberId: string): Promise<void> {
        if (!this.conversation.staffMemberId || this.conversation.staffMemberId.length === 0) {
            this.conversation.staffMemberId = [staffMemberId];
            await Promise.all([
                Utils.updatePermissionToChannel(this.client, this.conversation),
                this.interaction.reply({ embeds: [MessageUtils.EmbedMessages.staffMemberAttached(this.interaction.user.toString())] })
            ])
            return;
        }
        await this.interaction.reply({ ephemeral: true, content: "פסססטט...הצ'אט הזה כבר שויך למישהו" });
    }

    async revealUser() {
        if (!(await ConfigHandler.config.guild.members.fetch(this.interaction.user.id)).permissions.has("Administrator")) {
            await this.interaction.reply({ content: "אין לך מספיק הרשאות כדי לבצע פעולה זו", ephemeral: true });
            return;
        }
        await this.interaction.reply({
            ephemeral: true,
            embeds: [await MessageUtils.EmbedMessages.revealUserMessage(this.client, this.conversation.userId)]
        });
    }

    async resetHelpers() {
        this.conversation.staffMemberId = [];
        await Utils.updatePermissionToChannel(this.client, this.conversation);
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

}

export default ConversationManageHandler;