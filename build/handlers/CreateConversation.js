"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../utils/Utils");
const discord_js_1 = require("discord.js");
const db_1 = __importDefault(require("../utils/db"));
const MessageUtils_1 = require("../utils/MessageUtils");
const Config_1 = __importDefault(require("./Config"));
const ConversationManage_1 = require("../utils/MessageUtils/ConversationManage");
class CreateConversationHandler {
    interaction;
    conversation = {};
    constructor(interaction) {
        this.interaction = interaction;
        this.interaction = interaction;
    }
    static async createHandler(interaction) {
        const handler = new CreateConversationHandler(interaction);
        await handler.load();
        return handler;
    }
    async load() {
        this.conversation = await Utils_1.Utils.getOpenConversation(this.interaction.user.id);
        return this.conversation;
    }
    async handle() {
        if (Utils_1.Utils.getMemberByID(this.interaction.user.id)?.isCommunicationDisabled()) {
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
                });
            });
        }
        else {
            await this.interaction.reply({
                content: "היי, נראה שכבר יש לך צ'אט פתוח",
                // components: [
                //   MessageUtils.Actions.linkButton(
                //     `https://discord.com/channels/${ConfigHandler.config.guild?.id}/${this.conversation.channelId}`,
                //     "העבר אותי לצ'אט"
                //   ),
                // ],
                ephemeral: true,
            });
        }
    }
    async createConversation() {
        const numberOfConversation = (await Utils_1.Utils.getNumberOfConversationFromDB()) + 1;
        await this.interaction.user.send({
            embeds: [MessageUtils_1.MessageUtils.EmbedMessages.newChatUser(numberOfConversation)],
            components: [new discord_js_1.ActionRowBuilder().addComponents(ConversationManage_1.ConversationManageMessageUtils.Actions.tools_close)]
        });
        const convChannel = await Config_1.default.config.guild?.channels.create({
            name: `צ'אט ${numberOfConversation}`,
            type: discord_js_1.ChannelType.GuildText,
            parent: Config_1.default.config.conversationCatagory,
        });
        const subject = this.interaction.values?.[0];
        if (!convChannel)
            return;
        await Promise.all([
            convChannel.send({
                content: `<@&${Config_1.default.config.memberRole}>`,
                embeds: [ConversationManage_1.ConversationManageMessageUtils.EmbedMessages.newChatStaff(`צ'אט ${numberOfConversation}`, `משתמש פתח צ'אט בנושא ${subject}, נא להעניק סיוע בהתאם!`)],
                components: [ConversationManage_1.ConversationManageMessageUtils.Actions.supporterTools],
            }).then((message) => message.edit({ content: null })),
            db_1.default.conversationsCollection.updateOne({ userId: this.interaction.user.id, open: true }, { $set: { channelId: convChannel.id, subject: subject, channelNumber: numberOfConversation } }),
        ]);
        await this.interaction.message.edit({ components: [] });
    }
}
exports.default = CreateConversationHandler;
//# sourceMappingURL=CreateConversation.js.map