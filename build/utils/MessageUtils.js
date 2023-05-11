"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageUtils = void 0;
const discord_js_1 = require("discord.js");
const Utils_1 = require("./Utils");
var MessageUtils;
(function (MessageUtils) {
    const author = { iconURL: 'https://i.imgur.com/ATfQQi7.png', name: 'Mercy - אנונימי' };
    const colors = {
        blue: 0x86b5dd,
        pink: 0xfe929f,
        gold: 0xfcc22d,
        red: 0xff0000
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
        function newChatStaff() {
            return new discord_js_1.EmbedBuilder({
                author,
                color: colors.pink,
                title: `ניהול צ'אט נוכחי`,
                description: `משתמש פתח צ'אט, נא לתת סיוע בהתאם!`,
            });
        }
        EmbedMessages.newChatStaff = newChatStaff;
        function newChatUser(numberOfConversation) {
            return new discord_js_1.EmbedBuilder({
                author,
                color: colors.pink,
                title: `צ'אט מספר ${numberOfConversation}`,
                description: `צוות השרת קיבל את הודעתכם בהצלחה! כל הודעה שתשלחו כאן תגיע באופן אנונימי לצוות.`,
            });
        }
        EmbedMessages.newChatUser = newChatUser;
        function staffMemberAttached(staffMemberUsername) {
            return new discord_js_1.EmbedBuilder({
                author,
                color: colors.blue,
                title: `הצ'אט שויך לתומכ/ים שנבחר/ו`,
                description: `כעת יש ל${staffMemberUsername} גישה מלאה לכתיבה ולעזרה בצאנל`
            });
        }
        EmbedMessages.staffMemberAttached = staffMemberAttached;
        EmbedMessages.ManagerTools = new discord_js_1.EmbedBuilder({
            author,
            color: colors.blue,
            title: "הגדרות ניהול",
            description: "מנהלים יקרים, שימו לב שהפרת אנונימיות של משתמש היא נושא רגיש מאוד. אם אין לכם חשד כי מדובר בעבירה על אחד מחוקי המדינה ו/או פגיעה עצמית ו/או פגיעה בסובבים את האינדיבידואל, השתדל שלא להפר מדיניות זו."
        });
        async function revealUserMessage(userId) {
            const user = await Utils_1.Utils.getUserByID(userId);
            return new discord_js_1.EmbedBuilder({
                author,
                color: colors.blue,
                title: "פרטי המשתמש",
                description: "מנהל יקר, שים לב כי בחרת להפר את מדיניות האנונימיות - עקב כך הפרטים בהודעה בהמשך גלויים אך ורק לך",
                footer: { text: "מומלץ להנחות את אחד התומכים להמשיך לדבר עם המשתמש עד לסיום העברת המידע לגורמים הרלוונטים" }
            }).addFields([
                { name: "שם", value: user.username },
                { name: "טאג", value: user.tag },
                { name: "תיוג", value: user.toString() },
                { name: "מספר משתמש/ID", value: userId },
                { name: "קישור לתמונת הפרופיל", value: user.avatarURL() || "לא זמין" },
                { name: "קישור לבאנר הפרופיל", value: user.bannerURL() || "לא זמין" },
                { name: "האם בוט", value: user.bot ? "כן" : "לא" },
                { name: "תאריך יצירת המשתמש", value: user.createdAt.toString() },
            ]);
        }
        EmbedMessages.revealUserMessage = revealUserMessage;
        EmbedMessages.changeHelper = new discord_js_1.EmbedBuilder({
            author,
            color: colors.blue,
            title: "החלפת תומך",
            description: "יש לבחור מתוך הרשימה למטה את התומך שתרצה לשייך אליו את הפנייה. ניתן לבחור יותר מתומך אחד.",
            footer: { text: "שימו לב כי החלפה בין התומכים תשפיע על הרשאות התגובה שלהם בצ'אנל בהתאם.  " }
        });
        EmbedMessages.answerOpenConversationTimeEnd = new discord_js_1.EmbedBuilder({
            author,
            color: colors.blue,
            title: "חלף הזמן",
            description: "לא הצלחתי לזהות בחירה מכם. אם אתם מעוניינים לפתוח צ'אט אתם תמיד מוזמנים לשלוח לי הודעה פעם נוספת.",
            footer: { text: "לפתיחת צ'אט יש לשלוח הודעה נוספת." }
        });
        EmbedMessages.userChooseNo = new discord_js_1.EmbedBuilder({
            author,
            color: colors.blue,
            title: "הפעולה בוטלה",
            description: "בחרתם לא לפתוח צ'אט אנונימי. אתם תמיד מוזמנים לכתוב לי פעם נוספת - אני כאן.",
            footer: { text: "לפתיחת צ'אט יש לשלוח הודעה נוספת." }
        });
        EmbedMessages.helpersReseted = new discord_js_1.EmbedBuilder({
            author,
            color: colors.blue,
            title: "הרשאות הוסרו",
            description: "כל הרשאות התומכים של צ'אט זה אופסו, ניתן כעת להגדיר תומכים חדשים",
        });
        function chatClosed(closedBy, chatTitle) {
            return new discord_js_1.EmbedBuilder({
                author,
                color: colors.pink,
                title: `${chatTitle.replaceAll('-', ' ')} נסגר`,
                description: `הצ'אט נסגר על ידי ${closedBy}`,
            });
        }
        EmbedMessages.chatClosed = chatClosed;
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
        async function reportConversationMessage(interaction) {
            return new discord_js_1.EmbedBuilder({
                author,
                color: colors.blue,
                title: `דיווח על ${interaction.channel.name}`,
                description: `${interaction.fields.getTextInputValue('reportCause')}`
            }).addFields([
                { name: "איש צוות מדווח", value: `${interaction.user.tag}` },
                { name: "מנהל מטפל", value: `!לא שויך מנהל!` },
            ]);
        }
        EmbedMessages.reportConversationMessage = reportConversationMessage;
        ;
        async function reportHelperMessage(interaction, helpers) {
            return new discord_js_1.EmbedBuilder({
                author,
                color: colors.blue,
                title: `דיווח על ${helpers}`,
                description: `${interaction.fields.getTextInputValue('reportHelperCause')}`
            }).addFields([
                // { name: "משתמש מדווח", value: `${interaction.user.tag}` },
                { name: "מנהל מטפל", value: `!לא שויך מנהל!` },
            ]);
        }
        EmbedMessages.reportHelperMessage = reportHelperMessage;
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
        function importantLinks(channels) {
            return new discord_js_1.EmbedBuilder({
                author,
                color: colors.blue,
                title: "מידע שימושי",
                description: `משתמשים יקרים, לשרותכם מידע ולינקים חשובים בשרת \n
                ${channels.map(channel => `${channel}`)}
                `
            });
        }
        EmbedMessages.importantLinks = importantLinks;
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
        function attachReport(isAttached) {
            return new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder({
                customId: 'manager_attach_report',
                label: 'שייך דיווח',
                disabled: isAttached,
                emoji: "🔀",
                style: discord_js_1.ButtonStyle.Success
            }));
        }
        Actions.attachReport = attachReport;
        function tools_report_link(url) {
            return new discord_js_1.ActionRowBuilder().addComponents([
                new discord_js_1.ButtonBuilder({
                    label: "העבר אותי לצ'אט",
                    url,
                    style: discord_js_1.ButtonStyle.Link
                }),
            ]);
        }
        Actions.tools_report_link = tools_report_link;
        function tools_sure_close_yes_no() {
            return new discord_js_1.ActionRowBuilder().addComponents([
                new discord_js_1.ButtonBuilder({
                    label: "אני בטוח/ה",
                    customId: 'sure_yes',
                    style: discord_js_1.ButtonStyle.Success
                }),
                new discord_js_1.ButtonBuilder({
                    label: "התחרטתי",
                    customId: "sure_no",
                    style: discord_js_1.ButtonStyle.Danger
                })
            ]);
        }
        Actions.tools_sure_close_yes_no = tools_sure_close_yes_no;
        Actions.tools_attach = new discord_js_1.ButtonBuilder({
            customId: "tools_attach",
            label: "שיוך צ'אט אליי",
            emoji: "🔀",
            style: discord_js_1.ButtonStyle.Success
        });
        Actions.tools_manager = new discord_js_1.ButtonBuilder({
            customId: "tools_manager",
            label: "הגדרות ניהול",
            emoji: '🧑‍💼',
            style: discord_js_1.ButtonStyle.Primary
        });
        Actions.tools_close = new discord_js_1.ButtonBuilder({
            customId: "tools_close",
            label: "סגירת צ'אט",
            emoji: '✖️',
            style: discord_js_1.ButtonStyle.Danger
        });
        Actions.tools_report = new discord_js_1.ButtonBuilder({
            customId: "tools_report",
            label: "דיווח",
            emoji: '🚩',
            style: discord_js_1.ButtonStyle.Secondary
        });
        Actions.user_report_helper = new discord_js_1.ButtonBuilder({
            customId: "user_report_helper",
            label: "דווח על תומך",
            emoji: '🚩',
            style: discord_js_1.ButtonStyle.Secondary
        });
        Actions.user_suggest = new discord_js_1.ButtonBuilder({
            customId: "user_suggest",
            label: "יש לי הצעת שיפור",
            emoji: "✅",
            style: discord_js_1.ButtonStyle.Success
        });
        Actions.supporterTools = new discord_js_1.ActionRowBuilder().addComponents([
            Actions.tools_close,
            Actions.tools_manager,
            Actions.tools_report,
            Actions.tools_attach,
        ]);
        Actions.managerTools = new discord_js_1.ActionRowBuilder().addComponents([
            new discord_js_1.ButtonBuilder({
                customId: "tools_manager_change_supporter",
                label: "החלפת תומך",
                emoji: '👼',
                style: discord_js_1.ButtonStyle.Success,
            }),
            new discord_js_1.ButtonBuilder({
                customId: "tools_manager_reveal",
                label: "גילוי משתמש",
                emoji: '👁️',
                style: discord_js_1.ButtonStyle.Secondary,
            }),
        ]);
        function changeHelper(helpers) {
            const selectMenu = new discord_js_1.StringSelectMenuBuilder({
                customId: "helpers_list",
                placeholder: "בחר תומך אחד או יותר",
                minValues: 1,
                maxValues: helpers.length,
            });
            helpers.forEach(helper => {
                selectMenu.addOptions({ label: helper.displayName, description: "Helper", value: helper.id, emoji: '🇭' });
            });
            return new discord_js_1.ActionRowBuilder().addComponents(selectMenu);
        }
        Actions.changeHelper = changeHelper;
        ;
        Actions.resetHelpers = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder({
            label: "מחיקת הרשאות לכל התומכים",
            customId: 'tools_reset_helpers',
            emoji: '🔄',
            style: discord_js_1.ButtonStyle.Danger,
        }));
    })(Actions = MessageUtils.Actions || (MessageUtils.Actions = {}));
    ;
    let Modals;
    (function (Modals) {
        const reportCause = new discord_js_1.TextInputBuilder({
            customId: 'reportCause',
            label: 'סיבת הדיווח',
            style: discord_js_1.TextInputStyle.Paragraph,
            required: true
        });
        const reportCauseActionRow = new discord_js_1.ActionRowBuilder().addComponents(reportCause);
        Modals.reportChatModal = new discord_js_1.ModalBuilder({
            customId: 'reportModal',
            title: "דיווח על צ'אט חריג"
        }).addComponents(reportCauseActionRow);
        const reportHelperCause = new discord_js_1.TextInputBuilder({
            customId: 'reportHelperCause',
            label: 'סיבת הדיווח',
            style: discord_js_1.TextInputStyle.Paragraph,
            required: true
        });
        const helperName = new discord_js_1.TextInputBuilder({
            customId: 'helperName',
            label: 'שם התומך',
            style: discord_js_1.TextInputStyle.Short,
            required: true,
            placeholder: `לדוגמה: D3mocracy#8662`
        });
        const reportHelperCauseActionRow = new discord_js_1.ActionRowBuilder().addComponents([helperName, reportHelperCause]);
        Modals.reportHelperModal = new discord_js_1.ModalBuilder({
            customId: 'reportHelperModal',
            title: "דיווח על תומך"
        }).addComponents(reportHelperCauseActionRow);
    })(Modals = MessageUtils.Modals || (MessageUtils.Modals = {}));
})(MessageUtils = exports.MessageUtils || (exports.MessageUtils = {}));
//# sourceMappingURL=MessageUtils.js.map