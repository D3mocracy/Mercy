"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageUtils = void 0;
const discord_js_1 = require("discord.js");
const Utils_1 = require("./Utils");
const Config_1 = __importDefault(require("../handlers/Config"));
var MessageUtils;
(function (MessageUtils) {
    const author = { iconURL: 'https://i.imgur.com/ATfQQi7.png', name: 'Mercy - אנונימי' };
    const colors = {
        blue: 0x86b5dd,
        pink: 0xfe929f,
        gold: 0xfcc22d,
        red: 0xff0000,
        green: 0x33C76E
    };
    let EmbedMessages;
    (function (EmbedMessages) {
        EmbedMessages.StartConversationAsk = new discord_js_1.EmbedBuilder({
            author,
            color: colors.blue,
            title: "אתם עומדים לפתוח צ'אט אנונימי",
            description: "לחיצה על כפתור ההסכמה תפתח צ'אט אנונימי עם אחד מחברי צוות השרת, וכל הודעה שתשלחו תופיע לאיש הצוות בצ'אנל נפרד בשרת. אתם מוזמנים לשתף אותנו בכל אשר על ליבכם - ברגשות, במחשבות, בבעיות ובפחדים, והצוות ישמח להעניק לכם מענה חם ואוהב בחזרה. שימו לב כי המערכת אנונימית - למעט מקרים העוברים על חוקי המדינה או מקרים חריגים אחרים אשר ידרשו פעולות דיווח.",
            footer: { text: "בלחיצה על כפתור ההסכמה אתם מאשרים את תנאי השימוש של השרת ומודעים לכך שצוות השרת אינו צוות מוסמך או מקצועי." }
        });
        EmbedMessages.chatIsNotAvailable = new discord_js_1.EmbedBuilder({
            author,
            color: colors.pink,
            title: "צ'אט לא פעיל",
            description: "צ'אט זה אינו פעיל יותר עקב סגירתו ולכן לא ניתן לבצע בו פעולות נוספות",
            footer: { text: "למידע נוסף ניתן לפנות לצוות התומכים" }
        });
        function errorLog(error) {
            return new discord_js_1.EmbedBuilder({
                author: { name: "Mercy - מתכנתים", iconURL: author.iconURL },
                title: `שגיאה נזרקה! - ${error.name}`,
                description: `${error.message}`,
                fields: [{ name: "Cause", value: `${error.cause}` }],
                color: colors.red,
                timestamp: new Date(),
            });
        }
        EmbedMessages.errorLog = errorLog;
        function newChatUser(numberOfConversation) {
            return new discord_js_1.EmbedBuilder({
                author,
                color: colors.pink,
                title: `צ'אט מספר ${numberOfConversation}`,
                description: `צוות השרת קיבל את הודעתכם בהצלחה! כל הודעה שתשלחו כאן תגיע באופן אנונימי לצוות.`,
            });
        }
        EmbedMessages.newChatUser = newChatUser;
        async function ticketLog(channelTitle) {
            return new discord_js_1.EmbedBuilder({
                author: { name: 'Mercy - הנהלה', iconURL: author.iconURL },
                color: colors.blue,
                title: `לוג ${channelTitle}`,
                description: "על מנת לראות את לוג השאלה יש להוריד את קובץ הhtml ולפתוח אותו על המחשב"
            });
        }
        EmbedMessages.ticketLog = ticketLog;
        ;
        EmbedMessages.openChat = new discord_js_1.EmbedBuilder({
            author,
            color: colors.blue,
            title: `אתם לא לבד - דברו איתנו!`,
            description: `
            על מנת לפתוח צ'אט ולשוחח עם אחד התומכים באופן אנונימי יש ללחוץ על הכפתור מטה, ו**הצ'אט יפתח באופן אוטומטי**. לאחר פתיחתו תקבלו הודעה פרטית מהבוט האנונימי שלנו כי הצ'אט אכן נפתח. \n
            באמצעות ההודעה הפרטית אתם מוזמנים לכתוב לנו ולפרוק בחופשיות את כל מה שעל ליבכם, ונשמח להעניק לכם אוזן קשבת ומענה חם ואוהב בחזרה. \n
            **שימו ❤️, לחיצה על הכפתור מהווה את אישורכם לתנאי השימוש.**
            `,
            thumbnail: { url: author.iconURL }
        });
        EmbedMessages.sureMessageToClose = new discord_js_1.EmbedBuilder({
            author,
            color: colors.pink,
            title: "האם את/ה בטוח/ה שברצונך לסגור את הצ'אט?",
            description: "פעולה זו אינה הפיכה"
        });
        const monthNames = {
            0: "ינואר",
            1: "פברואר",
            2: "מרץ",
            3: "אפריל",
            4: "מאי",
            5: "יוני",
            6: "יולי",
            7: "אוגוסט",
            8: "ספטמבר",
            9: "אוקטובר",
            10: "נובמבר",
            11: "דצמבר",
        };
        function helperOfTheMonth(helper) {
            const nameOfMonth = monthNames[new Date().getMonth()];
            return new discord_js_1.EmbedBuilder({
                author: { name: "Mercy - הנהלה", iconURL: author.iconURL },
                color: colors.gold,
                title: `👑 תומך החודש - ${nameOfMonth} 👑`,
                description: `שאו ברכה ואיחולים לתומך החודש - לא אחר מאשר ${helper}! \n
                מזל טוב! זכית ב... 
                \`\`\`Discord Nitro 👾\`\`\`
                **כל הכבוד המשך כך!**`,
                thumbnail: { url: "https://cdn-icons-png.flaticon.com/512/6941/6941697.png" },
                footer: { text: "בברכה, מנהלי הקהילה", iconURL: author.iconURL }
            });
        }
        EmbedMessages.helperOfTheMonth = helperOfTheMonth;
        async function staffMembers() {
            const managers = await Utils_1.Utils.getUsersWithRoleId(Config_1.default.config.managerRole.id);
            const helpers = await Utils_1.Utils.getUsersWithRoleId(Config_1.default.config.helperRole.id);
            return new discord_js_1.EmbedBuilder({
                author,
                color: colors.pink,
                thumbnail: { url: "https://cdn-icons-png.flaticon.com/512/2332/2332039.png" },
                title: "צוות השרת",
                description: `**מנהלים:**
                ${managers.map(manager => `${manager.user}`)}

                **תומכים:**
                ${helpers.map(helper => `${helper.user}`).join('\n')}
                `,
                footer: { iconURL: author.iconURL, text: "תמיד כאן בשבילכם! - הנהלת הקהילה" }
            });
        }
        EmbedMessages.staffMembers = staffMembers;
    })(EmbedMessages = MessageUtils.EmbedMessages || (MessageUtils.EmbedMessages = {}));
    let Actions;
    (function (Actions) {
        Actions.openChatButton = new discord_js_1.ActionRowBuilder().addComponents([
            new discord_js_1.ButtonBuilder({
                customId: 'openChatButton',
                label: "פתיחת צ'אט אנונימי",
                style: discord_js_1.ButtonStyle.Primary
            })
        ]);
        function linkButton(url, label) {
            return new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder({
                style: discord_js_1.ButtonStyle.Link,
                label,
                url
            }));
        }
        Actions.linkButton = linkButton;
    })(Actions = MessageUtils.Actions || (MessageUtils.Actions = {}));
    ;
    let Modals;
    (function (Modals) {
        //Refer Manager
        const reportCause = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder({
            customId: 'referCause',
            label: 'בקשה',
            style: discord_js_1.TextInputStyle.Paragraph,
            required: true
        }));
        Modals.referManagerModal = new discord_js_1.ModalBuilder({
            customId: 'referManager',
            title: "שליחת בקשה למנהל / הפנה מנהל"
        }).addComponents(reportCause);
    })(Modals = MessageUtils.Modals || (MessageUtils.Modals = {}));
})(MessageUtils = exports.MessageUtils || (exports.MessageUtils = {}));
//# sourceMappingURL=MessageUtils.js.map