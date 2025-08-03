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

  const reopen = new SlashCommandBuilder()
    .setName("reopen")
    .setDescription("פתיחת צ'אט מחדש")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setDMPermission(false)
    .addNumberOption(option =>
      option.setName(`channel-number`)
        .setDescription('Number of chat to reopen')
        .setRequired(true)
    );

  const manageChat = new SlashCommandBuilder()
    .setName("manage")
    .setDescription("כלי הניהול של צ'אט זה");

  const sendStaffMessage = new SlashCommandBuilder()
    .setName("sendstaffmessage")
    .setDescription("שולח הודעה עם רשימה של הצוות")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setDMPermission(false);

  const channelInfo = new SlashCommandBuilder()
    .setName("chat-info")
    .setDescription("קבלת מידע על צ'אט")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setDMPermission(false)
    .addNumberOption(option =>
      option.setName(`channel-number`)
        .setDescription('Number of chat to get info about')
        .setRequired(true)
    );

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
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
    .setDMPermission(false);

  const criticalChat = new ContextMenuCommandBuilder()
    .setName("דיווח כצ'אט קריטי")
    .setType(ApplicationCommandType.Message)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setDMPermission(false);

  const punishmentManage = new SlashCommandBuilder()
    .setName("punishment")
    .setDescription("ניהול ענישות - הצגה, הוספה והסרה")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
    .setDMPermission(false)
    .addSubcommand(subcommand =>
      subcommand
        .setName("list")
        .setDescription("הצגת כל הענישות הפעילות")
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("user")
        .setDescription("הצגת ענישות של משתמש ספציפי")
        .addStringOption(option =>
          option.setName("user_id")
            .setDescription("מזהה המשתמש או מספר טלפון (עבור WhatsApp)")
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("remove")
        .setDescription("הסרת ענישה לפי מזהה")
        .addStringOption(option =>
          option.setName("punishment_id")
            .setDescription("מזהה הענישה להסרה")
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("add")
        .setDescription("הוספת ענישה ידנית")
        .addStringOption(option =>
          option.setName("user_id")
            .setDescription("מזהה המשתמש או מספר טלפון (עבור WhatsApp)")
            .setRequired(true)
        )
        .addStringOption(option =>
          option.setName("type")
            .setDescription("סוג הענישה")
            .setRequired(true)
            .addChoices(
              { name: "טיים אאוט", value: "timeout" },
              { name: "באן", value: "ban" }
            )
        )
        .addStringOption(option =>
          option.setName("reason")
            .setDescription("סיבת הענישה")
            .setRequired(true)
        )
        .addIntegerOption(option =>
          option.setName("days")
            .setDescription("מספר ימים (רק עבור טיים אאוט)")
            .setMinValue(1)
            .setMaxValue(27)
            .setRequired(false)
        )
    );

  export const commands = [
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
    reopen,
    punishmentManage
  ];
}
