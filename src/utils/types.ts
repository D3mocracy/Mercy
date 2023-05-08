export type Conversation = {
    userId: string,
    staffMemberId?: string[],
    guildId: string,
    channelId: string,
    open: boolean
}

export type Config = {
    ticketCatagoryId: string,
    ticketLogId: string,
    managerRole: string,
    helperRole: string,
    memberRole: string,
    guildId: string,
    reportChannelId: string,
    reportHelperChannelId: string,
}

export type CustomMessage = {
    key: string,
    title: string,
    description: string,
    color: string,
}