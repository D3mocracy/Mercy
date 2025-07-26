"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const discord_js_1 = require("discord.js");
var Command;
(function (Command) {
    const openChat = new discord_js_1.SlashCommandBuilder()
        .setName("openchat")
        .setDescription("שולח את ההודעה של פתיחת שאלה")
        .setDefaultMemberPermissions(discord_js_1.PermissionsBitField.Flags.Administrator)
        .setDMPermission(false);
    const importantLinks = new discord_js_1.SlashCommandBuilder()
        .setName("importantlinks")
        .setDescription("שולח הודעה עם לינקים ומידע חשוב")
        .setDefaultMemberPermissions(discord_js_1.PermissionsBitField.Flags.Administrator)
        .setDMPermission(false);
    const vacation = new discord_js_1.SlashCommandBuilder()
        .setName("vacation")
        .setDescription("בקשה להיעדרות או להפחתת פעילות")
        .setDefaultMemberPermissions(discord_js_1.PermissionsBitField.Flags.Administrator)
        .setDMPermission(false);
    const reopen = new discord_js_1.SlashCommandBuilder()
        .setName("reopen")
        .setDescription("פתיחת צ'אט מחדש")
        .setDefaultMemberPermissions(discord_js_1.PermissionsBitField.Flags.Administrator)
        .setDMPermission(false)
        .addNumberOption(option => option.setName(`channel-number`)
        .setDescription('Number of chat to reopen')
        .setRequired(true));
    const manageChat = new discord_js_1.SlashCommandBuilder()
        .setName("manage")
        .setDescription("כלי הניהול של צ'אט זה");
    const sendStaffMessage = new discord_js_1.SlashCommandBuilder()
        .setName("sendstaffmessage")
        .setDescription("שולח הודעה עם רשימה של הצוות")
        .setDefaultMemberPermissions(discord_js_1.PermissionsBitField.Flags.Administrator)
        .setDMPermission(false);
    const channelInfo = new discord_js_1.SlashCommandBuilder()
        .setName("channel-info")
        .setDescription("קבלת מידע על צ'אט")
        .setDefaultMemberPermissions(discord_js_1.PermissionsBitField.Flags.Administrator)
        .setDMPermission(false);
    const setHelperOfTheMonth = new discord_js_1.ContextMenuCommandBuilder()
        .setName("חבר הצוות של החודש")
        .setType(discord_js_1.ApplicationCommandType.User)
        .setDefaultMemberPermissions(discord_js_1.PermissionsBitField.Flags.Administrator)
        .setDMPermission(false);
    const setHelperitOfTheMonth = new discord_js_1.ContextMenuCommandBuilder()
        .setName("חברת הצוות של החודש")
        .setType(discord_js_1.ApplicationCommandType.User)
        .setDefaultMemberPermissions(discord_js_1.PermissionsBitField.Flags.Administrator)
        .setDMPermission(false);
    const approveVacation = new discord_js_1.ContextMenuCommandBuilder()
        .setName("אשר חופשה")
        .setType(discord_js_1.ApplicationCommandType.Message)
        .setDefaultMemberPermissions(discord_js_1.PermissionsBitField.Flags.BanMembers)
        .setDMPermission(false);
    const criticalChat = new discord_js_1.ContextMenuCommandBuilder()
        .setName("דיווח כצ'אט קריטי")
        .setType(discord_js_1.ApplicationCommandType.Message)
        .setDefaultMemberPermissions(discord_js_1.PermissionsBitField.Flags.Administrator)
        .setDMPermission(false);
    Command.commands = [
        openChat,
        setHelperOfTheMonth,
        setHelperitOfTheMonth,
        manageChat,
        importantLinks,
        sendStaffMessage,
        vacation,
        approveVacation,
        criticalChat,
        channelInfo,
        reopen
    ];
})(Command = exports.Command || (exports.Command = {}));
//# sourceMappingURL=Commands.js.map