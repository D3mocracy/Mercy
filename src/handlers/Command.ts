import { ChatInputCommandInteraction, UserContextMenuCommandInteraction, GuildMember, ActionRowBuilder, ButtonBuilder, TextChannel, ContextMenuCommandInteraction, EmbedBuilder } from "discord.js"
import { MessageUtils } from "../utils/MessageUtils";
import { Utils } from "../utils/Utils";
import ConfigHandler from "./Config";
import { ImportantLinksMessageUtils } from "../utils/MessageUtils/ImportantLinks";
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

    async makeHelperOfTheMonth() {
        const helper = (this.interaction as UserContextMenuCommandInteraction).targetMember as GuildMember;
        const helperOfTheMonth = ConfigHandler.config.helperOfTheMonthRole;
        const staffChannel = ConfigHandler.config.staffChannel;
        if (!helper || !helperOfTheMonth || !staffChannel || !staffChannel.isTextBased()) return;
        ConfigHandler.config.guild?.members.cache.filter(member => member.roles.cache.has(helperOfTheMonth.id)).forEach(async helper => await helper.roles.remove(helperOfTheMonth));
        helper.roles.add(helperOfTheMonth);
        staffChannel.send({ embeds: [MessageUtils.EmbedMessages.helperOfTheMonth(helper)] });
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

    async importantLinks() {
        await this.interaction.channel?.send({
            embeds: [ImportantLinksMessageUtils.EmbedMessages.mainMessage()],
            components: [new ActionRowBuilder<ButtonBuilder>().addComponents([
                ImportantLinksMessageUtils.Actions.user_report_helper,
                ImportantLinksMessageUtils.Actions.user_suggest
            ])]
        });
        await this.interaction.reply({ content: "Sent", ephemeral: true })
    }

}

export default CommandHandler;