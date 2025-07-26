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

class StartConversation {
  conversation: Conversation = {} as any;
  constructor(
    private interaction: ButtonInteraction
  ) {
    this.interaction = interaction;
  }

  static async createHandler(
    interaction: ButtonInteraction
  ) {
    const handler = new StartConversation(interaction);
    await handler.load();
    return handler;
  }

  private async load() {
    this.conversation = await Utils.getOpenConversation(this.interaction.user.id) as any;
    return this.conversation;
  }

  async handle() {
    if (!this.conversation || !this.conversation.subject) {
      await this.interaction.deferReply({ ephemeral: true });
      await this.sendSelectSubject();
    } else {
      await this.interaction.reply({
        content: "היי, נראה שכבר יש לך צ'אט פתוח",
        ephemeral: true,
      })
    }
  }

  private async sendSelectSubject() {
    try {
      await this.interaction.user.send({
        embeds: [UserMessageUtils.CustomEmbedMessages.subjects],
        components: [UserMessageUtils.Actions.selectSubject],
      });
      
      await DataBase.conversationsCollection.updateOne(
        {
          userId: this.interaction.user.id,
          open: true,
        },
        {
          $set: {
            userId: this.interaction.user.id,
            guildId: ConfigHandler.config.guild?.id,
            open: true,
            date: new Date(),
          }
        },
        { upsert: true }
      );
      
      await this.interaction.editReply({
        content: "נשלחה אליך הודעה פרטית לבחירת נושא הצ'אט!"
      });
    } catch (error) {
      await this.interaction.editReply({
        content: `לא ניתן לפתוח צ'אט - יש לאפשר שליחת הודעות פרטיות בדיסקורד.
        למידע נוסף ניתן לעיין ב: https://support.discord.com/hc/en-us/articles/360060145013`
      });
    }
  }
}

export default StartConversation;
