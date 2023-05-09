import { SlashCommandBuilder, PermissionsBitField, ContextMenuCommandBuilder, ApplicationCommandType } from "discord.js"

export namespace Command {
    const openChat = new SlashCommandBuilder()
        .setName('openchat')
        .setDescription('שולח את ההודעה של פתיחת שאלה')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator);

    const setHelperOfTheMonth = new ContextMenuCommandBuilder()
        .setName('תומך החודש')
        .setType(ApplicationCommandType.User)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator);

    export const commands = [openChat, setHelperOfTheMonth]
}