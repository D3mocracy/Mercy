import { ButtonInteraction, Client, Guild, GuildMember, TextChannel, User } from "discord.js";
import DataBase from "../utils/db";
import { MessageUtils } from "../utils/MessageUtils";
import { Conversation } from "../utils/types";
import { Utils } from "../utils/Utils";
import Logger from "./Logger";


class ConversationManageHandler {
    bot: Client = Utils.client;
    channel: TextChannel = {} as any;
    conversation: Conversation = {} as any;

    private constructor(private interaction: ButtonInteraction) {
        this.interaction = interaction;
    }

    static async createHandler(interaction: ButtonInteraction) {
        const handler = new ConversationManageHandler(interaction);
        await handler.loadConversation();
        return handler;
    }

    async loadConversation(): Promise<void> {
        this.interaction.channel?.isDMBased()
        ? this.conversation = await DataBase.conversationsCollection.findOne({ userId: this.interaction.user.id, open: true }) as any
        : this.conversation = await DataBase.conversationsCollection.findOne({ channelId: this.interaction.channelId, open: true }) as any
        this.channel = await Utils.getChannelById(this.conversation.channelId) as TextChannel;
    }

    async saveConversation() {
        await DataBase.conversationsCollection.updateOne({ channelId: this.conversation.channelId }, { $set: this.conversation }, { upsert: true })
    }

    async closeConversation(closedBy: string) {
        const closedMessage = { embeds: [MessageUtils.EmbedMessages.chatClosed(closedBy, this.channel.name)] };
        this.conversation.open = false;
        await Promise.all([
            this.channel.send(closedMessage),
            Logger.logTicket(this.channel),
            this.interaction?.channel?.isDMBased() ? this.interaction.message.edit({ components: [] }) : Promise.resolve()
        ]);
        await this.channel.delete();

        try {
            await Utils.client.users.cache?.get(this.conversation.userId)?.send(closedMessage) || "";
        } catch (error) {
            console.log("Can't send message to this member. User kicked/banned/left the server");
        }
    }

    async attachHelper(staffMemberId: string): Promise<void> {
        if (!this.conversation.staffMemberId || this.conversation.staffMemberId.length === 0) {
            this.conversation.staffMemberId = [staffMemberId];
            console.log(this.conversation);
            
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
        console.log('helpersList', helpersList);
        
            if (helpersList.length) {
                await this.interaction.reply({
                    ephemeral: true,
                    embeds: [MessageUtils.EmbedMessages.changeHelper],
                    components: [MessageUtils.Actions.changeHelper(helpersList),
                    MessageUtils.Actions.resetHelpers]
                });
            } else {
                await this.interaction.reply({content: "לא קיים משתמש עם דרגת תומך בשרת", ephemeral: true});
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