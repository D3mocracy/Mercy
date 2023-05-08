import { ChatInputCommandInteraction } from "discord.js"
import { MessageUtils } from "../utils/MessageUtils";

class CommandHandler {

    constructor(private interaction: ChatInputCommandInteraction) { }

    async openChat() {
        this.interaction.channel?.send({
            embeds: [MessageUtils.EmbedMessages.openChat],
            components: [MessageUtils.Actions.openChatButton]
        });
        await this.interaction.reply({ content: 'Sent!', ephemeral: true })
    }

}

export default CommandHandler;