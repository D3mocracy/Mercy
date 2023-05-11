import { Channel, User, TextChannel } from "discord.js";
import { Conversation } from "./types";
export declare namespace Utils {
    function hasOpenConversation(userId: string): Promise<boolean>;
    function getOpenConversation(userId: string): Promise<import("mongodb").WithId<import("bson").Document> | undefined>;
    function getNumberOfConversationFromDB(): Promise<number>;
    function getChannelById(channelId: string): Promise<Channel | null>;
    function getRoleById(roleId: string): Promise<import("discord.js").Role | null>;
    function getUserByID(userId: string): Promise<User>;
    function getUsersWithRoleId(roleId: string): Promise<import("@discordjs/collection").Collection<string, import("discord.js").GuildMember>>;
    function updatePermissionToChannel(conversation: Conversation): Promise<{
        usernames: User[];
        conversation: Conversation;
        channel: TextChannel;
    } | undefined>;
    function isTicketChannel(channel: Channel): Promise<boolean>;
    function isGuildMember(userId: string): Promise<import("discord.js").GuildMember | undefined>;
    function getMembersById(...userId: string[]): (import("discord.js").GuildMember | undefined)[];
    function isManager(userId: string): import("discord.js").Role | undefined;
}
//# sourceMappingURL=Utils.d.ts.map