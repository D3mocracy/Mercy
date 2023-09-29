import {
  ButtonInteraction,
  Client,
  TextChannel,
  ChatInputCommandInteraction,
} from "discord.js";
import DataBase from "../utils/db";
import { MessageUtils } from "../utils/MessageUtils";
import { Conversation } from "../utils/types";
import { Utils } from "../utils/Utils";
import Logger from "./Logger";
import { CantLoadConversationFromDB } from "../utils/Errors";
import ConfigHandler from "./Config";
import { ImportantLinksMessageUtils } from "../utils/MessageUtils/ImportantLinks";
import { ConversationManageMessageUtils } from "../utils/MessageUtils/ConversationManage";

class ConversationManageHandler {
  channel: TextChannel = {} as any;
  conversation: Conversation = {} as any;

  private constructor(
    private client: Client,
    private interaction: ButtonInteraction
  ) { }

  static async createHandler(client: Client, interaction: ButtonInteraction) {
    const handler = new ConversationManageHandler(client, interaction);
    await handler.loadConversation();
    return handler;
  }

  async loadConversation(): Promise<void> {
    this.interaction.channel?.isDMBased()
      ? (this.conversation = (await DataBase.conversationsCollection.findOne({
        userId: this.interaction.user.id,
        open: true,
      })) as any)
      : (this.conversation = (await DataBase.conversationsCollection.findOne({
        channelId: this.interaction.channelId,
        open: true,
      })) as any);
    if (this.conversation) {
      this.channel = Utils.getChannelById(
        this.client,
        this.conversation.channelId
      ) as TextChannel;
    } else {
      throw new CantLoadConversationFromDB();
    }
  }

  async saveConversation() {
    await DataBase.conversationsCollection.updateOne(
      { channelId: this.conversation.channelId },
      { $set: this.conversation },
      { upsert: true }
    );
  }

  async sendSureMessageToClose() {
    await this.interaction.reply({
      embeds: [MessageUtils.EmbedMessages.sureMessageToClose],
      components: [
        ConversationManageMessageUtils.Actions.tools_sure_close_yes_no(),
      ],
    });
  }

  async openRefferSupervisorModal() {
    if ((!this.conversation.staffMemberId?.includes(this.interaction.user.id)
      && Utils.isHelper(this.interaction.user.id)
      && !Utils.isAdministrator(this.interaction.user.id)) || Utils.isSupervisor(this.interaction.user.id)) {
      await this.interaction.reply({
        content: "אין לך הרשאות להפנות למפקחים",
        ephemeral: true,
      });
      return;
    } else {
      await this.interaction.showModal(MessageUtils.Modals.referManagerModal)
    }
  }

  async closeConversation(closedBy: string) {
    if (!this.conversation.staffMemberId?.includes(this.interaction.user.id)
      && Utils.isHelper(this.interaction.user.id)
      && !this.interaction.channel?.isDMBased()
      && !Utils.isAdministrator(this.interaction.user.id)) {
      await this.interaction.reply({
        content: "אין לך הרשאות לסגור את הצ'אט",
        ephemeral: true,
      });
      return;
    }
    const closedMessage = {
      embeds: [
        ConversationManageMessageUtils.EmbedMessages.chatClosed(
          closedBy,
          this.channel.name
        ),
      ],
    };
    this.conversation.open = false;
    await this.channel.send(closedMessage);
    const user = this.client.users.cache.get(this.conversation.userId);
    Promise.all([
      Logger.logTicket(this.channel, user),
      this.interaction.message.edit({ components: [] }),
      user?.send(closedMessage) || "",
    ]).finally(() => this.channel.delete());
  }

  async attachHelper(staffMemberId: string): Promise<void> {
    if (Utils.getHelperClaimedConversationNumber(staffMemberId) >= 2) {
      await this.interaction.reply({
        ephemeral: true,
        content: "ניתן לשייך עד 2 צ'אטים",
      });
      return;
    }
    if (
      !this.conversation.staffMemberId ||
      this.conversation.staffMemberId.length === 0
    ) {
      this.conversation.staffMemberId = [staffMemberId];
      await Promise.all([
        Utils.updatePermissionToChannel(this.client, this.conversation),
        this.interaction.reply({
          embeds: [
            ConversationManageMessageUtils.EmbedMessages.staffMemberAttached(
              this.interaction.user.toString()
            ),
          ],
        }),
      ]);
      return;
    }
    await this.interaction.reply({
      ephemeral: true,
      content: "לא ניתן לבצע שיוך עצמי - הצ'אט כבר משויך לחבר צוות",
    });
  }

  async revealUser() {
    if (
      !ConfigHandler.config.guild?.members.cache
        .get(this.interaction.user.id)
        ?.permissions.has("Administrator")
    ) {
      await this.interaction.reply({
        content: "אין לך מספיק הרשאות כדי לבצע פעולה זו",
        ephemeral: true,
      });
      return;
    }
    await this.interaction.reply({
      ephemeral: true,
      embeds: [
        await ConversationManageMessageUtils.EmbedMessages.revealUserMessage(
          this.conversation.userId
        ),
      ],
    });
  }

  async resetHelpers() {
    this.conversation.staffMemberId = [];
    await Utils.updatePermissionToChannel(this.client, this.conversation);
    await (this.interaction.channel as TextChannel).send({
      embeds: [ConversationManageMessageUtils.EmbedMessages.helpersReseted],
    });
  }

  async changeHelpersMessage() {
    const helpersList = ConfigHandler.config.helperRole?.members.map((m) => m);

    if (helpersList?.length) {
      await this.interaction.reply({
        ephemeral: true,
        embeds: [ConversationManageMessageUtils.EmbedMessages.changeHelper],
        components: [
          ConversationManageMessageUtils.Actions.changeHelper(helpersList),
          ConversationManageMessageUtils.Actions.resetHelpers,
        ],
      });
    } else {
      await this.interaction.reply({
        content: "לא קיים משתמש עם דרגת תומך בשרת",
        ephemeral: true,
      });
    }
  }


}

export default ConversationManageHandler;
