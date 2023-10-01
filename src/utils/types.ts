import { CategoryChannelResolvable, TextChannel, Role, Guild } from "discord.js";

export type Conversation = {
    userId: string,
    staffMemberId?: string[],
    guildId: string,
    channelId: string,
    open: boolean,
    date: Date,
    subject: string,
}

export type Punish = {
    punishType: "kick" | "timeout" | "ban",
    reason: string,
    punisherId: string,
    channelName: string,
    punishDate: Date
} & Conversation

export type ConfigDocument = {
    conversationCatagoryId: string,
    conversationLogId: string,
    managerRole: string,
    helperRole: string,
    supervisorRole: string,
    memberRole: string,
    guildId: string,
    reportChannelId: string,
    requestHelperChannelId: string,
    staffChannelId: string,
    helperOfTheMonthRoleId: string,
    helperitOfTheMonthRoleId: string,
    errorChannelId: string,
    punishmentChannelId: string,
    importantChannels: { [key: string]: string }[],
    suggestIdeasChannelId: string,
    vacationChannelId: string,
    volunteerChannelId: string,
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
    volunteerChannel: TextChannel,
    punishmentChannel: TextChannel,
    managerRole: Role,
    helperRole: Role,
    supervisorRole: Role,
    memberRole: Role,
    helperOfTheMonthRole: Role,
    helperitOfTheMonthRole: Role,
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