import { ChatInputCommandInteraction, UserContextMenuCommandInteraction, GuildMember } from "discord.js"
import { MessageUtils } from "../utils/MessageUtils";
import DataBase from "../utils/db";
import { Utils } from "../utils/Utils";
import { config } from "..";

class CommandHandler {

    constructor(private interaction: ChatInputCommandInteraction | UserContextMenuCommandInteraction) { }

    async openChat() {
        this.interaction.channel?.send({
            embeds: [MessageUtils.EmbedMessages.openChat],
            components: [MessageUtils.Actions.openChatButton]
        });
        await this.interaction.reply({ content: 'Sent!', ephemeral: true })
    }

    async makeHelperOfTheMonth() {
        const helper = (this.interaction as UserContextMenuCommandInteraction).targetMember as GuildMember;
        const helperOfTheMonth = await Utils.getRoleById(config.helperOfTheMonthRoleId);
        const staffChannel = await Utils.getChannelById(config.staffChannelId);
        if (!helper || !helperOfTheMonth || !staffChannel || !staffChannel.isTextBased()) return;
        Utils.getGuild().members.cache.filter(member => member.roles.cache.has(helperOfTheMonth.id)).forEach(async helper => await helper.roles.remove(helperOfTheMonth));
        helper.roles.add(helperOfTheMonth);
        staffChannel.send({ embeds: [MessageUtils.EmbedMessages.helperOfTheMonth(helper)] });
        await this.interaction.reply({ content: "הפעולה בוצעה בהצלחה! התומך קיבל את הדרגה ונשלחה הכרזה", ephemeral: true });
    }

}

export default CommandHandler;