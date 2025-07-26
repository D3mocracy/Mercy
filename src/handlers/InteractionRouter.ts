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

type InteractionHandler = () => Promise<void>;

export class InteractionRouter {
    private actionHandlers: Map<string, InteractionHandler>;

    constructor(private client: Client) {
        this.actionHandlers = this.initializeHandlers();
    }

    private initializeHandlers(): Map<string, InteractionHandler> {
        return new Map([
            // Conversation Actions
            ['openChatButton', () => this.handleOpenChat()],
            ['select_subject', () => this.handleSelectSubject()],
            
            // Staff Tools
            ['manager_attach_report', () => this.handleManagerAttachReport()],
            ['manager_mark_as_done', () => this.handleManagerMarkAsDone()],
            ['manager_in_progress', () => this.handleManagerInProgress()],
            
            // Conversation Management
            ['tools_attach', () => this.handleToolsAttach()],
            ['tools_close', () => this.handleToolsClose()],
            ['sure_yes', () => this.handleSureYes()],
            ['sure_no', () => this.handleSureNo()],
            ['tools_manager', () => this.handleToolsManager()],
            ['tools_manager_reveal', () => this.handleToolsManagerReveal()],
            ['tools_manager_change_supporter', () => this.handleToolsManagerChangeSupporter()],
            ['tools_manager_punish', () => this.handleToolsManagerPunish()],
            ['tools_reset_helpers', () => this.handleToolsResetHelpers()],
            ['tools_refer_manager', () => this.handleToolsReferManager()],
            
            // User Actions
            ['user_report_helper', () => this.handleUserReportHelper()],
            ['user_volunteer', () => this.handleUserVolunteer()],
            ['user_suggest', () => this.handleUserSuggest()],
            
            // Modal Submissions
            ['reportHelperModal', () => this.handleReportHelperModal()],
            ['referManager', () => this.handleReferManagerModal()],
            ['volunteer_modal', () => this.handleVolunteerModal()],
            ['suggestIdea', () => this.handleSuggestIdeaModal()],
            ['vacationModal', () => this.handleVacationModal()],
            ['criticalChatModal', () => this.handleCriticalChatModal()],
            
            // Select Menu Actions
            ['helpers_list', () => this.handleHelpersList()],
            ['punish_menu', () => this.handlePunishMenu()],
            ['punish_history', () => this.handlePunishHistory()],
            
            // Punishment Modals
            ['punishKickModal', () => this.handlePunishKickModal()],
            ['punishBanModal', () => this.handlePunishBanModal()],
            ['punishMuteModal', () => this.handlePunishMuteModal()],
            
            // Inactive Conversation Actions
            ['unactive_continue_chat', () => this.handleUnactiveContinueChat()],
            ['unactive_close_chat', () => this.handleUnactiveCloseChat()],
            
            // Commands
            ['openchat', () => this.handleOpenChatCommand()],
            ['חבר הצוות של החודש', () => this.handleHelperOfTheMonthMale()],
            ['חברת הצוות של החודש', () => this.handleHelperOfTheMonthFemale()],
            ['אשר חופשה', () => this.handleApproveVacation()],
            ['דיווח כצ\'אט קריטי', () => this.handleCriticalChat()],
            ['manage', () => this.handleManageCommand()],
            ['importantlinks', () => this.handleImportantLinksCommand()],
            ['sendstaffmessage', () => this.handleSendStaffMessageCommand()],
            ['chat-info', () => this.handleChannelInfoCommand()],
            ['reopen', () => this.handleReopenCommand()],
            ['vacation', () => this.handleVacationCommand()],
        ]);
    }

    async handleInteraction(interaction: any): Promise<void> {
        const rawAction = interaction.isCommand() ? interaction.commandName : interaction.customId;
        
        // Handle conversation-specific close buttons
        let action = rawAction;
        let conversationId = null;
        if (rawAction.startsWith('tools_close_')) {
            action = 'tools_close';
            conversationId = rawAction.replace('tools_close_', '');
        }
        
        console.log('InteractionRouter handling action:', action, conversationId ? `with conversation ID: ${conversationId}` : '');
        
        const handler = this.actionHandlers.get(action);
        if (!handler) {
            console.log('No handler found for action:', action);
            return;
        }

        // For most slash commands, defer immediately to prevent timeout
        // Some commands like vacation need special handling (showModal)
        const commandsWithModal = ['vacation'];
        if (interaction.isCommand() && !commandsWithModal.includes(action) && !interaction.replied && !interaction.deferred) {
            try {
                await interaction.deferReply({ ephemeral: true });
                console.log('Successfully deferred interaction in router for:', action);
            } catch (deferError: any) {
                console.log('Failed to defer in router:', deferError.message);
                if (deferError.code === 10062 || deferError.code === 40060) {
                    console.log('Interaction invalid or already handled, skipping');
                    return;
                }
            }
        }

        // For button interactions that need deferUpdate, defer early
        // Some buttons use reply/showModal and handle their own acknowledgment
        const buttonsWithReply = [
            'openChatButton', 'sure_no', 'tools_manager', 'tools_close',
            'user_report_helper', 'user_volunteer', 'user_suggest',
            'punish_timeout', 'punish_kick', 'punish_ban',
            'unactive_continue_chat', 'unactive_close_chat', 'helpers_list',
            'tools_refer_manager', 'tools_attach', 'tools_manager_reveal',
            'tools_manager_change_supporter', 'tools_manager_punish',
            'manager_attach_report', 'manager_mark_as_done', 'manager_in_progress',
            'select_subject', 'punish_menu', 'punish_history'
        ];
        
        if (interaction.isButton() && !buttonsWithReply.includes(action) && !interaction.replied && !interaction.deferred) {
            try {
                await interaction.deferUpdate();
                console.log('Successfully deferred button update for:', action);
            } catch (deferError: any) {
                console.log('Failed to defer button update:', deferError.message);
                if (deferError.code === 10062 || deferError.code === 40060) {
                    console.log('Button interaction invalid or already handled, skipping');
                    return;
                }
            }
        }
        
        console.log('Found handler for action:', action);
        this.setCurrentInteraction(interaction, conversationId);
        await handler();
    }

    private currentInteraction: any;
    private currentConversationId: string | null = null;
    
    private setCurrentInteraction(interaction: any, conversationId: string | null = null) {
        this.currentInteraction = interaction;
        this.currentConversationId = conversationId;
    }

    // Conversation Actions
    private async handleOpenChat(): Promise<void> {
        const handler = await StartConversation.createHandler(this.currentInteraction as ButtonInteraction);
        await handler.handle();
    }

    private async handleSelectSubject(): Promise<void> {
        const handler = await CreateConversationHandler.createHandler(this.currentInteraction as StringSelectMenuInteraction);
        await handler.handle();
    }

    // Staff Tools
    private async handleManagerAttachReport(): Promise<void> {
        await new ConversationStaffToolsHandler(this.currentInteraction as ButtonInteraction).managerAttachReport();
    }

    private async handleManagerMarkAsDone(): Promise<void> {
        await new ConversationStaffToolsHandler(this.currentInteraction as ButtonInteraction).managerMarkRequestAsDone();
    }

    private async handleManagerInProgress(): Promise<void> {
        await new ConversationStaffToolsHandler(this.currentInteraction as ButtonInteraction).supervisorInProgress();
    }

    // Conversation Management
    private async handleToolsAttach(): Promise<void> {
        const conversationManage = await ConversationManageHandler.createHandler(this.client, this.currentInteraction as ButtonInteraction);
        await conversationManage.attachHelper(this.currentInteraction.user.id);
        await conversationManage.saveConversation();
    }

    private async handleToolsClose(): Promise<void> {
        try {
            const conversationManage = this.currentConversationId 
                ? await ConversationManageHandler.createHandlerWithId(this.client, this.currentInteraction as ButtonInteraction, this.currentConversationId)
                : await ConversationManageHandler.createHandler(this.client, this.currentInteraction as ButtonInteraction);
            
            // Check if conversation is already closed before showing confirmation
            if (!conversationManage.conversation.open) {
                await (this.currentInteraction as ButtonInteraction).reply({
                    content: "הצ'אט הזה כבר נסגר. לא ניתן לבצע פעולות על צ'אטים סגורים.",
                    ephemeral: true
                });
                return;
            }
            
            await conversationManage.sendSureMessageToClose();
        } catch (error) {
            await (this.currentInteraction as ButtonInteraction).reply({
                content: "הצ'אט הזה לא זמין עוד. לא ניתן לבצע פעולות על צ'אטים שנסגרו.",
                ephemeral: true
            });
        }
    }

    private async handleSureYes(): Promise<void> {
        try {
            const conversationManage = this.currentConversationId 
                ? await ConversationManageHandler.createHandlerWithId(this.client, this.currentInteraction as ButtonInteraction, this.currentConversationId)
                : await ConversationManageHandler.createHandler(this.client, this.currentInteraction as ButtonInteraction);
            await conversationManage.closeConversation(this.currentInteraction.channel?.isDMBased() ? "משתמש" : "איש צוות");
            await conversationManage.saveConversation();
        } catch (error) {
            if (this.currentInteraction.channel && 'send' in this.currentInteraction.channel) {
                await this.currentInteraction.channel.send({ embeds: [MessageUtils.EmbedMessages.chatIsNotAvailable] });
            }
        }
    }

    private async handleSureNo(): Promise<void> {
        try {
            // Try to load conversation to check if it's still valid
            const conversationManage = await ConversationManageHandler.createHandler(this.client, this.currentInteraction as ButtonInteraction);
            
            // Check if conversation is already closed
            if (!conversationManage.conversation.open) {
                await (this.currentInteraction as ButtonInteraction).reply({
                    content: "הצ'אט הזה כבר נסגר. הפעולה לא רלוונטית עוד.",
                    ephemeral: true
                });
                return;
            }
            
            await (this.currentInteraction as ButtonInteraction).reply({ 
                embeds: [ConversationManageMessageUtils.EmbedMessages.actionCancelledCloseChat], 
                ephemeral: true 
            });
        } catch (error) {
            await (this.currentInteraction as ButtonInteraction).reply({
                content: "הצ'אט הזה לא זמין עוד. לא ניתן לבצע פעולות על צ'אטים שנסגרו.",
                ephemeral: true
            });
        }
    }

    private async handleToolsManager(): Promise<void> {
        if (Utils.isSeniorStaff(this.currentInteraction.user.id)) {
            await (this.currentInteraction as ButtonInteraction).reply({
                ephemeral: true, 
                embeds: [ConversationManageMessageUtils.EmbedMessages.ManagerTools],
                components: [ConversationManageMessageUtils.Actions.managerTools]
            });
        } else {
            await (this.currentInteraction as ButtonInteraction).reply({ 
                content: "אין לך הרשאות להשתמש בהגדרות ניהול", 
                ephemeral: true 
            });
        }
    }

    private async handleToolsManagerReveal(): Promise<void> {
        const conversationManage = await ConversationManageHandler.createHandler(this.client, this.currentInteraction as ButtonInteraction);
        await conversationManage.revealUser();
    }

    private async handleToolsManagerChangeSupporter(): Promise<void> {
        const conversationManage = await ConversationManageHandler.createHandler(this.client, this.currentInteraction as ButtonInteraction);
        await conversationManage.changeHelpersMessage();
    }

    private async handleToolsManagerPunish(): Promise<void> {
        const conversationManage = await ConversationManageHandler.createHandler(this.client, this.currentInteraction as ButtonInteraction);
        await conversationManage.sendPunishMessage();
    }

    private async handleToolsResetHelpers(): Promise<void> {
        const conversationManage = await ConversationManageHandler.createHandler(this.client, this.currentInteraction as ButtonInteraction);
        await conversationManage.resetHelpers();
        await conversationManage.saveConversation();
    }

    private async handleToolsReferManager(): Promise<void> {
        const conversationManage = await ConversationManageHandler.createHandler(this.client, this.currentInteraction as ButtonInteraction);
        await conversationManage.openRefferSupervisorModal();
    }

    // User Actions
    private async handleUserReportHelper(): Promise<void> {
        await new OpenModalHandler(this.currentInteraction as ButtonInteraction).openModal();
    }

    private async handleUserVolunteer(): Promise<void> {
        await new OpenModalHandler(this.currentInteraction as ButtonInteraction).openModal();
    }

    private async handleUserSuggest(): Promise<void> {
        await new OpenModalHandler(this.currentInteraction as ButtonInteraction).openModal();
    }

    // Modal Submissions
    private async handleReportHelperModal(): Promise<void> {
        await new ModalSubmitHandler(this.client, this.currentInteraction as ModalSubmitInteraction).reportHelper();
    }

    private async handleReferManagerModal(): Promise<void> {
        await new ModalSubmitHandler(this.client, this.currentInteraction as ModalSubmitInteraction).referManager();
    }

    private async handleVolunteerModal(): Promise<void> {
        await new ModalSubmitHandler(this.client, this.currentInteraction as ModalSubmitInteraction).sendVolunteerMessage();
    }

    private async handleSuggestIdeaModal(): Promise<void> {
        await new ModalSubmitHandler(this.client, this.currentInteraction as ModalSubmitInteraction).suggestIdea();
    }

    private async handleVacationModal(): Promise<void> {
        await new ModalSubmitHandler(this.client, this.currentInteraction as ModalSubmitInteraction).sendVacationMessage();
    }

    private async handleCriticalChatModal(): Promise<void> {
        await new ModalSubmitHandler(this.client, this.currentInteraction as ModalSubmitInteraction).criticalChat();
    }


    // Select Menu Actions
    private async handleHelpersList(): Promise<void> {
        await new ChangeHelperHandler(this.currentInteraction as StringSelectMenuInteraction).handle();
    }

    private async handlePunishMenu(): Promise<void> {
        await new OpenModalHandler(this.currentInteraction as StringSelectMenuInteraction).openModal();
    }

    private async handlePunishHistory(): Promise<void> {
        await PunishMemberHandler.sendPunishmentHistory(this.currentInteraction as StringSelectMenuInteraction);
    }

    // Punishment Modals
    private async handlePunishKickModal(): Promise<void> {
        const handler = await PunishMemberHandler.createHandler(this.currentInteraction as ModalSubmitInteraction);
        await handler.kick();
    }

    private async handlePunishBanModal(): Promise<void> {
        const handler = await PunishMemberHandler.createHandler(this.currentInteraction as ModalSubmitInteraction);
        await handler.ban();
    }

    private async handlePunishMuteModal(): Promise<void> {
        const handler = await PunishMemberHandler.createHandler(this.currentInteraction as ModalSubmitInteraction);
        await handler.timeout();
    }

    // Inactive Conversation Actions
    private async handleUnactiveContinueChat(): Promise<void> {
        const handler = new UnactiveConversationHandler();
        await handler.continueConversation(this.currentInteraction as ButtonInteraction);
    }

    private async handleUnactiveCloseChat(): Promise<void> {
        const handler = new UnactiveConversationHandler();
        await handler.stopConversation(this.currentInteraction as ButtonInteraction);
    }

    // Commands
    private async handleOpenChatCommand(): Promise<void> {
        await new CommandHandler(this.client, this.currentInteraction as ChatInputCommandInteraction).openChat();
    }

    private async handleHelperOfTheMonthMale(): Promise<void> {
        await new CommandHandler(this.client, this.currentInteraction as UserContextMenuCommandInteraction).makeHelperOfTheMonth("helper");
    }

    private async handleHelperOfTheMonthFemale(): Promise<void> {
        await new CommandHandler(this.client, this.currentInteraction as UserContextMenuCommandInteraction).makeHelperOfTheMonth("helperit");
    }

    private async handleApproveVacation(): Promise<void> {
        await new CommandHandler(this.client, this.currentInteraction as MessageContextMenuCommandInteraction).approveVacation();
    }

    private async handleCriticalChat(): Promise<void> {
        await new CommandHandler(this.client, this.currentInteraction as UserContextMenuCommandInteraction).criticalChat();
    }

    private async handleManageCommand(): Promise<void> {
        await new CommandHandler(this.client, this.currentInteraction as ChatInputCommandInteraction).sendManageTools();
    }

    private async handleImportantLinksCommand(): Promise<void> {
        await new CommandHandler(this.client, this.currentInteraction as ChatInputCommandInteraction).importantLinks();
    }

    private async handleSendStaffMessageCommand(): Promise<void> {
        await new CommandHandler(this.client, this.currentInteraction as ChatInputCommandInteraction).sendStaffMessage();
    }

    private async handleChannelInfoCommand(): Promise<void> {
        await new CommandHandler(this.client, this.currentInteraction as ChatInputCommandInteraction).findChannel();
        console.log('CommandHandler.findChannel completed');
    }

    private async handleReopenCommand(): Promise<void> {
        await new CommandHandler(this.client, this.currentInteraction as ChatInputCommandInteraction).reopenChat();
    }

    private async handleVacationCommand(): Promise<void> {
        await (this.currentInteraction as ChatInputCommandInteraction).showModal(MessageUtils.Modals.vacationModal);
    }
}