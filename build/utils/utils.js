"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const discord_js_1 = require("discord.js");
const db_1 = __importDefault(require("./db"));
const Config_1 = __importDefault(require("../handlers/Config"));
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
        return (await db_1.default.conversationsCollection.find().toArray()).length;
    }
    Utils.getNumberOfConversationFromDB = getNumberOfConversationFromDB;
    ;
    async function getChannelById(client, channelId) {
        return client.channels.cache.get(channelId);
    }
    Utils.getChannelById = getChannelById;
    async function getRoleById(roleId) {
        return Config_1.default.config.guild.roles.cache.get(roleId);
    }
    Utils.getRoleById = getRoleById;
    async function getUserByID(client, userId) {
        return await client.users.fetch(userId);
    }
    Utils.getUserByID = getUserByID;
    async function getUsersWithRoleId(roleId) {
        // const config: Config = await new ConfigHandler().getConfig();
        return Config_1.default.config.guild.members.cache.filter(member => member.roles.cache.find(role => role.id === roleId));
    }
    Utils.getUsersWithRoleId = getUsersWithRoleId;
    async function updatePermissionToChannel(client, conversation) {
        const channel = await Utils.getChannelById(client, conversation.channelId);
        await channel.lockPermissions();
        if (!conversation.staffMemberId || conversation.staffMemberId.length === 0 || channel === null)
            return;
        conversation.staffMemberId.forEach(async (memberId) => {
            await channel.permissionOverwrites.create(memberId, { SendMessages: true });
        });
        const usernames = await Promise.all(conversation.staffMemberId.map(memberId => Utils.getUserByID(client, memberId)));
        return { usernames, conversation, channel };
    }
    Utils.updatePermissionToChannel = updatePermissionToChannel;
    async function isTicketChannel(channel) {
        // const config: Config = await new ConfigHandler().getConfig();
        return channel.type === discord_js_1.ChannelType.GuildText && channel.parent === Config_1.default.config.conversationCatagory;
    }
    Utils.isTicketChannel = isTicketChannel;
    async function isGuildMember(userId) {
        // const config: Config = await new ConfigHandler().getConfig();
        return Config_1.default.config.guild.members.cache.find((member) => member.id === userId);
    }
    Utils.isGuildMember = isGuildMember;
    function getMembersById(...userId) {
        return userId.map(userId => Config_1.default.config.guild.members.cache.get(userId));
        // return Utils.getGuild().members.cache.map(member => member.user.id === )
    }
    Utils.getMembersById = getMembersById;
    function isManager(userId) {
        return Config_1.default.config.guild.members.cache.get(userId)?.roles.cache.find((r) => r.id === Config_1.default.config.managerRole.id);
    }
    Utils.isManager = isManager;
})(Utils = exports.Utils || (exports.Utils = {}));
//# sourceMappingURL=Utils.js.map