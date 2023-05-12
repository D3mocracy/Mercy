"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationManageMessageUtils = void 0;
const discord_js_1 = require("discord.js");
const Utils_1 = require("../Utils");
var ConversationManageMessageUtils;
(function (ConversationManageMessageUtils) {
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
        function referManager(interaction) {
            return new discord_js_1.EmbedBuilder({
                author,
                color: colors.pink,
                title: `התקבלה בקשה חדשה מתומך`,
                description: `${interaction.fields.getTextInputValue('referCause')}`
            }).addFields([
                { name: "תומך:", value: `${interaction.user.tag}` },
                { name: "סטטוס טיפול", value: `לא טופל` },
            ]);
        }
        EmbedMessages.referManager = referManager;
        ;
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
        function newChatStaff() {
            return new discord_js_1.EmbedBuilder({
                author,
                color: colors.pink,
                title: `ניהול צ'אט נוכחי`,
                description: `משתמש פתח צ'אט, נא לתת סיוע בהתאם!`,
            });
        }
        EmbedMessages.newChatStaff = newChatStaff;
        async function revealUserMessage(client, userId) {
            const user = await Utils_1.Utils.getUserByID(client, userId);
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
    })(EmbedMessages = ConversationManageMessageUtils.EmbedMessages || (ConversationManageMessageUtils.EmbedMessages = {}));
    let Actions;
    (function (Actions) {
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
        function markAsDone(isAttached) {
            return new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder({
                customId: 'manager_mark_as_done',
                label: 'סמן כבוצע',
                disabled: isAttached,
                emoji: "✔️",
                style: discord_js_1.ButtonStyle.Success
            }));
        }
        Actions.markAsDone = markAsDone;
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
            emoji: '⚙️',
            style: discord_js_1.ButtonStyle.Primary
        });
        Actions.tools_close = new discord_js_1.ButtonBuilder({
            customId: "tools_close",
            label: "סגירת צ'אט",
            emoji: '✖️',
            style: discord_js_1.ButtonStyle.Danger
        });
        Actions.tools_report = new discord_js_1.ButtonBuilder({
            customId: "tools_refer_manager",
            label: "הפנה מנהל",
            emoji: '🧑‍💼',
            style: discord_js_1.ButtonStyle.Secondary
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
    })(Actions = ConversationManageMessageUtils.Actions || (ConversationManageMessageUtils.Actions = {}));
})(ConversationManageMessageUtils = exports.ConversationManageMessageUtils || (exports.ConversationManageMessageUtils = {}));
//# sourceMappingURL=ConversationManage.js.map