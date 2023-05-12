"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportantLinksMessageUtils = void 0;
const discord_js_1 = require("discord.js");
const Config_1 = __importDefault(require("../../handlers/Config"));
var ImportantLinksMessageUtils;
(function (ImportantLinksMessageUtils) {
    let EmbedMessages;
    (function (EmbedMessages) {
        const author = { iconURL: 'https://i.imgur.com/ATfQQi7.png', name: 'Mercy - אנונימי' };
        const colors = {
            blue: 0x86b5dd,
            pink: 0xfe929f,
            gold: 0xfcc22d,
            red: 0xff0000,
            green: 0x33C76E
        };
        function mainMessage() {
            return new discord_js_1.EmbedBuilder({
                author,
                color: colors.pink,
                thumbnail: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Circle-icons-clipboard.svg/1200px-Circle-icons-clipboard.svg.png" },
                title: "מידע שימושי",
                description: `**לשרותכם מידע ולינקים חשובים בשרת**
                    ${Config_1.default.config.importantChannels?.map(channel => (`<#${Object.keys(channel).toString()}> - ${Object.values(channel)}`)).join('\n')}`,
                footer: { iconURL: author.iconURL, text: "בברכה, הנהלת הקהילה" }
            });
        }
        EmbedMessages.mainMessage = mainMessage;
        function suggestIdea(expain, comments, member) {
            return new discord_js_1.EmbedBuilder({
                author: { iconURL: author.iconURL, name: "Mercy - כללי" },
                title: "התקבלה הצעת ייעול / דיווח על באג",
                description: `**תיאור ההצעה**
                ${expain}

                **הערות נוספות**
                ${comments}`,
                fields: [
                    {
                        name: "משתמש מציע:",
                        value: `${member}`
                    }
                ],
                timestamp: new Date(),
                color: colors.green
            });
        }
        EmbedMessages.suggestIdea = suggestIdea;
        async function reportHelperMessage(interaction, helpers) {
            return new discord_js_1.EmbedBuilder({
                author: { iconURL: author.iconURL, name: "Mercy - דיווחים" },
                color: colors.blue,
                title: `התקבל דיווח על תומך`,
                description: `**סיבת הדיווח:**
                ${interaction.fields.getTextInputValue('reportHelperCause')}
                `,
                thumbnail: { url: "https://cdn3.iconfinder.com/data/icons/action-states-vol-1-flat/48/Action___States_Vol._1-28-512.png" }
            }).addFields([
                { name: "שם התומך על פי המשתמש", value: `${interaction.fields.getTextInputValue("helperName")}`, inline: true },
                { name: "תומך אחרון שזוהה לפי המערכת", value: `${helpers}`, inline: true },
                { name: "מנהל מטפל", value: `!לא שויך מנהל!` },
            ]);
        }
        EmbedMessages.reportHelperMessage = reportHelperMessage;
        ;
    })(EmbedMessages = ImportantLinksMessageUtils.EmbedMessages || (ImportantLinksMessageUtils.EmbedMessages = {}));
    let Actions;
    (function (Actions) {
        Actions.user_report_helper = new discord_js_1.ButtonBuilder({
            customId: "user_report_helper",
            label: "דווח על תומך",
            emoji: '🏴',
            style: discord_js_1.ButtonStyle.Danger
        });
        Actions.user_suggest = new discord_js_1.ButtonBuilder({
            customId: "user_suggest",
            label: "יש לי הצעת שיפור",
            emoji: "✅",
            style: discord_js_1.ButtonStyle.Success
        });
    })(Actions = ImportantLinksMessageUtils.Actions || (ImportantLinksMessageUtils.Actions = {}));
    let Modals;
    (function (Modals) {
        //Suggest idea modal
        const explaination = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder({
            customId: 'suggest_explain',
            label: 'פירוט',
            style: discord_js_1.TextInputStyle.Paragraph,
            required: true,
            placeholder: "פרט על הרעיון שלך ככל האפשר"
        }));
        const comments = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder({
            customId: 'suggest_comments',
            label: 'הערות נוספות',
            style: discord_js_1.TextInputStyle.Short,
            required: false,
            placeholder: `הערות נוספות שתרצה לכתוב (לא חובה)`
        }));
        Modals.suggestIdeaModal = new discord_js_1.ModalBuilder({
            customId: 'suggestIdea',
            title: "הצעת שיפור / דיווח על באג"
        }).addComponents([explaination, comments]);
        //Report helper modal
        const reportHelperCause = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder({
            customId: 'reportHelperCause',
            label: 'סיבת הדיווח',
            style: discord_js_1.TextInputStyle.Paragraph,
            required: true
        }));
        const helperName = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder({
            customId: 'helperName',
            label: "שם התומך / מספר הצ'אט",
            style: discord_js_1.TextInputStyle.Short,
            minLength: 4,
            required: true,
            placeholder: `לדוגמה: D3mocracy#8662 / צ'אט 43`
        }));
        Modals.reportHelperModal = new discord_js_1.ModalBuilder({
            customId: 'reportHelperModal',
            title: "דיווח על תומך"
        }).addComponents([helperName, reportHelperCause]);
    })(Modals = ImportantLinksMessageUtils.Modals || (ImportantLinksMessageUtils.Modals = {}));
})(ImportantLinksMessageUtils = exports.ImportantLinksMessageUtils || (exports.ImportantLinksMessageUtils = {}));
//# sourceMappingURL=ImportantLinks.js.map