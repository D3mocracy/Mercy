import {
    ChatInputCommandInteraction,
    ModalSubmitInteraction,
    StringSelectMenuInteraction,
    Client,
    ButtonInteraction,
    UserContextMenuCommandInteraction,
    MessageContextMenuCommandInteraction
} from "discord.js";
import ChangeHelperHandler from "./ChangeHelper";
import CommandHandler from "./Command";
import ConversationManageHandler from "./ConversationManage";
import ConversationStaffToolsHandler from "./ConversationStaffTools";
import StartConversation from "./StartConversation";
import CreateConversationHandler from "./CreateConversation";
import { ModalSubmitHandler } from "./ModalSubmit";
import OpenModalHandler from "./OpenModal";
import PunishMemberHandler from "./PunishMember";
import UnactiveConversationHandler from "./UnactiveConversation";
import { MessageUtils } from "../utils/MessageUtils";
import { ConversationManageMessageUtils } from "../utils/MessageUtils/ConversationManage";
import { Utils } from "../utils/Utils";
import PunishmentManager from "./PunishmentManager";

type RouterContext = {
    conversationId: string | null;
};

type InteractionConfig = {
    handler: (interaction: any, ctx: RouterContext) => Promise<void>;
    deferral?: 'update' | 'reply' | 'none' | 'modal';
};

export class InteractionRouter {
    private interactionConfigs: Map<string, InteractionConfig>;

    constructor(private client: Client) {
        this.interactionConfigs = this.buildConfigs();
    }

    private buildConfigs(): Map<string, InteractionConfig> {
        const client = this.client;
        return new Map<string, InteractionConfig>([
            // ── Conversation start ──────────────────────────────────────────
            ['openChatButton', {
                deferral: 'none',
                handler: async (interaction) => {
                    const handler = await StartConversation.createHandler(interaction as ButtonInteraction);
                    await handler.handle();
                }
            }],
            ['select_subject', {
                deferral: 'none',
                handler: async (interaction) => {
                    const handler = await CreateConversationHandler.createHandler(interaction as StringSelectMenuInteraction);
                    await handler.handle();
                }
            }],

            // ── Staff report tools ──────────────────────────────────────────
            ['manager_attach_report', {
                deferral: 'update',
                handler: async (interaction) => {
                    await new ConversationStaffToolsHandler(interaction as ButtonInteraction).managerAttachReport();
                }
            }],
            ['manager_mark_as_done', {
                deferral: 'update',
                handler: async (interaction) => {
                    await new ConversationStaffToolsHandler(interaction as ButtonInteraction).managerMarkRequestAsDone();
                }
            }],
            ['manager_in_progress', {
                deferral: 'update',
                handler: async (interaction) => {
                    await new ConversationStaffToolsHandler(interaction as ButtonInteraction).supervisorInProgress();
                }
            }],

            // ── Conversation management ─────────────────────────────────────
            ['tools_attach', {
                deferral: 'none',
                handler: async (interaction) => {
                    const mgr = await ConversationManageHandler.createHandler(client, interaction as ButtonInteraction);
                    await mgr.attachHelper(interaction.user.id);
                    await mgr.saveConversation();
                }
            }],
            ['tools_close', {
                deferral: 'none',
                handler: async (interaction, ctx) => {
                    try {
                        const mgr = ctx.conversationId
                            ? await ConversationManageHandler.createHandlerWithId(client, interaction as ButtonInteraction, ctx.conversationId)
                            : await ConversationManageHandler.createHandler(client, interaction as ButtonInteraction);

                        if (!mgr.conversationData.open) {
                            await (interaction as ButtonInteraction).reply({
                                content: "הצ'אט הזה כבר נסגר. לא ניתן לבצע פעולות על צ'אטים סגורים.",
                                ephemeral: true
                            });
                            return;
                        }
                        await mgr.sendSureMessageToClose();
                    } catch {
                        await (interaction as ButtonInteraction).reply({
                            content: "הצ'אט הזה לא זמין עוד. לא ניתן לבצע פעולות על צ'אטים שנסגרו.",
                            ephemeral: true
                        });
                    }
                }
            }],
            ['sure_yes', {
                deferral: 'update',
                handler: async (interaction, ctx) => {
                    try {
                        const mgr = ctx.conversationId
                            ? await ConversationManageHandler.createHandlerWithId(client, interaction as ButtonInteraction, ctx.conversationId)
                            : await ConversationManageHandler.createHandler(client, interaction as ButtonInteraction);
                        await mgr.closeConversation(interaction.channel?.isDMBased() ? "משתמש" : "איש צוות");
                        await mgr.saveConversation();
                    } catch {
                        if (interaction.channel && 'send' in interaction.channel) {
                            await interaction.channel.send({ embeds: [MessageUtils.EmbedMessages.chatIsNotAvailable] });
                        }
                    }
                }
            }],
            ['sure_no', {
                deferral: 'none',
                handler: async (interaction) => {
                    try {
                        const mgr = await ConversationManageHandler.createHandler(client, interaction as ButtonInteraction);
                        if (!mgr.conversationData.open) {
                            await (interaction as ButtonInteraction).reply({
                                content: "הצ'אט הזה כבר נסגר. הפעולה לא רלוונטית עוד.",
                                ephemeral: true
                            });
                            return;
                        }
                        await (interaction as ButtonInteraction).reply({
                            embeds: [ConversationManageMessageUtils.EmbedMessages.actionCancelledCloseChat],
                            ephemeral: true
                        });
                    } catch {
                        await (interaction as ButtonInteraction).reply({
                            content: "הצ'אט הזה לא זמין עוד. לא ניתן לבצע פעולות על צ'אטים שנסגרו.",
                            ephemeral: true
                        });
                    }
                }
            }],
            ['tools_manager', {
                deferral: 'none',
                handler: async (interaction) => {
                    if (Utils.isSeniorStaff(interaction.user.id)) {
                        await (interaction as ButtonInteraction).reply({
                            ephemeral: true,
                            embeds: [ConversationManageMessageUtils.EmbedMessages.ManagerTools],
                            components: [ConversationManageMessageUtils.Actions.managerTools]
                        });
                    } else {
                        await (interaction as ButtonInteraction).reply({
                            content: "אין לך הרשאות להשתמש בהגדרות ניהול",
                            ephemeral: true
                        });
                    }
                }
            }],
            ['tools_manager_reveal', {
                deferral: 'none',
                handler: async (interaction) => {
                    const mgr = await ConversationManageHandler.createHandler(client, interaction as ButtonInteraction);
                    await mgr.revealUser();
                }
            }],
            ['tools_manager_change_supporter', {
                deferral: 'none',
                handler: async (interaction) => {
                    const mgr = await ConversationManageHandler.createHandler(client, interaction as ButtonInteraction);
                    await mgr.changeHelpersMessage();
                }
            }],
            ['tools_manager_punish', {
                deferral: 'none',
                handler: async (interaction) => {
                    const mgr = await ConversationManageHandler.createHandler(client, interaction as ButtonInteraction);
                    await mgr.sendPunishMessage();
                }
            }],
            ['tools_reset_helpers', {
                deferral: 'update',
                handler: async (interaction) => {
                    const mgr = await ConversationManageHandler.createHandler(client, interaction as ButtonInteraction);
                    await mgr.resetHelpers();
                    await mgr.saveConversation();
                }
            }],
            ['tools_refer_manager', {
                deferral: 'none',
                handler: async (interaction) => {
                    const mgr = await ConversationManageHandler.createHandler(client, interaction as ButtonInteraction);
                    await mgr.openRefferSupervisorModal();
                }
            }],

            // ── User action buttons ─────────────────────────────────────────
            ['user_report_helper', {
                deferral: 'none',
                handler: async (interaction) => {
                    await new OpenModalHandler(interaction as ButtonInteraction).openModal();
                }
            }],
            ['user_volunteer', {
                deferral: 'none',
                handler: async (interaction) => {
                    await new OpenModalHandler(interaction as ButtonInteraction).openModal();
                }
            }],
            ['user_suggest', {
                deferral: 'none',
                handler: async (interaction) => {
                    await new OpenModalHandler(interaction as ButtonInteraction).openModal();
                }
            }],

            // ── Modal submissions ───────────────────────────────────────────
            ['reportHelperModal', {
                deferral: 'none',
                handler: async (interaction) => {
                    await new ModalSubmitHandler(client, interaction as ModalSubmitInteraction).reportHelper();
                }
            }],
            ['referManager', {
                deferral: 'none',
                handler: async (interaction) => {
                    await new ModalSubmitHandler(client, interaction as ModalSubmitInteraction).referManager();
                }
            }],
            ['volunteer_modal', {
                deferral: 'none',
                handler: async (interaction) => {
                    await new ModalSubmitHandler(client, interaction as ModalSubmitInteraction).sendVolunteerMessage();
                }
            }],
            ['suggestIdea', {
                deferral: 'none',
                handler: async (interaction) => {
                    await new ModalSubmitHandler(client, interaction as ModalSubmitInteraction).suggestIdea();
                }
            }],
            ['vacationModal', {
                deferral: 'none',
                handler: async (interaction) => {
                    await new ModalSubmitHandler(client, interaction as ModalSubmitInteraction).sendVacationMessage();
                }
            }],
            ['criticalChatModal', {
                deferral: 'none',
                handler: async (interaction) => {
                    await new ModalSubmitHandler(client, interaction as ModalSubmitInteraction).criticalChat();
                }
            }],

            // ── Select menu actions ─────────────────────────────────────────
            ['helpers_list', {
                deferral: 'none',
                handler: async (interaction) => {
                    await new ChangeHelperHandler(interaction as StringSelectMenuInteraction).handle();
                }
            }],
            ['punish_menu', {
                deferral: 'none',
                handler: async (interaction) => {
                    await new OpenModalHandler(interaction as StringSelectMenuInteraction).openModal();
                }
            }],
            ['punish_history', {
                deferral: 'none',
                handler: async (interaction) => {
                    await PunishMemberHandler.sendPunishmentHistory(interaction as StringSelectMenuInteraction);
                }
            }],

            // ── Punishment modals ───────────────────────────────────────────
            ['punishBanModal', {
                deferral: 'none',
                handler: async (interaction) => {
                    const handler = await PunishMemberHandler.createHandler(interaction as ModalSubmitInteraction);
                    await handler.ban();
                }
            }],
            ['punishMuteModal', {
                deferral: 'none',
                handler: async (interaction) => {
                    const handler = await PunishMemberHandler.createHandler(interaction as ModalSubmitInteraction);
                    await handler.timeout();
                }
            }],

            // ── Inactive conversation buttons ───────────────────────────────
            ['unactive_continue_chat', {
                deferral: 'none',
                handler: async (interaction) => {
                    await new UnactiveConversationHandler().continueConversation(interaction as ButtonInteraction);
                }
            }],
            ['unactive_close_chat', {
                deferral: 'none',
                handler: async (interaction) => {
                    await new UnactiveConversationHandler().stopConversation(interaction as ButtonInteraction);
                }
            }],

            // ── Slash / context-menu commands ───────────────────────────────
            ['openchat', {
                deferral: 'reply',
                handler: async (interaction) => {
                    await new CommandHandler(client, interaction as ChatInputCommandInteraction).openChat();
                }
            }],
            ['חבר הצוות של החודש', {
                deferral: 'reply',
                handler: async (interaction) => {
                    await new CommandHandler(client, interaction as UserContextMenuCommandInteraction).makeHelperOfTheMonth("helper");
                }
            }],
            ['חברת הצוות של החודש', {
                deferral: 'reply',
                handler: async (interaction) => {
                    await new CommandHandler(client, interaction as UserContextMenuCommandInteraction).makeHelperOfTheMonth("helperit");
                }
            }],
            ['אשר חופשה', {
                deferral: 'reply',
                handler: async (interaction) => {
                    await new CommandHandler(client, interaction as MessageContextMenuCommandInteraction).approveVacation();
                }
            }],
            ['דיווח כצ\'אט קריטי', {
                deferral: 'modal',
                handler: async (interaction) => {
                    await new CommandHandler(client, interaction as UserContextMenuCommandInteraction).criticalChat();
                }
            }],
            ['manage', {
                deferral: 'reply',
                handler: async (interaction) => {
                    await new CommandHandler(client, interaction as ChatInputCommandInteraction).sendManageTools();
                }
            }],
            ['importantlinks', {
                deferral: 'reply',
                handler: async (interaction) => {
                    await new CommandHandler(client, interaction as ChatInputCommandInteraction).importantLinks();
                }
            }],
            ['sendstaffmessage', {
                deferral: 'reply',
                handler: async (interaction) => {
                    await new CommandHandler(client, interaction as ChatInputCommandInteraction).sendStaffMessage();
                }
            }],
            ['chat-info', {
                deferral: 'reply',
                handler: async (interaction) => {
                    await new CommandHandler(client, interaction as ChatInputCommandInteraction).findChannel();
                }
            }],
            ['reopen', {
                deferral: 'reply',
                handler: async (interaction) => {
                    await new CommandHandler(client, interaction as ChatInputCommandInteraction).reopenChat();
                }
            }],
            ['vacation', {
                deferral: 'modal',
                handler: async (interaction) => {
                    await (interaction as ChatInputCommandInteraction).showModal(MessageUtils.Modals.vacationModal);
                }
            }],
            ['punishment', {
                deferral: 'reply',
                handler: async (interaction) => {
                    await new PunishmentManager(interaction as ChatInputCommandInteraction).handleCommand();
                }
            }],
        ]);
    }

    async handleInteraction(interaction: any): Promise<void> {
        const rawAction = interaction.isCommand() ? interaction.commandName : interaction.customId;

        let action = rawAction;
        let conversationId: string | null = null;
        if (rawAction?.startsWith('tools_close_')) {
            action = 'tools_close';
            conversationId = rawAction.replace('tools_close_', '');
        }

        console.log('InteractionRouter handling action:', action, conversationId ? `with conversation ID: ${conversationId}` : '');

        const config = this.interactionConfigs.get(action);
        if (!config) {
            console.log('No handler found for action:', action);
            return;
        }

        // Apply deferral based on config
        if (config.deferral && config.deferral !== 'none' && config.deferral !== 'modal') {
            if (!interaction.replied && !interaction.deferred) {
                try {
                    if (config.deferral === 'reply') {
                        await interaction.deferReply({ ephemeral: true });
                        console.log('Successfully deferred interaction in router for:', action);
                    } else if (config.deferral === 'update') {
                        await interaction.deferUpdate();
                        console.log('Successfully deferred button update for:', action);
                    }
                } catch (deferError: any) {
                    console.log('Failed to defer in router:', deferError.message);
                    if (deferError.code === 10062 || deferError.code === 40060) {
                        console.log('Interaction invalid or already handled, skipping');
                        return;
                    }
                }
            }
        }

        console.log('Found handler for action:', action);
        await config.handler(interaction, { conversationId });
    }
}
