import { Channel, User, TextChannel, ChannelType, Client, Role } from "discord.js";
import DataBase from "./db";
import { Conversation } from "./types";
import ConfigHandler from "../handlers/Config";
export namespace Utils {

    export async function hasOpenConversation(userId: string) {
        return !!(await DataBase.conversationsCollection.findOne({ userId, open: true }));
    }

    export async function getOpenConversation(userId: string) {
        const coversation = (await DataBase.conversationsCollection.findOne({ userId, open: true }));
        return coversation ? coversation : undefined;
    }

    export async function getNumberOfConversationFromDB() {
        return (await DataBase.conversationsCollection.find().toArray()).length;
    };

    export function getChannelById(client: Client, channelId: string): Channel | undefined {
        return client.channels.cache.get(channelId);
    }

    export function getRoleById(roleId: string) {
        return ConfigHandler.config.guild?.roles.cache.get(roleId);
    }

    export async function getUserByID(client: Client, userId: string): Promise<User> {
        return await client.users.fetch(userId);
    }

    export async function getMembersWithRole(role: Role) {
        await ConfigHandler.config.guild?.members.fetch();
        return role.members.map(m => m);
    }

    export async function updatePermissionToChannel(client: Client, conversation: Conversation) {
        const channel: TextChannel = Utils.getChannelById(client, conversation.channelId) as TextChannel;
        await channel.lockPermissions();

        if (!conversation.staffMemberId || conversation.staffMemberId.length === 0 || channel === null) return;

        conversation.staffMemberId.forEach(async memberId => {
            await channel.permissionOverwrites.create(memberId, { SendMessages: true })
        })

        const usernames = await Promise.all(conversation.staffMemberId.map(memberId => Utils.getUserByID(client, memberId)));
        return { usernames, conversation, channel };
    }

    export function isTicketChannel(channel: Channel) {
        return channel.type === ChannelType.GuildText && (channel as TextChannel).parent === ConfigHandler.config.conversationCatagory;
    }

    export function getMembersById(...userId: string[]) {
        return userId.map(userId => ConfigHandler.config.guild?.members.cache.get(userId));
    }

    export function isManager(userId: string) {
        return ConfigHandler.config.guild?.members.cache.get(userId)?.roles.cache.find((r) => r.id === ConfigHandler.config.managerRole?.id);
    }

}