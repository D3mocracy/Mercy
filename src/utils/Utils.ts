import { Channel, User, TextChannel, ChannelType, Client, Partials } from "discord.js";
import DataBase from "./db";
import { Conversation } from "./types";
import { Command } from "./Commands";
import ConfigHandler from "../handlers/Config";
import { client as c } from "..";
export namespace Utils {
    export const client = c;

    export async function turnOnBot() {
        await client.login(process.env.TOKEN);
        await client.application?.commands.set(Command.commands);
    }

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

    export async function getChannelById(channelId: string): Promise<Channel | null> {
        return await client.channels.fetch(channelId);
    }

    export async function getRoleById(roleId: string) {
        return await ConfigHandler.config.guild.roles.fetch(roleId);
    }

    export async function getUserByID(userId: string): Promise<User> {
        return await client.users.fetch(userId);
    }

    export async function getUsersWithRoleId(roleId: string) {
        // const config: Config = await new ConfigHandler().getConfig();
        return ConfigHandler.config.guild.members.cache.filter(member => member.roles.cache.find(role => role.id === roleId));
    }

    export async function updatePermissionToChannel(conversation: Conversation) {
        const channel: TextChannel = await getChannelById(conversation.channelId) as TextChannel;
        await channel.lockPermissions();

        if (!conversation.staffMemberId || conversation.staffMemberId.length === 0 || channel === null) return;

        conversation.staffMemberId.forEach(async memberId => {
            await channel.permissionOverwrites.create(memberId, { SendMessages: true })
        })

        const usernames = await Promise.all(conversation.staffMemberId.map(memberId => getUserByID(memberId)));
        return { usernames, conversation, channel };
    }

    export async function isTicketChannel(channel: Channel) {
        // const config: Config = await new ConfigHandler().getConfig();
        return channel.type === ChannelType.GuildText && (channel as TextChannel).parent === ConfigHandler.config.ticketCatagory;
    }

    export async function isGuildMember(userId: string) {
        // const config: Config = await new ConfigHandler().getConfig();
        return ConfigHandler.config.guild.members.cache.find((member) => member.id === userId);
    }

    export function getMembersById(...userId: string[]) {
        return userId.map(userId => ConfigHandler.config.guild.members.cache.get(userId));
        // return Utils.getGuild().members.cache.map(member => member.user.id === )
    }

    export function isManager(userId: string) {
        return ConfigHandler.config.guild.members.cache.get(userId)?.roles.cache.find((r) => r.id === ConfigHandler.config.managerRole.id);
    }

}