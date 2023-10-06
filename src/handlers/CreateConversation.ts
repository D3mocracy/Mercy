import { Utils } from "../utils/Utils";
import {
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  StringSelectMenuInteraction,
} from "discord.js";
import DataBase from "../utils/db";
import { MessageUtils } from "../utils/MessageUtils";
import ConfigHandler from "./Config";
import { ConversationManageMessageUtils } from "../utils/MessageUtils/ConversationManage";
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
      this.createConversation()
        .catch(async () => {
          this.interaction.message.edit({
            content: `לא ניתן לפתוח צ’אט - יש לאפשר שליחת הודעות פרטיות בדיסקורד.
          למידע נוסף ניתן לעיין ב: https://support.discord.com/hc/en-us/articles/360060145013`,
            embeds: [],
            components: []
          })
        });
    } else {
      await this.interaction.reply({
        content: "היי, נראה שכבר יש לך צ'אט פתוח",
        // components: [
        //   MessageUtils.Actions.linkButton(
        //     `https://discord.com/channels/${ConfigHandler.config.guild?.id}/${this.conversation.channelId}`,
        //     "העבר אותי לצ'אט"
        //   ),
        // ],
        ephemeral: true,
      })
    }
  }

  async createConversation() {
    const numberOfConversation = (await Utils.getNumberOfConversationFromDB()) + 1;

    await this.interaction.user.send({
      embeds: [MessageUtils.EmbedMessages.newChatUser(numberOfConversation)],
      components: [new ActionRowBuilder<ButtonBuilder>().addComponents(ConversationManageMessageUtils.Actions.tools_close)]
    });

    const convChannel = await ConfigHandler.config.guild?.channels.create({
      name: `צ'אט ${numberOfConversation}`,
      type: ChannelType.GuildText,
      parent: ConfigHandler.config.conversationCatagory,
    });

    const subject = (this.interaction as StringSelectMenuInteraction).values?.[0];

    if (!convChannel) return;

    await Promise.all([
      convChannel.send({
        content: `<@&${ConfigHandler.config.memberRole}>`,
        embeds: [ConversationManageMessageUtils.EmbedMessages.newChatStaff(`צ'אט ${numberOfConversation}`, `משתמש פתח צ'אט בנושא ${subject}, נא להעניק סיוע בהתאם!`)],
        components: [ConversationManageMessageUtils.Actions.supporterTools],
      }).then((message) => message.edit({ content: null })),

      DataBase.conversationsCollection.updateOne({ userId: this.interaction.user.id, open: true }, { $set: { channelId: convChannel.id, subject: subject } }),

    ]);

    await this.interaction.message.edit({ components: [] })
  }
}

export default CreateConversationHandler;
