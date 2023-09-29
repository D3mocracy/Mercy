import { ChatInputCommandInteraction, UserContextMenuCommandInteraction, GuildMember, ActionRowBuilder, ButtonBuilder, ContextMenuCommandInteraction, EmbedBuilder, TextChannel } from "discord.js"
import { MessageUtils } from "../utils/MessageUtils";
import ConfigHandler from "./Config";
import { ImportantLinksMessageUtils } from "../utils/MessageUtils/ImportantLinks";
import { Utils } from "../utils/Utils";
import DataBase from "../utils/db";
import { ConversationManageMessageUtils } from "../utils/MessageUtils/ConversationManage";

class CommandHandler {

    constructor(private interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction) { }

    async openChat() {
        this.interaction.channel?.send({
            embeds: [MessageUtils.EmbedMessages.openChat],
            components: [MessageUtils.Actions.openChatButton]
        });
        await this.interaction.reply({ content: 'Sent!', ephemeral: true })
    }

    async sendStaffMessage() {
        this.interaction.channel?.send({
            embeds: [MessageUtils.EmbedMessages.staffMembers()]
        })
        await this.interaction.reply({ content: 'Sent!', ephemeral: true });
    }

    async makeHelperOfTheMonth(gender: "helper" | "helperit") {
        const helper = (this.interaction as UserContextMenuCommandInteraction).targetMember as GuildMember;
        const helpersOfTheMonth = gender === "helper" ? ConfigHandler.config.helperOfTheMonthRole : ConfigHandler.config.helperitOfTheMonthRole;
        const staffChannel = ConfigHandler.config.staffChannel;
        if (!helper || !helpersOfTheMonth || !staffChannel || !staffChannel.isTextBased()) return;
        ConfigHandler.config.guild?.members.cache.filter(member => (member.roles.cache.has(ConfigHandler.config.helperOfTheMonthRole!.id) || member.roles.cache.has(ConfigHandler.config.helperitOfTheMonthRole!.id))).forEach(async helper => await helper.roles.remove(helpersOfTheMonth));
        helper.roles.add(helpersOfTheMonth);
        (await staffChannel.send({ content: `${ConfigHandler.config.memberRole}`, embeds: [MessageUtils.EmbedMessages.helperOfTheMonth(helper)] })).edit({ content: "" });
        await this.interaction.reply({ content: "הפעולה בוצעה בהצלחה! התומך קיבל את הדרגה ונשלחה הכרזה", ephemeral: true });
    }

    async approveVacation() {
        if (!this.interaction.isMessageContextMenuCommand()) return;
        if (this.interaction.channelId === ConfigHandler.config.vacationChannel?.id) {
            const newEmbed = new EmbedBuilder(this.interaction.targetMessage.embeds[0].data);
            newEmbed.setColor(0x33C76E);
            this.interaction.targetMessage.edit({
                content: "",
                embeds: [newEmbed],
                components: [MessageUtils.Actions.disabledGreenButton("סטטוס: טופל")]
            });
            await this.interaction.reply({ content: "הבקשה אושרה", ephemeral: true });
        } else {
            await this.interaction.reply({ content: "ניתן להשתמש בפקודה זו רק בצ'אנל היעדרות והפחתה", ephemeral: true });
        }
    }

    async sendManageTools() {
        const [numberOfConversation, conversation] = await Promise.all([
            Utils.getNumberOfConversationFromDB(),
            DataBase.conversationsCollection.findOne({
                userId: this.interaction.user.id,
                open: true,
            }),
        ]);

        if (Utils.isTicketChannel(this.interaction.channel as TextChannel)) {
            await this.interaction.reply({
                embeds: [
                    ConversationManageMessageUtils.EmbedMessages.newChatStaff(
                        `צ'אט ${numberOfConversation + 1}`,
                        `משתמש פתח צ'אט בנושא ${conversation?.subject}, נא לתת סיוע בהתאם!`
                    ),
                ],
                components: [ConversationManageMessageUtils.Actions.supporterTools],
            });
        } else if (this.interaction.channel?.isDMBased() && !!conversation?.subject) {
            await this.interaction.reply({
                embeds: [MessageUtils.EmbedMessages.newChatUser(numberOfConversation)],
                components: [
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                        ConversationManageMessageUtils.Actions.tools_close
                    ),
                ],
            })

        } else {
            await this.interaction.reply({
                content: "שגיאה בביצוע הפקודה: שימוש שגוי בפקודה",
                ephemeral: true,
            });
        }
    }

    async importantLinks() {
        const messages = [
            {
                embeds: [ImportantLinksMessageUtils.EmbedMessages.volunteerMessage],
                components: [new ActionRowBuilder<ButtonBuilder>().addComponents([
                    ImportantLinksMessageUtils.Actions.user_volunteer,
                ])]
            },
            {
                embeds: [ImportantLinksMessageUtils.EmbedMessages.reportMessage],
                components: [new ActionRowBuilder<ButtonBuilder>().addComponents([
                    ImportantLinksMessageUtils.Actions.user_report_helper,
                ])]
            },
            {
                embeds: [ImportantLinksMessageUtils.EmbedMessages.suggestIdeasMessage],
                components: [new ActionRowBuilder<ButtonBuilder>().addComponents([
                    ImportantLinksMessageUtils.Actions.user_suggest,
                ])]
            }
        ]
        messages.forEach(message => this.interaction.channel?.send(message));
        await this.interaction.reply({ content: "Sent", ephemeral: true })
    }

}

export default CommandHandler;