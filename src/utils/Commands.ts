import { SlashCommandBuilder, PermissionsBitField, ContextMenuCommandBuilder, ApplicationCommandType } from "discord.js"

export namespace Command {
    const openChat = new SlashCommandBuilder()
        .setName('openchat')
        .setDescription('שולח את ההודעה של פתיחת שאלה')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator);

    const importantLinks = new SlashCommandBuilder()
        .setName('importantlinks')
        .setDescription('שולח הודעה עם לינקים ומידע חשוב')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator);

    const vacation = new SlashCommandBuilder()
        .setName('vacation')
        .setDescription('בקשה להיעדרות / הפחתת פעילות');

    const manageChat = new SlashCommandBuilder()
        .setName("manage")
        .setDescription("כלי הניהול של צ'אט זה")

    const sendStaffMessage = new SlashCommandBuilder()
        .setName("sendstaffmessage")
        .setDescription("שולח הודעה עם רשימה של הצוות")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator);

    const setHelperOfTheMonth = new ContextMenuCommandBuilder()
        .setName('תומך החודש')
        .setType(ApplicationCommandType.User)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator);

    const approveVacation = new ContextMenuCommandBuilder()
        .setName('אשר חופשה')
        .setType(ApplicationCommandType.Message)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator);


    export const commands = [openChat, setHelperOfTheMonth, manageChat, importantLinks, sendStaffMessage, vacation, approveVacation]
}