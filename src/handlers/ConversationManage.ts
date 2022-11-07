import { ButtonInteraction, Client, Guild, GuildMember, TextChannel, User } from "discord.js";
import DataBase from "../utils/db";
import { MessageUtils } from "../utils/MessageUtils";
import { Conversation } from "../utils/types";
import { Utils } from "../utils/Utils";
import Logger from "./Logger";

class ConversationManageHandler {
    bot: Client = Utils.client;
    channel: TextChannel = {} as any;
    user: User = {} as any;
    staffMembers: GuildMember[] = [];
    guild: Guild = {} as any;
    conversation: Conversation = {} as any;

    private constructor(private channelId: string) {
        this.channelId = channelId;
    }

    static async createHandler(channelId: string) {
        const handler = new ConversationManageHandler(channelId);
        await handler.loadConversation();
        return handler;
    }

    async loadConversation(): Promise<void> {
        this.conversation = await DataBase.conversationsCollection.findOne({ channelId: this.channelId, open: true }) as any;
        this.guild = Utils.getGuild();
        this.channel = await Utils.getChannelById(this.conversation.channelId) as TextChannel;
        this.user = await Utils.getUserByID(this.conversation.userId) as User;
        this.staffMembers = this.conversation.staffMemberId?.map(memberId => this.guild.members.cache.get(memberId)) as any;
    }

    async saveConversation() {
        await DataBase.conversationsCollection.updateOne({ channelId: this.conversation.channelId }, { $set: this.conversation }, { upsert: true })
    }

    public async closeConversation(closedBy: string, interaction?: ButtonInteraction) {
        const closedMessage = { embeds: [MessageUtils.EmbedMessages.chatClosed(closedBy)] };
        this.conversation.open = false;
        await this.channel.send(closedMessage);
        await Logger.logTicket(this.channel);
        interaction ? await interaction.message.edit({ components: [] }) : "";
        await this.channel.delete();

        try {
            await Utils.client.users.cache?.get(this.conversation.userId)?.send(closedMessage) || "";
        } catch (error) {
            console.log("Can't send message to this member. User kicked/banned/left the server");

        }
    }

    async attachHelper(...staffMemberIds: string[]): Promise<boolean> {
        if (!this.conversation.staffMemberId || this.conversation.staffMemberId.length === 0) {
            this.conversation.staffMemberId = staffMemberIds;
            await Utils.updatePermissionToChannel(this.conversation);
            return true;
        }
        return false;
    }

}

export default ConversationManageHandler;