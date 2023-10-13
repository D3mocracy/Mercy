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
    const author = {
        iconURL: "https://i.imgur.com/ATfQQi7.png",
        name: "Mercy - אנונימי",
    };
    const colors = {
        blue: 0x86b5dd,
        pink: 0xfe929f,
        gold: 0xfcc22d,
        red: 0xff0000,
        green: 0x33c76e,
        white: 0xffffff,
    };
    let EmbedMessages;
    (function (EmbedMessages) {
        EmbedMessages.StartConversationAsk = new discord_js_1.EmbedBuilder({
            color: colors.white,
            title: "אתם עומדים לפתוח צ'אט אנונימי",
            description: "לחיצה על כפתור ההסכמה תפתח צ'אט אנונימי עם אחד מחברי צוות השרת, וכל הודעה שתשלחו תופיע לאיש הצוות בצ'אנל נפרד בשרת. אתם מוזמנים לשתף אותנו בכל אשר על ליבכם - ברגשות, במחשבות, בבעיות ובפחדים, והצוות ישמח להעניק לכם מענה חם ואוהב בחזרה. שימו לב כי המערכת אנונימית - למעט מקרים העוברים על חוקי המדינה או מקרים חריגים אחרים אשר ידרשו פעולות דיווח.",
            footer: {
                text: "בלחיצה על כפתור ההסכמה אתם מאשרים את תנאי השימוש של השרת ומודעים לכך שצוות השרת אינו צוות מוסמך או מקצועי.",
            },
        });
        EmbedMessages.chatIsNotAvailable = new discord_js_1.EmbedBuilder({
            color: colors.white,
            title: "צ'אט לא פעיל",
            description: "צ'אט זה לא פעיל יותר עקב סגירתו ולכן לא ניתן לבצע בו פעולות נוספות",
            footer: { text: "למידע נוסף ניתן לפנות לצוות השרת" },
        });
        function errorLog(error) {
            return new discord_js_1.EmbedBuilder({
                title: `שגיאה נזרקה! - ${error.name}`,
                description: `${error.message}`,
                fields: [{ name: "Cause", value: `${error.cause}` }],
                color: colors.red,
                timestamp: new Date(),
            });
        }
        EmbedMessages.errorLog = errorLog;
        function punishmentLog(punishment) {
            const punishConvert = {
                kick: "קיק",
                ban: "באן",
                timeout: "טיים אאוט"
            };
            const punishType = punishment.punishType;
            return new discord_js_1.EmbedBuilder({
                title: "התקבלה ענישה חדשה",
                description: `
          **המוענש**
          ${Utils_1.Utils.getMemberByID(punishment.userId)}

          **המעניש**
          ${Utils_1.Utils.getMemberByID(punishment.punisherId)}

          **מתוך צ'אט**
          ${punishment.channelName.replace(/[^0-9]/g, '')}

          **סוג העונש**
          ${punishConvert[punishType]}

          **סיבת ההענשה**
          ${punishment.reason}
        `,
                color: colors.red,
            }).setTimestamp(punishment.punishDate);
        }
        EmbedMessages.punishmentLog = punishmentLog;
        function newChatUser(numberOfConversation) {
            return new discord_js_1.EmbedBuilder({
                color: colors.white,
                title: `צ'אט ${numberOfConversation}`,
                description: `צוות השרת קיבל את הודעתכם בהצלחה! כל הודעה שתשלחו כאן תגיע באופן אנונימי לצוות.`,
            });
        }
        EmbedMessages.newChatUser = newChatUser;
        async function ticketLog(channelTitle) {
            return new discord_js_1.EmbedBuilder({
                color: colors.white,
                title: `לוג ${channelTitle}`,
                description: "על מנת לראות את לוג הצ'אט יש להוריד את קובץ ה-html ולפתוח אותו במחשב",
            });
        }
        EmbedMessages.ticketLog = ticketLog;
        EmbedMessages.openChat = new discord_js_1.EmbedBuilder({
            color: colors.white,
            title: `אתם לא לבד - דברו איתנו!`,
            description: `
      אנחנו מזמינים אתכם לפנות אלינו באמצעות הצ'אט האנונימי ונשמח להעניק עבורכם אוזן קשבת, תמיכה וייעוץ לכל חברי השרת. תרגישו חופשי לשתף אותנו ברגשות, במחשבות, בבעיות ובפחדים שלכם - ונשמח להעניק לכם מענה חם ואוהב בחזרה!\n
            **שימו 🤍, לחיצה על הכפתור מהווה את אישורכם לתנאי השימוש.**
            `,
        });
        EmbedMessages.sureMessageToClose = new discord_js_1.EmbedBuilder({
            color: colors.red,
            title: "האם אתם בטוחים שברצונכם לסגור את הצ'אט?",
            description: "פעולה זו אינה הפיכה!",
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
                color: colors.gold,
                title: `👑 חבר הצוות של החודש - ${nameOfMonth} 👑`,
                description: `שאו ברכה ואיחולים לחבר הצוות של החודש - לא אחר מאשר ${helper}! \n
                **כל הכבוד, המשך כך!**`,
                thumbnail: {
                    url: "https://cdn-icons-png.flaticon.com/512/6941/6941697.png",
                },
                footer: { text: "בברכה, מנהלי השרת" },
            });
        }
        EmbedMessages.helperOfTheMonth = helperOfTheMonth;
        function helperitOfTheMonth(helper) {
            const nameOfMonth = monthNames[new Date().getMonth()];
            return new discord_js_1.EmbedBuilder({
                color: colors.gold,
                title: `👑 חברת הצוות של החודש - ${nameOfMonth} 👑`,
                description: `שאו ברכה ואיחולים לחברת הצוות של החודש - לא אחרת מאשר ${helper}! \n
                **כל הכבוד, המשיכי כך!**`,
                thumbnail: {
                    url: "https://cdn-icons-png.flaticon.com/512/6941/6941697.png",
                },
                footer: { text: "בברכה, מנהלי השרת" },
            });
        }
        EmbedMessages.helperitOfTheMonth = helperitOfTheMonth;
        function staffMembers() {
            const managerRole = Config_1.default.config.managerRole?.members;
            const helperRole = Config_1.default.config.helperRole?.members;
            return new discord_js_1.EmbedBuilder({
                author,
                color: colors.pink,
                thumbnail: {
                    url: "https://cdn-icons-png.flaticon.com/512/2332/2332039.png",
                },
                title: "צוות השרת",
                description: `**מנהלים:**
                ${managerRole?.map((manager) => `${manager.user}`)}

                **תומכים:**
                ${helperRole?.map((helper) => `${helper.user}`).join("\n")}
                `,
                footer: {
                    iconURL: author.iconURL,
                    text: "תמיד כאן בשבילכם! - הנהלת הקהילה",
                },
            });
        }
        EmbedMessages.staffMembers = staffMembers;
        function vacation(helperMember, vacationType, dateOne, dateTwo, cause) {
            return new discord_js_1.EmbedBuilder({
                color: colors.white,
                title: `הודעה על היעדרות או הפחתת פעילות`,
                description: `**פירוט הבקשה**
                ${cause}`,
                fields: [
                    { name: "נשלח על ידי", value: `${helperMember}`, inline: false },
                    { name: "סוג הבקשה", value: vacationType, inline: false },
                    { name: "עד תאריך", value: dateTwo, inline: true },
                    { name: "מתאריך", value: dateOne, inline: true },
                ],
                timestamp: new Date(),
            });
        }
        EmbedMessages.vacation = vacation;
    })(EmbedMessages = MessageUtils.EmbedMessages || (MessageUtils.EmbedMessages = {}));
    let Actions;
    (function (Actions) {
        Actions.openChatButton = new discord_js_1.ActionRowBuilder().addComponents([
            new discord_js_1.ButtonBuilder({
                customId: "openChatButton",
                label: "פתיחת צ'אט אנונימי",
                style: discord_js_1.ButtonStyle.Primary,
            }),
        ]);
        function linkButton(url, label) {
            return new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder({
                style: discord_js_1.ButtonStyle.Link,
                label,
                url,
            }));
        }
        Actions.linkButton = linkButton;
        function disabledGreyButton(label) {
            return new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder({
                style: discord_js_1.ButtonStyle.Secondary,
                label,
                disabled: true,
                customId: "disabledButton",
            }));
        }
        Actions.disabledGreyButton = disabledGreyButton;
        function disabledGreenButton(label) {
            return new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder({
                style: discord_js_1.ButtonStyle.Success,
                label,
                disabled: true,
                customId: "disabledButtonGreen",
            }));
        }
        Actions.disabledGreenButton = disabledGreenButton;
    })(Actions = MessageUtils.Actions || (MessageUtils.Actions = {}));
    let Modals;
    (function (Modals) {
        //Refer Manager
        const reportCause = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder({
            customId: "referCause",
            label: "פירוט סיבת ההפנייה",
            max_length: 100,
            style: discord_js_1.TextInputStyle.Paragraph,
            required: true,
        }));
        Modals.referManagerModal = new discord_js_1.ModalBuilder({
            customId: "referManager",
            title: "הפניית מפקח",
        }).addComponents(reportCause);
        //Ask Vacation
        const vacationType = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder({
            customId: "vacation_type",
            label: "סוג",
            style: discord_js_1.TextInputStyle.Short,
            placeholder: "היעדרות או הפחתת פעילות",
            required: true,
        }));
        const date1 = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder({
            customId: "vacation_date_one",
            label: "מהתאריך",
            style: discord_js_1.TextInputStyle.Short,
            placeholder: "יש לציין את התאריך הרלוונטי",
            required: true,
        }));
        const date2 = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder({
            customId: "vacation_date_two",
            label: "עד התאריך",
            style: discord_js_1.TextInputStyle.Short,
            placeholder: `ניתן להשאיר ריק אם מדובר ביום אחד`,
            required: false,
        }));
        const causeVacation = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder({
            customId: "vacation_cause",
            label: "סיבה",
            style: discord_js_1.TextInputStyle.Paragraph,
            placeholder: `לא חובה`,
            required: false,
        }));
        Modals.vacationModal = new discord_js_1.ModalBuilder({
            customId: "vacationModal",
            title: "בקשה להיעדרות או להפחתת פעילות",
        }).addComponents([vacationType, date1, date2, causeVacation]);
        //Volunteer
        const nameVolunteer = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder({
            customId: "volunteer_name",
            label: "שם או כינוי",
            style: discord_js_1.TextInputStyle.Short,
            placeholder: `חובה`,
            required: true,
        }));
        const dateVolunteer = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder({
            customId: "volunteer_date",
            label: "שנת לידה",
            style: discord_js_1.TextInputStyle.Short,
            placeholder: `חובה`,
            required: true,
        }));
        const aboutYourselfVolunteer = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder({
            customId: "volunteer_about_yourself",
            label: "ספרו לנו קצת על עצמכם",
            style: discord_js_1.TextInputStyle.Paragraph,
            placeholder: `חובה`,
            required: true,
        }));
        const whyVolunteer = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder({
            customId: "volunteer_why",
            label: "מדוע אתם רוצים להתנדב בשרת?",
            style: discord_js_1.TextInputStyle.Paragraph,
            placeholder: `חובה`,
            required: true,
        }));
        const freqVolunteer = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder({
            customId: "volunteer_freq",
            label: "מהי תדירות הפעילות הכללית שלכם בדיסקורד?",
            style: discord_js_1.TextInputStyle.Short,
            placeholder: `חובה`,
            required: true,
        }));
        const moreVolunteer = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder({
            customId: "volunteer_more",
            label: "דברים נוספים שברצונכם לציין",
            style: discord_js_1.TextInputStyle.Paragraph,
            placeholder: `לא חובה`,
            required: false,
        }));
        Modals.volunteerModal = new discord_js_1.ModalBuilder({
            customId: "volunteerModal",
            title: "התנדבות בשרת",
        }).addComponents([
            nameVolunteer,
            dateVolunteer,
            aboutYourselfVolunteer,
            whyVolunteer,
            freqVolunteer,
            moreVolunteer,
        ]);
    })(Modals = MessageUtils.Modals || (MessageUtils.Modals = {}));
})(MessageUtils = exports.MessageUtils || (exports.MessageUtils = {}));
//# sourceMappingURL=MessageUtils.js.map