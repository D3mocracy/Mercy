"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationManageMessageUtils = void 0;
const discord_js_1 = require("discord.js");
const Utils_1 = require("../Utils");
var ConversationManageMessageUtils;
(function (ConversationManageMessageUtils) {
    let EmbedMessages;
    (function (EmbedMessages) {
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
        function referSupervisor(interaction) {
            return new discord_js_1.EmbedBuilder({
                color: colors.white,
                title: "התקבלה בקשה להפניית מפקח",
                description: `**תיאור**\n${interaction.fields.getTextInputValue("referCause")}`,
            }).addFields([
                { name: "המפנה", value: `${interaction.user.tag}` },
                { name: "בטיפול של", value: "לא משויך" },
                { name: "סטטוס טיפול", value: `לא טופל` },
            ]);
        }
        EmbedMessages.referSupervisor = referSupervisor;
        function criticalChat(interaction) {
            return new discord_js_1.EmbedBuilder({
                color: colors.red,
                title: "התקבל דיווח על צ'אט קריטי",
                description: `**סיבה**\n${interaction.fields.getTextInputValue("critical_chat_reason")}`,
                timestamp: new Date(),
            }).addFields([
                { name: "המדווח", value: `${interaction.user.tag}` },
                { name: "צ'אט", value: `${interaction.channel.name}` },
                { name: "בטיפול של", value: "לא משויך" },
                { name: "סטטוס טיפול", value: `לא טופל` },
            ]);
        }
        EmbedMessages.criticalChat = criticalChat;
        function staffMemberAttached(staffMemberUsername) {
            return new discord_js_1.EmbedBuilder({
                color: colors.white,
                title: `הצ'אט שויך לתומכ/ים שנבחר/ו`,
                description: `כעת יש ל${staffMemberUsername} גישה מלאה לכתיבה בצ'אט`,
            });
        }
        EmbedMessages.staffMemberAttached = staffMemberAttached;
        EmbedMessages.ManagerTools = new discord_js_1.EmbedBuilder({
            color: colors.white,
            title: "הגדרות ניהול",
            description: "באמצעות הכפתורים מטה ניתן לבצע פעולות ניהוליות על הצ'אט",
        });
        function newChatStaff(title, description) {
            return new discord_js_1.EmbedBuilder({
                color: colors.white,
                title,
                description,
            });
        }
        EmbedMessages.newChatStaff = newChatStaff;
        async function revealUserMessage(userId) {
            const user = Utils_1.Utils.getMemberByID(userId)?.user;
            return new discord_js_1.EmbedBuilder({
                color: colors.white,
                title: "פרטי המשתמש",
                description: "מנהל יקר, שים לב כי בחרת להפר את מדיניות האנונימיות - עקב כך הפרטים בהודעה בהמשך גלויים אך ורק לך",
                footer: {
                    text: "מומלץ להנחות את אחד התומכים להמשיך לדבר עם המשתמש עד לסיום העברת המידע לגורמים הרלוונטים",
                },
            }).addFields([
                { name: "שם", value: `${user?.username}` },
                { name: "טאג", value: `${user?.tag}` },
                { name: "תיוג", value: `${user}` },
                { name: "מספר משתמש/ID", value: userId },
                { name: "קישור לתמונת הפרופיל", value: user?.avatarURL() || "לא זמין" },
                { name: "קישור לבאנר הפרופיל", value: user?.bannerURL() || "לא זמין" },
                { name: "האם בוט", value: user?.bot ? "כן" : "לא" },
                { name: "תאריך יצירת המשתמש", value: `${user?.createdAt}` },
            ]);
        }
        EmbedMessages.revealUserMessage = revealUserMessage;
        EmbedMessages.changeHelper = new discord_js_1.EmbedBuilder({
            color: colors.blue,
            title: "החלפת תומך",
            description: "(יש לבחור מתוך הרשימה מטה את התומך שתרצו לשייך אליו את הפנייה (ניתן לבחור יותר מתומך אחד",
            footer: {
                text: "שימו לב כי ההחלפה בין התומכים תשפיע על הרשאות התגובה שלהם בצ'אט בהתאם",
            },
        });
        EmbedMessages.helpersReseted = new discord_js_1.EmbedBuilder({
            color: colors.white,
            title: "הרשאות הוסרו",
            description: "כל הרשאות התומכים בצ'אט זה אופסו, ניתן כעת להגדיר תומכים חדשים",
        });
        function chatClosed(closedBy, chatTitle) {
            return new discord_js_1.EmbedBuilder({
                color: colors.red,
                title: `${chatTitle.replaceAll("-", " ")} נסגר`,
                description: `הצ'אט נסגר על ידי ${closedBy}`,
            });
        }
        EmbedMessages.chatClosed = chatClosed;
        EmbedMessages.punishMessage = new discord_js_1.EmbedBuilder({
            title: "מערכת בקרת עונשים",
            description: "יש לבחור בפעולה הרצויה",
            color: colors.red
        });
        function punishDMMessage(punish, reason, mayUser) {
            const punishConvert = {
                kick: "קיק (Kick)",
                ban: "חסימה (Ban)",
                timeout: "השתקה (Timeout)"
            };
            return new discord_js_1.EmbedBuilder({
                title: `קיבלת ${punishConvert[punish]} מהשרת אתם לא לבד`,
                description: `**סיבה:** ${reason} \n
        ניתן להגיש ערעור למנהלת השרת בהודעה פרטית: ${mayUser}
        `,
                color: colors.red,
                timestamp: new Date(),
            });
        }
        EmbedMessages.punishDMMessage = punishDMMessage;
        EmbedMessages.actionCancelledCloseChat = new discord_js_1.EmbedBuilder({
            title: 'הפעולה בוטלה',
            description: "הצ'אט נשאר פתוח כרגיל",
            color: colors.red,
        });
        function punishmentHistoryMessage(punishments) {
            return new discord_js_1.EmbedBuilder({
                title: `היסטוריית עונשים`,
                description: `
          ${punishments.length === 0
                    ? "למשתמש זה אין עונשים קודמים"
                    : punishments.map((p, i) => `
            **עונש ${i + 1}** 
            **סוג העונש:** ${p.punishType}
            **סיבה:** ${p.reason}
            **ניתן בתאריך:** ${p.punishDate}
          `).join('')}
        `,
                color: colors.white
            });
        }
        EmbedMessages.punishmentHistoryMessage = punishmentHistoryMessage;
    })(EmbedMessages = ConversationManageMessageUtils.EmbedMessages || (ConversationManageMessageUtils.EmbedMessages = {}));
    let Actions;
    (function (Actions) {
        function attachReport(isAttached) {
            return new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder({
                customId: "manager_attach_report",
                label: "שייך דיווח",
                disabled: isAttached,
                emoji: "🔀",
                style: discord_js_1.ButtonStyle.Success,
            }));
        }
        Actions.attachReport = attachReport;
        function supervisorRefferedTools(doneDisabled, inProgressDisabled) {
            return new discord_js_1.ActionRowBuilder().addComponents([new discord_js_1.ButtonBuilder({
                    customId: "manager_mark_as_done",
                    label: "טופל",
                    disabled: doneDisabled,
                    emoji: "✅",
                    style: discord_js_1.ButtonStyle.Success,
                }),
                new discord_js_1.ButtonBuilder({
                    customId: "manager_in_progress",
                    label: "בטיפול",
                    disabled: inProgressDisabled,
                    emoji: "⏳",
                    style: discord_js_1.ButtonStyle.Primary,
                })
            ]);
        }
        Actions.supervisorRefferedTools = supervisorRefferedTools;
        function tools_report_link(url) {
            return new discord_js_1.ActionRowBuilder().addComponents([
                new discord_js_1.ButtonBuilder({
                    label: "העבר אותי לצ'אט",
                    url,
                    style: discord_js_1.ButtonStyle.Link,
                }),
            ]);
        }
        Actions.tools_report_link = tools_report_link;
        function tools_sure_close_yes_no() {
            return new discord_js_1.ActionRowBuilder().addComponents([
                new discord_js_1.ButtonBuilder({
                    label: "לא",
                    customId: "sure_no",
                    style: discord_js_1.ButtonStyle.Danger,
                }),
                new discord_js_1.ButtonBuilder({
                    label: "כן",
                    customId: "sure_yes",
                    style: discord_js_1.ButtonStyle.Success,
                }),
            ]);
        }
        Actions.tools_sure_close_yes_no = tools_sure_close_yes_no;
        Actions.tools_attach = new discord_js_1.ButtonBuilder({
            customId: "tools_attach",
            label: "שיוך צ'אט אליי",
            emoji: "🔀",
            style: discord_js_1.ButtonStyle.Success,
        });
        Actions.tools_manager = new discord_js_1.ButtonBuilder({
            customId: "tools_manager",
            label: "הגדרות ניהול",
            emoji: "⚙️",
            style: discord_js_1.ButtonStyle.Secondary,
        });
        Actions.tools_close = new discord_js_1.ButtonBuilder({
            customId: "tools_close",
            label: "סגירת הצ'אט",
            emoji: "✖️",
            style: discord_js_1.ButtonStyle.Danger,
        });
        Actions.tools_report = new discord_js_1.ButtonBuilder({
            customId: "tools_refer_manager",
            label: "הפניית מפקח",
            emoji: "🧑‍💼",
            style: discord_js_1.ButtonStyle.Primary,
        });
        Actions.supporterTools = new discord_js_1.ActionRowBuilder().addComponents([
            Actions.tools_manager,
            Actions.tools_attach,
            Actions.tools_close,
            Actions.tools_report,
        ]);
        Actions.managerTools = new discord_js_1.ActionRowBuilder().addComponents([
            new discord_js_1.ButtonBuilder({
                customId: "tools_manager_punish",
                label: "הענשת משתמש",
                emoji: "👊",
                style: discord_js_1.ButtonStyle.Secondary
            }),
            new discord_js_1.ButtonBuilder({
                customId: "tools_manager_change_supporter",
                label: "החלפת תומך",
                emoji: "🔄",
                style: discord_js_1.ButtonStyle.Primary,
            }),
            new discord_js_1.ButtonBuilder({
                customId: "tools_manager_reveal",
                label: "חשיפת זהות המשתמש",
                emoji: "👁️",
                style: discord_js_1.ButtonStyle.Danger,
            }),
        ]);
        function changeHelper(helpers) {
            const selectMenu = new discord_js_1.StringSelectMenuBuilder({
                customId: "helpers_list",
                placeholder: "יש לבחור תומך אחד או יותר",
                minValues: 1,
                maxValues: helpers.length,
            });
            helpers.forEach((helper) => {
                selectMenu.addOptions({
                    label: helper.displayName,
                    value: helper.id,
                });
            });
            return new discord_js_1.ActionRowBuilder().addComponents(selectMenu);
        }
        Actions.changeHelper = changeHelper;
        Actions.resetHelpers = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder({
            label: "הסרת הרשאות לכל התומכים",
            customId: "tools_reset_helpers",
            emoji: "🗑️",
            style: discord_js_1.ButtonStyle.Danger,
        }));
        function punishMenu() {
            const selectMenu = new discord_js_1.StringSelectMenuBuilder({
                customId: "punish_menu",
                placeholder: "יש לבחור את הפעולה הרצויה",
            });
            selectMenu.addOptions([
                {
                    label: "השתקת משתמש",
                    description: "משתיק את המשתמש לזמן מוגדר (Timeout)",
                    value: "punish_timeout",
                    emoji: "⏳"
                },
                {
                    label: "הסרת משתמש מהשרת",
                    description: "מעניק קיק למשתמש",
                    value: "punish_kick",
                    emoji: "🦵"
                },
                {
                    label: "חסימת משתמש מהשרת לצמיתות",
                    description: "מעניק באן למשתמש",
                    value: "punish_ban",
                    emoji: "⛔"
                },
                {
                    label: "היסטוריית ענישות",
                    description: "מציג את הענישות הקודמות של המשתמש",
                    value: "punish_history",
                    emoji: "📜"
                },
            ]);
            return new discord_js_1.ActionRowBuilder().addComponents(selectMenu);
        }
        Actions.punishMenu = punishMenu;
    })(Actions = ConversationManageMessageUtils.Actions || (ConversationManageMessageUtils.Actions = {}));
    let Modals;
    (function (Modals) {
        //Mute Member Punish
        const muteTime = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder({
            customId: "punish_mute_time",
            label: "זמן ההשתקה",
            placeholder: "יש להכניס ערך בין 1 ל-27 בלבד",
            max_length: 2,
            min_length: 1,
            style: discord_js_1.TextInputStyle.Short,
            required: true,
        }));
        const muteCause = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder({
            customId: "punish_mute_cause",
            label: "סיבת ההשתקה",
            placeholder: "יש לציין סיבה ברורה להשתקה - הסיבה נשלחת למשתמש בהודעה פרטית!",
            style: discord_js_1.TextInputStyle.Paragraph,
            required: true,
        }));
        Modals.punishMuteModal = new discord_js_1.ModalBuilder({
            customId: "punishMuteModal",
            title: "השתקת משתמש",
        }).addComponents([muteTime, muteCause]);
        //Kick Member Punish
        const kickMemberTextInputs = new discord_js_1.ActionRowBuilder().addComponents([
            new discord_js_1.TextInputBuilder({
                customId: "punish_kick_reason",
                label: "סיבת ההסרה",
                placeholder: "יש לציין סיבה ברורה להסרה - הסיבה נשלחת למשתמש בהודעה פרטית!",
                style: discord_js_1.TextInputStyle.Paragraph,
                required: true,
            }),
        ]);
        Modals.punishKickModal = new discord_js_1.ModalBuilder({
            customId: "punishKickModal",
            title: "הסרת משתמש מהשרת",
        }).addComponents(kickMemberTextInputs);
        //Ban Member Punish
        const banMemberTextInputs = new discord_js_1.ActionRowBuilder().addComponents([
            new discord_js_1.TextInputBuilder({
                customId: "punish_ban_reason",
                label: "סיבת החסימה",
                placeholder: "יש לציין סיבה ברורה לחסימה - הסיבה נשלחת למשתמש בהודעה פרטית!",
                style: discord_js_1.TextInputStyle.Paragraph,
                required: true,
            }),
        ]);
        Modals.punishBanModal = new discord_js_1.ModalBuilder({
            customId: "punishBanModal",
            title: "חסימת משתמש מהשרת לצמיתות",
        }).addComponents(banMemberTextInputs);
        //Critical Chat Reason
        const criticalChatReason = new discord_js_1.ActionRowBuilder().addComponents([
            new discord_js_1.TextInputBuilder({
                customId: "critical_chat_reason",
                label: "סיבה",
                placeholder: "יש לציין את הסיבה לדיווח הצ'אט כקריטי, לדוגמה: משתמש מאיים להתאבד",
                style: discord_js_1.TextInputStyle.Paragraph,
                required: true,
            }),
        ]);
        Modals.criticalChatModal = new discord_js_1.ModalBuilder({
            customId: "criticalChatModal",
            title: "דיווח כצ'אט קריטי",
        }).addComponents(criticalChatReason);
    })(Modals = ConversationManageMessageUtils.Modals || (ConversationManageMessageUtils.Modals = {}));
})(ConversationManageMessageUtils = exports.ConversationManageMessageUtils || (exports.ConversationManageMessageUtils = {}));
//# sourceMappingURL=ConversationManage.js.map