import { Channel, User, TextChannel, ChannelType, Client, Role, GuildMember, PermissionFlagsBits, CategoryChannel, Message } from "discord.js";
import DataBase from "./db";
import { Conversation } from "./types";
import ConfigHandler from "../handlers/Config";
import { ConversationManageMessageUtils } from "./MessageUtils/ConversationManage";
import Logger from "../handlers/Logger";
export namespace Utils {

    export async function hasOpenConversation(userId: string) {
        return !!(await DataBase.conversationsCollection.findOne({ userId, open: true }));
    }

    export async function getOpenConversation(userId: string) {
        const coversation = (await DataBase.conversationsCollection.findOne({ userId, open: true }));
        return coversation ? coversation : undefined;
    }

    export async function getNumberOfConversationFromDB() {
        return (await DataBase.conversationsCollection.find({
            subject: { $exists: true }
        }).toArray()).length;
    };

    export function getChannelById(client: Client, channelId: string): Channel | undefined {
        return client.channels.cache.get(channelId);
    }

    export function getChannelByIdNoClient(channelId: string): Channel | undefined {
        return ConfigHandler.config.guild?.channels.cache.get(channelId);
    }

    export function getRoleById(roleId: string) {
        return ConfigHandler.config.guild?.roles.cache.get(roleId);
    }

    export function getMemberByID(userId: string): GuildMember | undefined {
        return ConfigHandler.config.guild?.members.cache.get(userId);
    }

    export async function getMembersWithRole(role: Role) {
        await ConfigHandler.config.guild?.members.fetch();
        return role.members.map(m => m);
    }

    export function getHelperClaimedConversationNumber(helperId: string) {
        return (ConfigHandler.config.conversationCatagory as any)?.children.cache.filter((c: TextChannel) => {
            const helperPermission = c.permissionOverwrites.cache.get(helperId);
            return helperPermission?.allow?.has(PermissionFlagsBits.SendMessages);
        }).size;
    }

    export function getGenderByUserId(userId: string) {
        const member = ConfigHandler.config.guild?.members.cache.get(userId);
        return member?.roles.cache.find(role =>
            (role.id === "1148302562009813122" || role.id === "1148302563196805231" || role.id === "1148302566640324639"));
    }

    export async function updatePermissionToChannel(client: Client, conversation: Conversation) {
        // const channel: TextChannel = Utils.getChannelById(client, conversation.channelId) as TextChannel;
        const channel = await ConfigHandler.config.guild?.channels.fetch(conversation.channelId) as TextChannel

        await channel.lockPermissions();

        if (!conversation.staffMemberId || conversation.staffMemberId.length === 0 || channel === null) return;

        conversation.staffMemberId.forEach(async memberId => {
            await channel.permissionOverwrites.create(memberId, { SendMessages: true })
        })

        const usernames = await Promise.all(conversation.staffMemberId.map(memberId => Utils.getMemberByID(memberId)));
        return { usernames, conversation, channel };
    }

    export function isConversationChannel(channel: Channel) {
        return channel.type === ChannelType.GuildText && (channel as TextChannel).parent === ConfigHandler.config.conversationCatagory;
    }

    export function getMembersById(...userId: string[]) {
        return userId.map(userId => ConfigHandler.config.guild?.members.cache.get(userId));
    }

    export function isAdministrator(userId: string) {
        return Utils.getMemberByID(userId)?.permissions.has("Administrator");
    }

    export function isManager(userId: string) {
        return ConfigHandler.config.guild?.members.cache.get(userId)?.roles.cache.find((r) => r.id === ConfigHandler.config.managerRole?.id);
    }

    export function isSupervisor(userId: string) {
        return ConfigHandler.config.guild?.members.cache.get(userId)?.roles.cache.find((r) => r.id === ConfigHandler.config.supervisorRole?.id);
    }

    export function isHelper(userId: string) {
        return ConfigHandler.config.guild?.members.cache.get(userId)?.roles.cache.find((r) => r.id === ConfigHandler.config.helperRole?.id);
    }

    export function isSeniorStaff(userId: string) {
        return isManager(userId) || isSupervisor(userId) || isAdministrator(userId);
    }

    export function isMemberInGuild(userId: string) {
        return !!ConfigHandler.config.guild?.members.cache.get(userId);
    }

    export async function checkChannels() {
        try {
            const conversationCategory = ConfigHandler.config.conversationCatagory as CategoryChannel;

            const textChannels = conversationCategory.children.cache.map(c => c as TextChannel);

            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

            const unActiveChannels: TextChannel[] = [];

            for (const channel of textChannels) {
                const messages = await channel.messages.fetch({ limit: 1 });
                const lastMessage = messages.first() as Message;

                if (lastMessage && !lastMessage.author.bot && lastMessage.createdTimestamp < twentyFourHoursAgo.getTime()) {
                    unActiveChannels.push(channel);

                    //CLOSE CHANNEL
                    /*const conversation = await DataBase.conversationsCollection.findOne({ channelId: channel.id, open: true }) as Conversation;
                    const closedMessage = { content: `המערכת לא זיהתה הודעה ב-24 השעות האחרונות ולכן הצ'אט נסגר עקב חוסר פעילות. ניתן לפנות אלינו שוב בכל עת על ידי פתיחת צ'אט חדש.`, embeds: [ConversationManageMessageUtils.EmbedMessages.chatClosed("הבוט", channel.name)] };
                    const member = Utils.getMemberByID(conversation.userId) as GuildMember;
                    await Promise.all([
                        member.send(closedMessage),
                        channel.send(closedMessage),
                        Logger.logTicket(channel, member.user),
                        DataBase.conversationsCollection.updateOne({ channelId: channel.id }, { $set: { open: false } }, { upsert: true })
                    ]);
                    await channel.delete();*/
                }
            }

            // SEND NOTIFICATION MESSAGE TO MANAGERS
            if (unActiveChannels.length === 0) return;
            (await (Utils.getChannelByIdNoClient('1160678867485331546') as TextChannel).send({
                content: `${ConfigHandler.config.memberRole}`,
                embeds: [ConversationManageMessageUtils.EmbedMessages.unActiveChannels(unActiveChannels)]
            })).edit({ content: null })
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

}