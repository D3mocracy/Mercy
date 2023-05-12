import { Channel, User, TextChannel, Client, Role } from "discord.js";
import { Conversation } from "./types";
export declare namespace Utils {
    function hasOpenConversation(userId: string): Promise<boolean>;
    function getOpenConversation(userId: string): Promise<import("mongodb").WithId<import("bson").Document> | undefined>;
    function getNumberOfConversationFromDB(): Promise<number>;
    function getChannelById(client: Client, channelId: string): Channel | undefined;
    function getRoleById(roleId: string): Role | undefined;
    function getUserByID(client: Client, userId: string): Promise<User>;
    function getMembersWithRole(role: Role): Promise<import("discord.js").GuildMember[]>;
    function updatePermissionToChannel(client: Client, conversation: Conversation): Promise<{
        usernames: User[];
        conversation: Conversation;
        channel: TextChannel;
    } | undefined>;
    function isTicketChannel(channel: Channel): boolean;
    function getMembersById(...userId: string[]): (import("discord.js").GuildMember | undefined)[];
    function isManager(userId: string): Role | undefined;
}
//# sourceMappingURL=Utils.d.ts.map