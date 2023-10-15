import { Channel, TextChannel, Client, Role, GuildMember } from "discord.js";
import { Conversation } from "./types";
export declare namespace Utils {
    function hasOpenConversation(userId: string): Promise<boolean>;
    function getOpenConversation(userId: string): Promise<import("mongodb").WithId<import("bson").Document> | undefined>;
    function getNumberOfConversationFromDB(): Promise<number>;
    function getChannelById(client: Client, channelId: string): Channel | undefined;
    function getChannelByIdNoClient(channelId: string): Channel | undefined;
    function getRoleById(roleId: string): Role | undefined;
    function getMemberByID(userId: string): GuildMember | undefined;
    function getMembersWithRole(role: Role): Promise<GuildMember[]>;
    function getHelperClaimedConversationNumber(helperId: string): any;
    function updatePermissionToChannel(client: Client, conversation: Conversation): Promise<{
        usernames: (GuildMember | undefined)[];
        conversation: Conversation;
        channel: TextChannel;
    } | undefined>;
    function isConversationChannel(channel: Channel): boolean;
    function getMembersById(...userId: string[]): (GuildMember | undefined)[];
    function isAdministrator(userId: string): boolean | undefined;
    function isManager(userId: string): Role | undefined;
    function isSupervisor(userId: string): Role | undefined;
    function isHelper(userId: string): Role | undefined;
    function isSeniorStaff(userId: string): boolean | Role | undefined;
    function checkChannels(): Promise<void>;
}
//# sourceMappingURL=Utils.d.ts.map