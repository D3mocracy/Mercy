import { CategoryChannelResolvable, TextChannel, Role, Guild } from "discord.js";

export type Conversation = {
    userId: string,
    staffMemberId?: string[],
    guildId: string,
    channelId: string,
    open: boolean,
    date: Date,
}

export type ConfigDocument = {
    ticketCatagoryId: string,
    ticketLogId: string,
    managerRole: string,
    helperRole: string,
    memberRole: string,
    guildId: string,
    reportChannelId: string,
    reportHelperChannelId: string,
    staffChannelId: string,
    helperOfTheMonthRoleId: string,
    errorChannel: string,
}

export type Config = {
    ticketCatagory: CategoryChannelResolvable,
    ticketLog: TextChannel,
    reportChannel: TextChannel,
    reportHelperChannel: TextChannel,
    staffChannel: TextChannel,
    errorChannel: TextChannel,
    managerRole: Role,
    helperRole: Role,
    memberRole: Role,
    helperOfTheMonthRole: Role,
    guild: Guild,
}

export type CustomMessage = {
    key: string,
    title: string,
    description: string,
    color: string,
    footer: {
        text: string,
        iconURL: string
    },
    fields: embedField[]
}

type embedField = {
    name: string,
    value: string,
    inline: boolean
}