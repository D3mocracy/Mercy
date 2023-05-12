import { ChatInputCommandInteraction, UserContextMenuCommandInteraction, GuildMember, ActionRowBuilder, ButtonBuilder, TextChannel } from "discord.js"
import { MessageUtils } from "../utils/MessageUtils";
import { Utils } from "../utils/Utils";
import ConfigHandler from "./Config";
import { ImportantLinksMessageUtils } from "../utils/MessageUtils/ImportantLinks";

class CommandHandler {

    constructor(private interaction: ChatInputCommandInteraction | UserContextMenuCommandInteraction) { }

    async openChat() {
        this.interaction.channel?.send({
            embeds: [MessageUtils.EmbedMessages.openChat],
            components: [MessageUtils.Actions.openChatButton]
        });
        await this.interaction.reply({ content: 'Sent!', ephemeral: true })
    }

    async sendStaffMessage() {
        this.interaction.channel?.send({
            embeds: [await MessageUtils.EmbedMessages.staffMembers()]
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