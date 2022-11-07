import { ButtonInteraction, EmbedBuilder, TextChannel } from "discord.js"
import { config } from "..";
import { MessageUtils } from "../utils/MessageUtils";
import { Utils } from "../utils/Utils";
import ConversationManageHandler from "./ConversationManage";

class ConversationStaffToolsHandler {
    constructor(private interaction: ButtonInteraction) {
        this.interaction = interaction;
    }

    async handle() {
        if (this.interaction.customId.startsWith("manager")) {
            if (this.interaction.customId === "manager_attach_report") {
                const newEmbed = new EmbedBuilder(this.interaction.message.embeds[0].data);
                newEmbed.setColor(0x33C76E);
                newEmbed.data.fields!.find(field => field.name === "מנהל מטפל")!.value = this.interaction.user.username;
                await this.interaction.message.edit({ embeds: [newEmbed] });
            }

        } else if (this.interaction.customId.startsWith("tools")) {
            const conversationManage = await ConversationManageHandler.createHandler(this.interaction.channelId);
            await conversationManage.loadConversation();

            switch (this.interaction.customId) {
                case "tools_attach":
                    await conversationManage.attachHelper(this.interaction.user.id) ?
                        await this.interaction.reply({ embeds: [MessageUtils.EmbedMessages.staffMemberAttached(this.interaction.user.toString())] }) :
                        await this.interaction.reply({ ephemeral: true, content: "פסססטט...הצ'אט הזה כבר שויך למישהו" })
                    break;

                case "tools_close":
                    await conversationManage.closeConversation(this.interaction.channel?.isDMBased() ? "משתמש" : "איש צוות", this.interaction);
                    break;

                case "tools_manager":
                    Utils.isManager(this.interaction.user.id) ?
                        await this.interaction.reply({ ephemeral: true, embeds: [MessageUtils.EmbedMessages.ManagerTools], components: [MessageUtils.Actions.managerTools] }) :
                        await this.interaction.reply({ content: "ברכות על הקידום", ephemeral: true });
                    break;

                case "tools_manager_reveal":
                    if (!(await Utils.getGuild().members.fetch(this.interaction.user.id)).permissions.has("Administrator")) {
                        await this.interaction.reply({ content: "אין לך מספיק הרשאות כדי לבצע פעולה זו", ephemeral: true });
                        return;
                    }
                    await this.interaction.reply({
                        ephemeral: true,
                        embeds: [await MessageUtils.EmbedMessages.revealUserMessage(conversationManage.conversation.userId)]
                    })
                    break;

                case "tools_manager_change_supporter":
                    await this.interaction.reply({
                        ephemeral: true,
                        embeds: [MessageUtils.EmbedMessages.changeHelper],
                        components: [MessageUtils.Actions.changeHelper((await Utils.getUsersWithRoleId('1036014794806939648')).map(m => m)),
                        MessageUtils.Actions.resetHelpers]
                    });
                    break;

                case "tools_reset_helpers":
                    conversationManage.conversation.staffMemberId = [];
                    await Utils.updatePermissionToChannel(conversationManage.conversation);
                    await (this.interaction.channel as TextChannel).send({ embeds: [MessageUtils.EmbedMessages.helpersReseted] })
                    break;

                case "tools_report":
                    await this.interaction.showModal(MessageUtils.Modals.reportChatModal);
                    break;

                default:
                    break;
            }


            await conversationManage.saveConversation();
        }
        if (!(this.interaction.deferred || this.interaction.replied)) await this.interaction.deferUpdate();
    }
}
export default ConversationStaffToolsHandler;