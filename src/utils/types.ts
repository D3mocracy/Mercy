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
    conversationCatagoryId: string,
    conversationLogId: string,
    managerRole: string,
    helperRole: string,
    memberRole: string,
    guildId: string,
    reportChannelId: string,
    requestHelperChannelId: string,
    staffChannelId: string,
    helperOfTheMonthRoleId: string,
    errorChannelId: string,
    importantChannels: { [key: string]: string }[],
    suggestIdeasChannelId: string,
    vacationChannelId: string,
}

export type Config = Partial<{
    conversationCatagory: CategoryChannelResolvable,
    conversationLog: TextChannel,
    reportChannel: TextChannel,
    requestHelperChannel: TextChannel,
    staffChannel: TextChannel,
    errorChannel: TextChannel,
    suggestIdeasChannel: TextChannel,
    vacationChannel: TextChannel,
    managerRole: Role,
    helperRole: Role,
    memberRole: Role,
    helperOfTheMonthRole: Role,
    guild: Guild,
    importantChannels: { [key: string]: string }[],
}>

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