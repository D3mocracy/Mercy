import { CategoryChannelResolvable, TextChannel, Role, Guild } from "discord.js";
export declare type Conversation = {
    userId: string;
    staffMemberId?: string[];
    guildId: string;
    channelId: string;
    open: boolean;
    date: Date;
};
export declare type ConfigDocument = {
    conversationCatagoryId: string;
    conversationLogId: string;
    managerRole: string;
    helperRole: string;
    memberRole: string;
    guildId: string;
    reportChannelId: string;
    requestHelperChannelId: string;
    staffChannelId: string;
    helperOfTheMonthRoleId: string;
    errorChannelId: string;
    importantChannels: {
        [key: string]: string;
    }[];
};
export declare type Config = {
    ticketCatagory: CategoryChannelResolvable;
    ticketLog: TextChannel;
    reportChannel: TextChannel;
    reportHelperChannel: TextChannel;
    staffChannel: TextChannel;
    errorChannel: TextChannel;
    managerRole: Role;
    helperRole: Role;
    memberRole: Role;
    helperOfTheMonthRole: Role;
    guild: Guild;
    importantChannels: {
        [key: string]: string;
    }[];
};
export declare type CustomMessage = {
    key: string;
    title: string;
    description: string;
    color: string;
    footer: {
        text: string;
        iconURL: string;
    };
    fields: embedField[];
};
declare type embedField = {
    name: string;
    value: string;
    inline: boolean;
};
export {};
//# sourceMappingURL=types.d.ts.map