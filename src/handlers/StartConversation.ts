import { Utils } from "../utils/Utils";
import { ChannelType, CategoryChannel, ActionRowBuilder, ButtonInteraction, ButtonBuilder } from "discord.js"
import DataBase from "../utils/db";
import { MessageUtils } from "../utils/MessageUtils";
import ConfigHandler from "./Config";

class StartConversation {

    constructor(private interaction: ButtonInteraction) {
        this.interaction = interaction;
    }

    async precondition() {
        await Utils.hasOpenConversation(this.interaction.user.id)
            ? await this.interaction.reply({ content: "היי, נראה שכבר יש לך צ'אט פתוח", ephemeral: true })
            : await this.createConversation();
    }

    private async createConversation() {
        const numberOfConversation = await Utils.getNumberOfConversationFromDB() + 1;
        const convChannel = await Utils.getGuild().channels.create({
            name: `צ'אט מספר ${numberOfConversation}`,
            type: ChannelType.GuildText,
            parent: ConfigHandler.config.ticketCatagory
        });

        await Promise.all([
            this.interaction.user.send({
                embeds: [MessageUtils.EmbedMessages.newChatUser(numberOfConversation)],
                components: [new ActionRowBuilder<ButtonBuilder>().addComponents(MessageUtils.Actions.tools_close)]
            }),

            convChannel.send({
                content: `<@&${ConfigHandler.config.helperRole}>`,
                embeds: [MessageUtils.EmbedMessages.newChatStaff()],
                components: [MessageUtils.Actions.supporterTools]
            }).then(message => message.edit({ content: null })),

            DataBase.conversationsCollection.insertOne({
                userId: this.interaction.user.id,
                guildId: Utils.getGuild().id,
                channelId: convChannel.id,
                open: true
            }),

            convChannel.lockPermissions()
        ]);

        await this.interaction.deferUpdate();
    }

}

export default StartConversation;