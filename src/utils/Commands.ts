import {
  SlashCommandBuilder,
  PermissionsBitField,
  ContextMenuCommandBuilder,
  ApplicationCommandType,
} from "discord.js";

export namespace Command {
  const openChat = new SlashCommandBuilder()
    .setName("openchat")
    .setDescription("שולח את ההודעה של פתיחת שאלה")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setDMPermission(false);

  const importantLinks = new SlashCommandBuilder()
    .setName("importantlinks")
    .setDescription("שולח הודעה עם לינקים ומידע חשוב")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setDMPermission(false);

  const vacation = new SlashCommandBuilder()
    .setName("vacation")
    .setDescription("בקשה להיעדרות או להפחתת פעילות")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setDMPermission(false);

  const manageChat = new SlashCommandBuilder()
    .setName("manage")
    .setDescription("כלי הניהול של צ'אט זה");

  const sendStaffMessage = new SlashCommandBuilder()
    .setName("sendstaffmessage")
    .setDescription("שולח הודעה עם רשימה של הצוות")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setDMPermission(false);

  const setHelperOfTheMonth = new ContextMenuCommandBuilder()
    .setName("חבר הצוות של החודש")
    .setType(ApplicationCommandType.User)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setDMPermission(false);

  const setHelperitOfTheMonth = new ContextMenuCommandBuilder()
    .setName("חברת הצוות של החודש")
    .setType(ApplicationCommandType.User)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setDMPermission(false);

  const approveVacation = new ContextMenuCommandBuilder()
    .setName("אשר חופשה")
    .setType(ApplicationCommandType.Message)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setDMPermission(false);

  const criticalChat = new ContextMenuCommandBuilder()
    .setName("דיווח כצ'אט קריטי")
    .setType(ApplicationCommandType.Message)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setDMPermission(false);

  export const commands = [
    openChat,
    setHelperOfTheMonth,
    setHelperitOfTheMonth,
    manageChat,
    importantLinks,
    sendStaffMessage,
    vacation,
    approveVacation,
    criticalChat
  ];
}
