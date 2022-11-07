import { Utils } from "../utils/Utils";
import { ChannelType, Message, ComponentType, ActionRowBuilder } from "discord.js"
import DataBase from "../utils/db";
import { MessageUtils } from "../utils/MessageUtils";
import { config } from "..";

class StartConversation {

    constructor(private message: Message) {
        this.message = message;
    }

    async askStartConversation() {
        const askConvMessage = await this.message.reply({ embeds: [MessageUtils.EmbedMessages.StartConversationAsk], components: [MessageUtils.Actions.YesNo] });
        const collector = askConvMessage.createMessageComponentCollector({ componentType: ComponentType.Button, time: 10 * 1000, max: 1 });

        collector.on('collect', async i => {
            const hasOpenConversation = await Utils.hasOpenConversation(this.message.author.id);
            if (hasOpenConversation) return;
            if (i.customId === "yes_conv") {
                await this.createConversation()
            } else if (i.customId === "no_conv") {
                await this.message.channel.send({ embeds: [MessageUtils.EmbedMessages.userChooseNo] });
            }

        });

        collector.on('end', async (collected) => {
            await askConvMessage.edit({ components: [] });
            if (!collected.size)
                await this.message.channel.send({ embeds: [MessageUtils.EmbedMessages.answerOpenConversationTimeEnd] });
        })
    }

    async createConversation() {
        const numberOfConversation = await Utils.getNumberOfConversationFromDB() + 1;
        const convChannel = await (await (await Utils.getGuild().channels.create({
            name: `צ'אט מספר ${numberOfConversation}`,
            type: ChannelType.GuildText,
        })).setParent(config.ticketCatagoryId));

        await this.message.channel.send({
            embeds: [MessageUtils.EmbedMessages.newChatUser(numberOfConversation)],
            components: [new ActionRowBuilder().addComponents([
                MessageUtils.Actions.tools_close, MessageUtils.Actions.user_report_helper]) as any]
        });

        (await convChannel.send({
            content: `<@&${config.helperRole}>`,
            embeds: [MessageUtils.EmbedMessages.newChatStaff(numberOfConversation)],
            components: [MessageUtils.Actions.supporterTools]
        })).edit({ content: null });

        await DataBase.conversationsCollection.insertOne({
            userId: this.message.author.id,
            guildId: Utils.getGuild().id,
            channelId: convChannel.id,
            open: true
        })
    }

}

export default StartConversation;