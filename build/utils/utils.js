"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const discord_js_1 = require("discord.js");
const db_1 = __importDefault(require("./db"));
const Config_1 = __importDefault(require("../handlers/Config"));
const ConversationManage_1 = require("./MessageUtils/ConversationManage");
const Logger_1 = __importDefault(require("../handlers/Logger"));
var Utils;
(function (Utils) {
    async function hasOpenConversation(userId) {
        return !!(await db_1.default.conversationsCollection.findOne({ userId, open: true }));
    }
    Utils.hasOpenConversation = hasOpenConversation;
    async function getOpenConversation(userId) {
        const coversation = (await db_1.default.conversationsCollection.findOne({ userId, open: true }));
        return coversation ? coversation : undefined;
    }
    Utils.getOpenConversation = getOpenConversation;
    async function getNumberOfConversationFromDB() {
        return (await db_1.default.conversationsCollection.find({
            subject: { $exists: true }
        }).toArray()).length;
    }
    Utils.getNumberOfConversationFromDB = getNumberOfConversationFromDB;
    ;
    function getChannelById(client, channelId) {
        return client.channels.cache.get(channelId);
    }
    Utils.getChannelById = getChannelById;
    function getChannelByIdNoClient(channelId) {
        return Config_1.default.config.guild?.channels.cache.get(channelId);
    }
    Utils.getChannelByIdNoClient = getChannelByIdNoClient;
    function getRoleById(roleId) {
        return Config_1.default.config.guild?.roles.cache.get(roleId);
    }
    Utils.getRoleById = getRoleById;
    function getMemberByID(userId) {
        return Config_1.default.config.guild?.members.cache.get(userId);
    }
    Utils.getMemberByID = getMemberByID;
    async function getMembersWithRole(role) {
        await Config_1.default.config.guild?.members.fetch();
        return role.members.map(m => m);
    }
    Utils.getMembersWithRole = getMembersWithRole;
    function getHelperClaimedConversationNumber(helperId) {
        return Config_1.default.config.conversationCatagory?.children.cache.filter((c) => {
            const helperPermission = c.permissionOverwrites.cache.get(helperId);
            return helperPermission?.allow?.has(discord_js_1.PermissionFlagsBits.SendMessages);
        }).size;
    }
    Utils.getHelperClaimedConversationNumber = getHelperClaimedConversationNumber;
    async function updatePermissionToChannel(client, conversation) {
        const channel = Utils.getChannelById(client, conversation.channelId);
        await channel.lockPermissions();
        if (!conversation.staffMemberId || conversation.staffMemberId.length === 0 || channel === null)
            return;
        conversation.staffMemberId.forEach(async (memberId) => {
            await channel.permissionOverwrites.create(memberId, { SendMessages: true });
        });
        const usernames = await Promise.all(conversation.staffMemberId.map(memberId => Utils.getMemberByID(memberId)));
        return { usernames, conversation, channel };
    }
    Utils.updatePermissionToChannel = updatePermissionToChannel;
    function isConversationChannel(channel) {
        return channel.type === discord_js_1.ChannelType.GuildText && channel.parent === Config_1.default.config.conversationCatagory;
    }
    Utils.isConversationChannel = isConversationChannel;
    function getMembersById(...userId) {
        return userId.map(userId => Config_1.default.config.guild?.members.cache.get(userId));
    }
    Utils.getMembersById = getMembersById;
    function isAdministrator(userId) {
        return Utils.getMemberByID(userId)?.permissions.has("Administrator");
    }
    Utils.isAdministrator = isAdministrator;
    function isManager(userId) {
        return Config_1.default.config.guild?.members.cache.get(userId)?.roles.cache.find((r) => r.id === Config_1.default.config.managerRole?.id);
    }
    Utils.isManager = isManager;
    function isSupervisor(userId) {
        return Config_1.default.config.guild?.members.cache.get(userId)?.roles.cache.find((r) => r.id === Config_1.default.config.supervisorRole?.id);
    }
    Utils.isSupervisor = isSupervisor;
    function isHelper(userId) {
        return Config_1.default.config.guild?.members.cache.get(userId)?.roles.cache.find((r) => r.id === Config_1.default.config.helperRole?.id);
    }
    Utils.isHelper = isHelper;
    function isSeniorStaff(userId) {
        return isManager(userId) || isSupervisor(userId) || isAdministrator(userId);
    }
    Utils.isSeniorStaff = isSeniorStaff;
    async function checkChannels() {
        try {
            const conversationCategory = Config_1.default.config.conversationCatagory;
            const textChannels = conversationCategory.children.cache.map(c => c);
            for (const channel of textChannels) {
                const messages = await channel.messages.fetch({ limit: 1 });
                const lastMessage = messages.first();
                if (lastMessage) {
                    if (!lastMessage.author.bot) {
                        //CLOSE CHANNEL
                        const conversation = await db_1.default.conversationsCollection.findOne({ channelId: channel.id, open: true });
                        const closedMessage = { content: `המערכת לא זיהתה הודעה ב-24 השעות האחרונות ולכן הצ'אט נסגר עקב חוסר פעילות. ניתן לפנות אלינו שוב בכל עת על ידי פתיחת צ'אט חדש.`, embeds: [ConversationManage_1.ConversationManageMessageUtils.EmbedMessages.chatClosed("הבוט", channel.name)] };
                        const member = Utils.getMemberByID(conversation.userId);
                        await Promise.all([
                            Utils.getMemberByID(conversation.userId)?.send(closedMessage),
                            channel.send(closedMessage),
                            Logger_1.default.logTicket(channel, member.user),
                            db_1.default.conversationsCollection.updateOne({ channelId: channel.id }, { $set: { open: false } }, { upsert: true })
                        ]);
                        await channel.delete();
                    }
                }
            }
        }
        catch (error) {
            console.error('An error occurred:', error);
        }
    }
    Utils.checkChannels = checkChannels;
})(Utils || (exports.Utils = Utils = {}));
//# sourceMappingURL=Utils.js.map