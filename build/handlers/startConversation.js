"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../utils/Utils");
const db_1 = __importDefault(require("../utils/db"));
const Config_1 = __importDefault(require("./Config"));
const UserMU_1 = require("../utils/MessageUtils/UserMU");
class StartConversation {
    interaction;
    conversation = {};
    constructor(interaction) {
        this.interaction = interaction;
        this.interaction = interaction;
    }
    static async createHandler(interaction) {
        const handler = new StartConversation(interaction);
        await handler.load();
        return handler;
    }
    async load() {
        this.conversation = await Utils_1.Utils.getOpenConversation(this.interaction.user.id);
        return this.conversation;
    }
    async handle() {
        if (!this.conversation || !this.conversation.subject) {
            await this.sendSelectSubject();
        }
        else {
            await this.interaction.reply({
                content: "היי, נראה שכבר יש לך צ'אט פתוח",
                ephemeral: true,
            });
        }
    }
    async sendSelectSubject() {
        this.interaction.user.send({
            embeds: [UserMU_1.UserMessageUtils.CustomEmbedMessages.subjects],
            components: [UserMU_1.UserMessageUtils.Actions.selectSubject],
        })
            .then(async () => {
            await db_1.default.conversationsCollection.updateOne({
                userId: this.interaction.user.id,
                open: true,
            }, {
                $set: {
                    userId: this.interaction.user.id,
                    guildId: Config_1.default.config.guild?.id,
                    open: true,
                    date: new Date(),
                }
            }, { upsert: true });
        })
            .catch(() => {
            this.interaction.followUp({
                content: `לא ניתן לפתוח צ’אט - יש לאפשר שליחת הודעות פרטיות בדיסקורד.
          למידע נוסף ניתן לעיין ב: https://support.discord.com/hc/en-us/articles/360060145013`,
                ephemeral: true
            });
        });
    }
}
exports.default = StartConversation;
//# sourceMappingURL=StartConversation.js.map