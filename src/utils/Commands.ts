import { SlashCommandBuilder, PermissionsBitField } from "discord.js"

export namespace Command {
    const openChat = new SlashCommandBuilder()
        .setName('openchat')
        .setDescription('שולח את ההודעה של פתיחת שאלה')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator);

    export const commands = [openChat]
}