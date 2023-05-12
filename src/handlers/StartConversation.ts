import { Utils } from "../utils/Utils";
import { ChannelType, GuildMember, ActionRowBuilder, ButtonInteraction, ButtonBuilder } from "discord.js"
import DataBase from "../utils/db";
import { MessageUtils } from "../utils/MessageUtils";
import ConfigHandler from "./Config";
import { ConversationManageMessageUtils } from "../utils/MessageUtils/ConversationManage";

class StartConversation {

    constructor(private interaction: ButtonInteraction) {
        this.interaction = interaction;
    }

    async precondition() {
        const openConversation: any = await Utils.getOpenConversation(this.interaction.user.id);
        openConversation
            ? await this.interaction.reply({
                content: "היי, נראה שכבר יש לך צ'אט פתוח",
                components: [MessageUtils.Actions.linkButton(`https://discord.com/channels/${ConfigHandler.config.guild?.id}/${openConversation.channelId}`, "העבר אותי לצ'אט")],
                ephemeral: true
            })
            : this.createConversation();
    }

    private async createConversation() {
        const numberOfConversation = await Utils.getNumberOfConversationFromDB() + 1;
        const convChannel = await ConfigHandler.config.guild?.channels.create({
            name: `צ'אט מספר ${numberOfConversation}`,
            type: ChannelType.GuildText,
            parent: ConfigHandler.config.conversationCatagory
        });
        if (!convChannel) return;
        await Promise.all([
            this.interaction.user.send({
                embeds: [MessageUtils.EmbedMessages.newChatUser(numberOfConversation)],
                components: [new ActionRowBuilder<ButtonBuilder>().addComponents(ConversationManageMessageUtils.Actions.tools_close)]
            }),

            convChannel.send({
                content: `<@&${ConfigHandler.config.helperRole}>`,
                embeds: [ConversationManageMessageUtils.EmbedMessages.newChatStaff()],
                components: [ConversationManageMessageUtils.Actions.supporterTools]
            }).then(message => message.edit({ content: null })),

            DataBase.conversationsCollection.insertOne({
                userId: this.interaction.user.id,
                guildId: ConfigHandler.config.guild?.id,
                channelId: convChannel.id,
                open: true,
                date: new Date()
            }),
        ]);
    }

}

export default StartConversation;