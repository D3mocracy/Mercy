import { Utils } from "../utils/Utils";
import { ChannelType, Message, ActionRowBuilder, ButtonInteraction } from "discord.js"
import DataBase from "../utils/db";
import { MessageUtils } from "../utils/MessageUtils";
import { config } from "..";

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
        const convChannel = await (await Utils.getGuild().channels.create({
            name: `צ'אט מספר ${numberOfConversation}`,
            type: ChannelType.GuildText,
        })).setParent(config.ticketCatagoryId);

        try {
            await this.interaction.user.send({
                embeds: [MessageUtils.EmbedMessages.newChatUser(numberOfConversation, convChannel.id)],
                components: [new ActionRowBuilder().addComponents([
                    MessageUtils.Actions.tools_close, /*MessageUtils.Actions.user_report_helper*/]) as any]
            });
        } catch (error) {
            console.log(`Can't sent message to ${this.interaction.user.tag}`);

        }

        (await convChannel.send({
            content: `<@&${config.helperRole}>`,
            embeds: [MessageUtils.EmbedMessages.newChatStaff()],
            components: [MessageUtils.Actions.supporterTools]
        })).edit({ content: null });

        await DataBase.conversationsCollection.insertOne({
            userId: this.interaction.user.id,
            guildId: Utils.getGuild().id,
            channelId: convChannel.id,
            open: true
        })
    }

}

export default StartConversation;