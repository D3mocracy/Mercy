"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const discord_js_1 = require("discord.js");
var Command;
(function (Command) {
    const openChat = new discord_js_1.SlashCommandBuilder()
        .setName('openchat')
        .setDescription('שולח את ההודעה של פתיחת שאלה')
        .setDefaultMemberPermissions(discord_js_1.PermissionsBitField.Flags.Administrator);
    const importantLinks = new discord_js_1.SlashCommandBuilder()
        .setName('importantlinks')
        .setDescription('שולח הודעה עם לינקים ומידע חשוב')
        .setDefaultMemberPermissions(discord_js_1.PermissionsBitField.Flags.Administrator);
    const vacation = new discord_js_1.SlashCommandBuilder()
        .setName('vacation')
        .setDescription('בקשה להיעדרות / הפחתת פעילות');
    const manageChat = new discord_js_1.SlashCommandBuilder()
        .setName("manage")
        .setDescription("כלי הניהול של צ'אט זה");
    const sendStaffMessage = new discord_js_1.SlashCommandBuilder()
        .setName("sendstaffmessage")
        .setDescription("שולח הודעה עם רשימה של הצוות")
        .setDefaultMemberPermissions(discord_js_1.PermissionsBitField.Flags.Administrator);
    const setHelperOfTheMonth = new discord_js_1.ContextMenuCommandBuilder()
        .setName('תומך החודש')
        .setType(discord_js_1.ApplicationCommandType.User)
        .setDefaultMemberPermissions(discord_js_1.PermissionsBitField.Flags.Administrator);
    const approveVacation = new discord_js_1.ContextMenuCommandBuilder()
        .setName('אשר חופשה')
        .setType(discord_js_1.ApplicationCommandType.Message)
        .setDefaultMemberPermissions(discord_js_1.PermissionsBitField.Flags.Administrator);
    Command.commands = [openChat, setHelperOfTheMonth, manageChat, importantLinks, sendStaffMessage, vacation, approveVacation];
})(Command = exports.Command || (exports.Command = {}));
//# sourceMappingURL=Commands.js.map