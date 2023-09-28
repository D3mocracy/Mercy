import { Utils } from "../utils/Utils";
import {
  ChannelType,
  GuildMember,
  ActionRowBuilder,
  ButtonInteraction,
  ButtonBuilder,
  StringSelectMenuInteraction,
  SelectMenuType,
} from "discord.js";
import DataBase from "../utils/db";
import { MessageUtils } from "../utils/MessageUtils";
import ConfigHandler from "./Config";
import { ConversationManageMessageUtils } from "../utils/MessageUtils/ConversationManage";
import { UserMessageUtils } from "../utils/MessageUtils/UserMU";
import { Conversation } from "../utils/types";

class CreateConversationHandler {
  conversation: Conversation = {} as any;
  constructor(
    private interaction: StringSelectMenuInteraction
  ) {
    this.interaction = interaction;
  }

  static async createHandler(
    interaction: StringSelectMenuInteraction
  ) {
    const handler = new CreateConversationHandler(interaction);
    await handler.load();
    return handler;
  }

  private async load() {
    this.conversation = await Utils.getOpenConversation(this.interaction.user.id) as any;
    return this.conversation;
  }

  async handle() {
    if (Utils.getMemberByID(this.interaction.user.id)?.isCommunicationDisabled()) {
        await this.interaction.reply({
            content: "אתה מושהה מלפתוח צ'אטים חדשים",
            ephemeral: true,
        });
        return;
    }
    if (!this.conversation.subject) {
        await this.createConversation();
    } else {
        await this.interaction.reply({
          content: "היי, נראה שכבר יש לך צ'אט פתוח",
          components: [
            MessageUtils.Actions.linkButton(
              `https://discord.com/channels/${ConfigHandler.config.guild?.id}/${this.conversation.channelId}`,
              "העבר אותי לצ'אט"
            ),
          ],
          ephemeral: true,
        })
    }
  }

  async createConversation() {
    const numberOfConversation =
      (await Utils.getNumberOfConversationFromDB()) + 1;
    const convChannel = await ConfigHandler.config.guild?.channels.create({
      name: `צ'אט ${numberOfConversation}`,
      type: ChannelType.GuildText,
      parent: ConfigHandler.config.conversationCatagory,
    });
    const subject = (this.interaction as StringSelectMenuInteraction).values?.[0];
    if (!convChannel) return;
    await Promise.all([
      this.interaction.user.send({
        embeds: [MessageUtils.EmbedMessages.newChatUser(numberOfConversation)],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            ConversationManageMessageUtils.Actions.tools_close
          ),
        ],
      }),

      convChannel
        .send({
          content: `<@&${ConfigHandler.config.memberRole}>`,
          embeds: [ConversationManageMessageUtils.EmbedMessages.newChatStaff(`צ'אט ${numberOfConversation}`, `משתמש פתח צ'אט בנושא ${subject}, נא להעניק סיוע בהתאם!`)],
          components: [ConversationManageMessageUtils.Actions.supporterTools],
        })
        .then((message) => message.edit({ content: null })),

        DataBase.conversationsCollection.updateOne({userId: this.interaction.user.id, open: true}, {$set: {channelId: convChannel.id, subject: subject}}),
      
    ]);
    await this.interaction.message.edit({
      components: []
    })
  }
}

export default CreateConversationHandler;
