import {
  ButtonInteraction,
  Client,
  TextChannel,
} from "discord.js";
import { ObjectId } from "mongodb";
import DataBase from "../utils/db";
import { MessageUtils } from "../utils/MessageUtils";
import { Conversation } from "../utils/types";
import { Utils } from "../utils/Utils";
import Logger from "./Logger";
import { CantLoadConversationFromDB } from "../utils/Errors";
import ConfigHandler from "./Config";
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

  static async createHandlerWithId(client: Client, interaction: ButtonInteraction, conversationId: string) {
    const handler = new ConversationManageHandler(client, interaction);
    await handler.loadConversationById(conversationId);
    return handler;
  }

  async loadConversation(): Promise<void> {
    if (this.interaction.channel?.isDMBased()) {
      // In DMs, first try to find the open conversation
      this.conversation = (await DataBase.conversationsCollection.findOne({
        userId: this.interaction.user.id,
        open: true,
      })) as any;
      
      // If no open conversation found, this means they're clicking on an old message
      if (!this.conversation) {
        throw new CantLoadConversationFromDB();
      }
    } else {
      // In guild channels, load by channel ID (can be closed or open)
      this.conversation = (await DataBase.conversationsCollection.findOne({
        channelId: this.interaction.channelId,
      })) as any;
    }
    
    if (this.conversation) {
      this.channel = Utils.getChannelById(
        this.client,
        this.conversation.channelId
      ) as TextChannel;
    } else {
      throw new CantLoadConversationFromDB();
    }
  }

  async loadConversationById(conversationId: string): Promise<void> {
    try {
      this.conversation = (await DataBase.conversationsCollection.findOne({
        _id: new ObjectId(conversationId)
      })) as any;
      
      if (this.conversation) {
        this.channel = Utils.getChannelById(
          this.client,
          this.conversation.channelId
        ) as TextChannel;
      } else {
        throw new CantLoadConversationFromDB();
      }
    } catch (error) {
      throw new CantLoadConversationFromDB();
    }
  }

  async saveConversation() {
    const { _id, ...updateData } = this.conversation;
    await DataBase.conversationsCollection.updateOne(
      { channelId: this.conversation.channelId },
      { $set: updateData },
      { upsert: true }
    );
  }

  async sendSureMessageToClose() {
    await this.interaction.reply({
      embeds: [MessageUtils.EmbedMessages.sureMessageToClose],
      components: [
        ConversationManageMessageUtils.Actions.tools_sure_close_yes_no(),
      ],
      ephemeral: true
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
    // Check if conversation is already closed
    if (!this.conversation.open) {
      await this.interaction.reply({
        content: "הצ'אט הזה כבר נסגר. לא ניתן לסגור צ'אט שכבר סגור.",
        ephemeral: true
      });
      return;
    }
    
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
          this.channel?.name
        ),
      ],
    };
    this.conversation.open = false;
    await this.channel.send(closedMessage);
    const user = this.client.users.cache.get(this.conversation.userId);
    Promise.all([
      Logger.logTicket(this.channel, user),
      user?.send(closedMessage) || "",
    ])
      .catch((error) => {
        console.log("Can not send message to this user - This Error is fine");
        Logger.logError(error);

      })
      .finally(() => this.channel.delete());
  };

  async attachHelper(staffMemberId: string): Promise<void> {
    if ((Utils.getHelperClaimedConversationNumber(staffMemberId) >= 2) && Utils.isHelper(staffMemberId)) {
      await this.interaction.reply({
        ephemeral: true,
        content: "ניתן לשייך עד 2 צ'אטים",
      });
      return;
    }
    if (
      !this.conversation.staffMemberId
      || this.conversation.staffMemberId.length === 0
      || Utils.isSeniorStaff(this.interaction.user.id)
    ) {
      this.conversation.staffMemberId = [staffMemberId];
      await Promise.all([
        Utils.updatePermissionToChannel(this.conversation),
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
    await Utils.updatePermissionToChannel(this.conversation);
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

  async sendPunishMessage() {
    await this.interaction.reply({
      embeds: [ConversationManageMessageUtils.EmbedMessages.punishMessage],
      components: [ConversationManageMessageUtils.Actions.punishMenu()],
      ephemeral: true
    });

  }


}

export default ConversationManageHandler;
