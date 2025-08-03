import { CategoryChannelResolvable, TextChannel, Role, Guild, CategoryChannel } from "discord.js";
import { ObjectId } from "mongodb";

export interface Conversation {
    _id?: ObjectId;
    userId: string;
    staffMemberId?: string[];
    guildId: string;
    channelId: string;
    open: boolean;
    date: Date;
    subject: string;
    channelNumber?: number;
    source: 'discord' | 'whatsapp';
    whatsappNumber?: string;
}

export interface DatabaseDocument {
    _id?: ObjectId;
    createdAt: Date;
    updatedAt?: Date;
}

export interface Report extends DatabaseDocument {
    userId: string;
    helperName: string;
    reportCause: string;
}

export interface Suggestion extends DatabaseDocument {
    userId: string;
    suggestExplain: string;
    suggestComments: string;
}

export interface Volunteer extends DatabaseDocument {
    userId: string;
    dateOfBirth: string;
    aboutYourself: string;
    why: string;
    freq: string;
    other: string;
}

export type Punish = {
    punishType: "timeout" | "ban",
    reason: string,
    punisherId: string,
    channelName: string,
    punishDate: Date
} & Conversation

export interface ConfigDocument {
    conversationCatagoryId: string;
    conversationLogId: string;
    managerRole: string;
    helperRole: string;
    supervisorRole: string;
    memberRole: string;
    guildId: string;
    reportChannelId: string;
    requestHelperChannelId: string;
    staffChannelId: string;
    helperOfTheMonthRoleId: string;
    helperitOfTheMonthRoleId: string;
    errorChannelId: string;
    punishmentChannelId: string;
    importantChannels: Record<string, string>[];
    suggestIdeasChannelId: string;
    vacationChannelId: string;
    volunteerChannelId: string;
}

export interface Config {
    conversationCatagory?: CategoryChannel;
    conversationLog?: TextChannel;
    reportChannel?: TextChannel;
    requestHelperChannel?: TextChannel;
    staffChannel?: TextChannel;
    errorChannel?: TextChannel;
    suggestIdeasChannel?: TextChannel;
    vacationChannel?: TextChannel;
    volunteerChannel?: TextChannel;
    punishmentChannel?: TextChannel;
    managerRole?: Role;
    helperRole?: Role;
    supervisorRole?: Role;
    memberRole?: Role;
    helperOfTheMonthRole?: Role;
    helperitOfTheMonthRole?: Role;
    guild?: Guild;
    importantChannels?: Record<string, string>[];
}

export interface WhatsAppUser extends DatabaseDocument {
    phoneNumber: string;
    hasAcceptedTerms: boolean;
    pronouns?: 'את' | 'אתה' | 'אתם' | 'לא משנה לי';
    isBanned: boolean;
    bannedReason?: string;
    bannedDate?: Date;
    pendingCloseRequest?: boolean;
    pendingCloseTimestamp?: Date;
}

export interface CustomMessage {
    key: string;
    title: string;
    description: string;
    color: string;
    footer: {
        text: string;
        iconURL: string;
    };
    fields: EmbedField[];
}

export interface EmbedField {
    name: string;
    value: string;
    inline: boolean;
}

// Permission levels enum for type safety
export enum PermissionLevel {
    Member = 'member',
    Helper = 'helper',
    Supervisor = 'supervisor',
    Manager = 'manager',
    Admin = 'admin'
}

// Subject types for conversations
export enum ConversationSubject {
    GeneralHelp = 'general_help',
    TechnicalIssue = 'technical_issue',
    Complaint = 'complaint',
    Suggestion = 'suggestion',
    Other = 'other'
}