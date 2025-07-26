import { StringSelectMenuInteraction, Client } from "discord.js";
import DataBase from "../utils/db";
import { MessageUtils } from "../utils/MessageUtils";
import { Conversation } from "../utils/types";
import { Utils } from "../utils/Utils";
import { ConversationManageMessageUtils } from "../utils/MessageUtils/ConversationManage";

class ChangeHelperHandler {
    private conversation: Conversation = {} as any;
    constructor(private interaction: StringSelectMenuInteraction) { }

    async loadConversation(): Promise<void> {
        this.conversation = await DataBase.conversationsCollection.findOne({ channelId: this.interaction.channelId, open: true }) as any;
    }

    async saveConversation() {
        const { _id, ...updateData } = this.conversation;
        await DataBase.conversationsCollection.updateOne({ channelId: this.interaction.channelId, open: true }, { $set: updateData }, { upsert: true })
    }

    async handle() {
        await this.loadConversation();
        if (this.interaction.customId === "helpers_list") {
            this.conversation.staffMemberId = (this.interaction.values || "") as any;
        }
        await this.saveConversation();
        const newPermission = await Utils.updatePermissionToChannel(this.conversation); //Can't import messageUtils from Utils
        if (!newPermission) return;
        await newPermission.channel.send({ embeds: [ConversationManageMessageUtils.EmbedMessages.staffMemberAttached(newPermission.usernames.join(', '))] });
        await this.interaction.deferUpdate();
    }
}

export default ChangeHelperHandler;