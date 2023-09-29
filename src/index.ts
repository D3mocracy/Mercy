require("dotenv").config();
import { ChatInputCommandInteraction, ModalSubmitInteraction, StringSelectMenuInteraction, Client, Partials, ButtonInteraction, IntentsBitField, ActivityFlags, ActivityType, ContextMenuCommandInteraction, Guild, BaseGuildTextChannel } from "discord.js";
import ChangeHelperHandler from "./handlers/ChangeHelper";
import CommandHandler from "./handlers/Command";
import CommunicateConversationHandler from "./handlers/CommunicateConversation";
import ConfigHandler from "./handlers/Config";
import ConversationManageHandler from "./handlers/ConversationManage";
import ConversationStaffToolsHandler from "./handlers/ConversationStaffTools";
import CustomEmbedMessages from "./handlers/CustomEmbedMessages";
import LeaveGuildHandler from "./handlers/LeaveGuild";
import StartConversation from "./handlers/StartConversation";
import { MessageUtils } from "./utils/MessageUtils";
import { Utils } from "./utils/Utils";
import DataBase from "./utils/db";
import Logger from "./handlers/Logger";
import { Command } from "./utils/Commands";
import { ModalSubmitHandler } from "./handlers/ModalSubmit";
import { ImportantLinksMessageUtils } from "./utils/MessageUtils/ImportantLinks";
import { ConversationManageMessageUtils } from "./utils/MessageUtils/ConversationManage";
import CreateConversationHandler from "./handlers/CreateConversation";
import OpenModalHandler from "./handlers/OpenModal";
import PunishMemberHandler from "./handlers/PunishMember";

//4194303
const client: Client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.DirectMessages,
    ], partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember]
});

DataBase.client.connect().then(async () => {
    await client.login(process.env.TOKEN);
    client.user?.setActivity({ type: ActivityType.Listening, name: "your heart" })
    await client.application?.commands.set(Command.commands);
}).catch((error) => {
    Logger.logError(error)
});

client.once('ready', async () => {
    const config = await new ConfigHandler().loadConfig(client);
    await config.guild?.members.fetch();
    console.log(`Logged in as ${client!.user?.tag}!`);
});

client.on('messageCreate', async message => {
    try {
        if (message.author.bot
            || message.attachments.size > 0
            || message.stickers.size > 0
            || !message.channel.isTextBased()) return;

        if (message.content.startsWith('&') && message.member?.permissions.has("Administrator")) {
            await (await CustomEmbedMessages.createHandler(client, CustomEmbedMessages.getKeyFromMessage(message.content), message.channelId))?.sendMessage();
            message.delete();
        }

        if (message.channel.id === "1148286189925838858" && message.channel instanceof BaseGuildTextChannel) {
            message.react("🤍");
            message.channel.permissionOverwrites.edit(message.author.id, { SendMessages: false });
        }

        const hasOpenConversation = await Utils.hasOpenConversation(message.author.id);
        if ((message.channel.isDMBased() && hasOpenConversation) || Utils.isTicketChannel(message.channel)) {
            await new CommunicateConversationHandler(client, message, message.channel.type).handle();
        }

    } catch (error: any) {
        Logger.logError(error);
    }
});

client.on('interactionCreate', async interaction => {

    const actionHandler = new Map<string, () => Promise<void>>([
        ['openChatButton', async () => {
            const hanlder = await StartConversation.createHandler(interaction as ButtonInteraction);
            await hanlder.handle();
        }],
        ['select_subject', async () => {
            const hanlder = await CreateConversationHandler.createHandler(interaction as StringSelectMenuInteraction);
            await hanlder.handle();
        }],
        ['manager_attach_report', async () => {
            await new ConversationStaffToolsHandler(interaction as ButtonInteraction).managerAttachReport();
        }],
        ['manager_mark_as_done', async () => {
            await new ConversationStaffToolsHandler(interaction as ButtonInteraction).managerMarkRequestAsDone();
        }],
        ['manager_in_progress', async () => {
            await new ConversationStaffToolsHandler(interaction as ButtonInteraction).supervisorInProgress();
        }],
        ['tools_attach', async () => {
            const conversationManage = await ConversationManageHandler.createHandler(client, interaction as ButtonInteraction);
            await conversationManage.attachHelper(interaction.user.id);
            await conversationManage.saveConversation();
        }],
        ['tools_close', async () => {
            try {
                const conversationManage = await ConversationManageHandler.createHandler(client, interaction as ButtonInteraction);
                await conversationManage.sendSureMessageToClose();
            } catch (error) {
                (interaction as ButtonInteraction).message.edit({ components: [] });
                interaction.channel?.send({ embeds: [MessageUtils.EmbedMessages.chatIsNotAvailable] });
            }
        }],
        ['sure_yes', async () => {
            try {
                const conversationManage = await ConversationManageHandler.createHandler(client, interaction as ButtonInteraction);
                await (interaction as ButtonInteraction).message.edit({ components: [] });
                await conversationManage.closeConversation(interaction.channel?.isDMBased() ? "משתמש" : "איש צוות");
                await conversationManage.saveConversation();
            } catch (error) {
                (interaction as ButtonInteraction).message.edit({ components: [] });
                interaction.channel?.send({ embeds: [MessageUtils.EmbedMessages.chatIsNotAvailable] });
            }
        }],
        ['sure_no', async () => {
            await interaction.channel?.send('הפעולה בוטלה');
            (interaction as ButtonInteraction).message.edit({ components: [] });
        }],
        ['tools_manager', async () => {
            Utils.isSeniorStaff(interaction.user.id)
                ? await (interaction as ButtonInteraction).reply({
                    ephemeral: true, embeds: [ConversationManageMessageUtils.EmbedMessages.ManagerTools],
                    components: [ConversationManageMessageUtils.Actions.managerTools]
                })
                : await (interaction as ButtonInteraction).reply({ content: "אין לך הרשאות להשתמש בהגדרות ניהול", ephemeral: true });
        }],
        ['tools_manager_reveal', async () => {
            const conversationManage = await ConversationManageHandler.createHandler(client, interaction as ButtonInteraction);
            await conversationManage.revealUser();
        }],
        ['tools_manager_change_supporter', async () => {
            const conversationManage = await ConversationManageHandler.createHandler(client, interaction as ButtonInteraction);
            await conversationManage.changeHelpersMessage();
        }],
        ['tools_manager_punish', async () => {
            const conversationManage = await ConversationManageHandler.createHandler(client, interaction as ButtonInteraction);
            await conversationManage.sendPunishMessage();
        }],
        ['tools_reset_helpers', async () => {
            const conversationManage = await ConversationManageHandler.createHandler(client, interaction as ButtonInteraction);
            await conversationManage.resetHelpers();
            await conversationManage.saveConversation();
        }],
        ['tools_refer_manager', async () => {
            const conversationManage = await ConversationManageHandler.createHandler(client, interaction as ButtonInteraction);
            await conversationManage.openRefferSupervisorModal();
        }],
        ['user_report_helper', async () => {
            await new OpenModalHandler(interaction as ButtonInteraction).openModal();
        }],
        ['user_volunteer', async () => {
            await new OpenModalHandler(interaction as ButtonInteraction).openModal();
        }],
        ['user_suggest', async () => {
            await new OpenModalHandler(interaction as ButtonInteraction).openModal();
        }],
        ['reportHelperModal', async () => {
            await new ModalSubmitHandler(interaction as ModalSubmitInteraction).reportHelper();
        }],
        ['referManager', async () => {
            await new ModalSubmitHandler(interaction as ModalSubmitInteraction).referManager();
        }],
        ['volunteer_modal', async () => {
            await new ModalSubmitHandler(interaction as ModalSubmitInteraction).sendVolunteerMessage();
        }],
        ['suggestIdea', async () => {
            await new ModalSubmitHandler(interaction as ModalSubmitInteraction).suggestIdea();
        }],
        ['vacationModal', async () => {
            await new ModalSubmitHandler(interaction as ModalSubmitInteraction).sendVacationMessage();
        }],
        ['helpers_list', async () => {
            await new ChangeHelperHandler(client, interaction as StringSelectMenuInteraction).handle();
        }],
        ['openchat', async () => {
            await new CommandHandler(interaction as ChatInputCommandInteraction).openChat();
        }],
        ['תומך החודש', async () => {
            await new CommandHandler(interaction as ContextMenuCommandInteraction).makeHelperOfTheMonth("helper");
        }],
        ['תומכת החודש', async () => {
            await new CommandHandler(interaction as ContextMenuCommandInteraction).makeHelperOfTheMonth("helperit");
        }],
        ['אשר חופשה', async () => {
            await new CommandHandler(interaction as ContextMenuCommandInteraction).approveVacation();
        }],
        ['manage', async () => {
            await new CommandHandler(interaction as ChatInputCommandInteraction).sendManageTools();
        }],
        ['importantlinks', async () => {
            await new CommandHandler(interaction as ChatInputCommandInteraction).importantLinks();
        }],
        ['sendstaffmessage', async () => {
            await new CommandHandler(interaction as ChatInputCommandInteraction).sendStaffMessage();
        }],
        ['vacation', async () => {
            await (interaction as ChatInputCommandInteraction).showModal(MessageUtils.Modals.vacationModal);
        }],
        ['punish_menu', async () => {
            await new OpenModalHandler(interaction as ButtonInteraction).openModal();
        }],
        ['punish_history', async () => {
            //TODO
            await new OpenModalHandler(interaction as ButtonInteraction).openModal();
        }],
        ['punish_timeout', async () => {
            await new OpenModalHandler(interaction as ButtonInteraction).openModal();
        }],
        ['punish_kick', async () => {
            await new OpenModalHandler(interaction as ButtonInteraction).openModal();
        }],
        ['punish_ban', async () => {
            await new OpenModalHandler(interaction as ButtonInteraction).openModal();
        }],
        ['punishKickModal', async () => {
            await (await PunishMemberHandler.createHandler(interaction as ModalSubmitInteraction)).kick();
        }],
        ['punishBanModal', async () => {
            await (await PunishMemberHandler.createHandler(interaction as ModalSubmitInteraction)).ban();
        }],
        ['punishMuteModal', async () => {
            await (await PunishMemberHandler.createHandler(interaction as ModalSubmitInteraction)).mute();
        }],
    ]);

    try {
        if (interaction.isButton() || interaction.isModalSubmit() || interaction.isStringSelectMenu() || interaction.isCommand()) {
            const action = interaction.isCommand() ? interaction.commandName : interaction.customId;
            const handler = actionHandler.get(action);

            if (handler) {
                await handler();
                if (!(interaction.deferred || interaction.replied)) {
                    interaction.isCommand() ? await interaction.deferReply() : await interaction.deferUpdate();
                }
            }
        }

    } catch (error: any) {
        Logger.logError(error);
    }

});

client.on('guildMemberRemove', async member => {
    try {
        if (!await Utils.hasOpenConversation(member.id)) return;
        const leaveGuildHandler = new LeaveGuildHandler(client, member.user.id);
        await leaveGuildHandler.loadConversation();
        await leaveGuildHandler.closeConversation();
    } catch (error: any) {
        Logger.logError(error);
    }
});

client.on('guildMemberAdd', async member => {
    try {
        const memberRole = ConfigHandler.config.memberRole;
        memberRole && member.roles.add(memberRole);
    } catch (error: any) {
        Logger.logError(error);
    }
});

client.on('channelDelete', async channel => {
    try {
        await DataBase.conversationsCollection.updateOne({ channelId: channel.id }, { $set: { open: false } });
    } catch (error: any) {
        Logger.logError(error);
    }
})