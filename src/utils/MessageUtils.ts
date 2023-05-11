import { GuildMember, EmbedBuilder, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, ModalSubmitInteraction, TextChannel } from "discord.js";
import { Utils } from "./Utils";

export namespace MessageUtils {
    const author = { iconURL: 'https://i.imgur.com/ATfQQi7.png', name: 'Mercy - אנונימי' };
    const colors = {
        blue: 0x86b5dd,
        pink: 0xfe929f,
        gold: 0xfcc22d,
        red: 0xff0000
    }

    export namespace EmbedMessages {
        export const StartConversationAsk = new EmbedBuilder({
            author,
            color: colors.blue,
            title: "אתם עומדים לפתוח צ'אט אנונימי",
            description: "לחיצה על כפתור ההסכמה תפתח צ'אט אנונימי עם אחד מחברי צוות השרת, וכל הודעה שתשלחו תופיע לאיש הצוות בצ'אנל נפרד בשרת. אתם מוזמנים לשתף אותנו בכל אשר על ליבכם - ברגשות, במחשבות, בבעיות ובפחדים, והצוות ישמח להעניק לכם מענה חם ואוהב בחזרה. שימו לב כי המערכת אנונימית - למעט מקרים העוברים על חוקי המדינה או מקרים חריגים אחרים אשר ידרשו פעולות דיווח.",
            footer: { text: "בלחיצה על כפתור ההסכמה אתם מאשרים את תנאי השימוש של השרת ומודעים לכך שצוות השרת אינו צוות מוסמך או מקצועי." }
        });

        export const chatIsNotAvailable = new EmbedBuilder({
            author,
            color: colors.pink,
            title: "צ'אט לא פעיל",
            description: "צ'אט זה אינו פעיל יותר עקב סגירתו ולכן לא ניתן לבצע בו פעולות נוספות",
            footer: { text: "למידע נוסף ניתן לפנות לצוות התומכים" }
        })

        export function errorLog(error: Error) {
            return new EmbedBuilder({
                author: { name: "Mercy - מתכנתים", iconURL: author.iconURL },
                title: `שגיאה נזרקה! - ${error.name}`,
                description: `${error.message}`,
                fields: [{ name: "Cause", value: `${error.cause}` }],
                color: colors.red,
                timestamp: new Date(),
            })
        }

        export function newChatStaff() {
            return new EmbedBuilder({
                author,
                color: colors.pink,
                title: `ניהול צ'אט נוכחי`,
                description: `משתמש פתח צ'אט, נא לתת סיוע בהתאם!`,
            });
        }

        export function newChatUser(numberOfConversation: number) {
            return new EmbedBuilder({
                author,
                color: colors.pink,
                title: `צ'אט מספר ${numberOfConversation}`,
                description: `צוות השרת קיבל את הודעתכם בהצלחה! כל הודעה שתשלחו כאן תגיע באופן אנונימי לצוות.`,
            });
        }

        export function staffMemberAttached(staffMemberUsername: string) {
            return new EmbedBuilder({
                author,
                color: colors.blue,
                title: `הצ'אט שויך לתומכ/ים שנבחר/ו`,
                description: `כעת יש ל${staffMemberUsername} גישה מלאה לכתיבה ולעזרה בצאנל`
            });
        }

        export const ManagerTools = new EmbedBuilder({
            author,
            color: colors.blue,
            title: "הגדרות ניהול",
            description: "מנהלים יקרים, שימו לב שהפרת אנונימיות של משתמש היא נושא רגיש מאוד. אם אין לכם חשד כי מדובר בעבירה על אחד מחוקי המדינה ו/או פגיעה עצמית ו/או פגיעה בסובבים את האינדיבידואל, השתדל שלא להפר מדיניות זו."
        });

        export async function revealUserMessage(userId: string) {
            const user = await Utils.getUserByID(userId);
            return new EmbedBuilder({
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
            ])
        }

        export const changeHelper = new EmbedBuilder({
            author,
            color: colors.blue,
            title: "החלפת תומך",
            description: "יש לבחור מתוך הרשימה למטה את התומך שתרצה לשייך אליו את הפנייה. ניתן לבחור יותר מתומך אחד.",
            footer: { text: "שימו לב כי החלפה בין התומכים תשפיע על הרשאות התגובה שלהם בצ'אנל בהתאם.  " }
        });

        export const answerOpenConversationTimeEnd = new EmbedBuilder({
            author,
            color: colors.blue,
            title: "חלף הזמן",
            description: "לא הצלחתי לזהות בחירה מכם. אם אתם מעוניינים לפתוח צ'אט אתם תמיד מוזמנים לשלוח לי הודעה פעם נוספת.",
            footer: { text: "לפתיחת צ'אט יש לשלוח הודעה נוספת." }
        });

        export const userChooseNo = new EmbedBuilder({
            author,
            color: colors.blue,
            title: "הפעולה בוטלה",
            description: "בחרתם לא לפתוח צ'אט אנונימי. אתם תמיד מוזמנים לכתוב לי פעם נוספת - אני כאן.",
            footer: { text: "לפתיחת צ'אט יש לשלוח הודעה נוספת." }
        });

        export const helpersReseted = new EmbedBuilder({
            author,
            color: colors.blue,
            title: "הרשאות הוסרו",
            description: "כל הרשאות התומכים של צ'אט זה אופסו, ניתן כעת להגדיר תומכים חדשים",
        });

        export function chatClosed(closedBy: string, chatTitle: string) {
            return new EmbedBuilder({
                author,
                color: colors.pink,
                title: `${chatTitle.replaceAll('-', ' ')} נסגר`,
                description: `הצ'אט נסגר על ידי ${closedBy}`,
            });
        }

        export async function ticketLog(channelTitle: string) {
            return new EmbedBuilder({
                author: { name: 'Mercy - הנהלה', iconURL: author.iconURL },
                color: colors.blue,
                title: `לוג ${channelTitle}`,
                description: "על מנת לראות את לוג השאלה יש להוריד את קובץ הhtml ולפתוח אותו על המחשב"
            });
        };

        export async function reportConversationMessage(interaction: ModalSubmitInteraction) {
            return new EmbedBuilder({
                author,
                color: colors.blue,
                title: `דיווח על ${(interaction.channel as TextChannel).name}`,
                description: `${interaction.fields.getTextInputValue('reportCause')}`
            }).addFields([
                { name: "איש צוות מדווח", value: `${interaction.user.tag}` },
                { name: "מנהל מטפל", value: `!לא שויך מנהל!` },
            ])
        };

        export async function reportHelperMessage(interaction: ModalSubmitInteraction, helpers: string) {
            return new EmbedBuilder({
                author,
                color: colors.blue,
                title: `דיווח על ${helpers}`,
                description: `${interaction.fields.getTextInputValue('reportHelperCause')}`
            }).addFields([
                // { name: "משתמש מדווח", value: `${interaction.user.tag}` },
                { name: "מנהל מטפל", value: `!לא שויך מנהל!` },
            ])
        };

        export const openChat = new EmbedBuilder({
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

        export const sureMessageToClose = new EmbedBuilder({
            author,
            color: colors.pink,
            title: "האם את/ה בטוח/ה שברצונך לסגור את הצ'אט?",
            description: "פעולה זו אינה הפיכה"
        })

        const monthNames: { [num: number]: string } = {
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
        }

        export function helperOfTheMonth(helper: GuildMember) {
            const nameOfMonth = monthNames[new Date().getMonth()]
            return new EmbedBuilder({
                author: { name: "Mercy - הנהלה", iconURL: author.iconURL },
                color: colors.gold,
                title: `👑 תומך החודש - ${nameOfMonth} 👑`,
                description: `שאו ברכה ואיחולים לתומך החודש - לא אחר מאשר ${helper}! \n
                מזל טוב! זכית ב... 
                \`\`\`Discord Nitro 👾\`\`\`
                **כל הכבוד המשך כך!**`,
                thumbnail: { url: "https://cdn-icons-png.flaticon.com/512/6941/6941697.png" },
                footer: { text: "בברכה, מנהלי הקהילה", iconURL: author.iconURL }
            })
        }

        export function importantLinks(channels: TextChannel[]) {
            return new EmbedBuilder({
                author,
                color: colors.blue,
                title: "מידע שימושי",
                description: `משתמשים יקרים, לשרותכם מידע ולינקים חשובים בשרת \n
                ${channels.map(channel => `${channel}`)}
                `
            })
        }


    }

    export namespace Actions {

        export const openChatButton = new ActionRowBuilder<ButtonBuilder>().addComponents([
            new ButtonBuilder({
                customId: 'openChatButton',
                label: "פתיחת צ'אט אנונימי",
                style: ButtonStyle.Primary
            })
        ])

        export function linkButton(url: string, label: string) {
            return new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder({
                    style: ButtonStyle.Link,
                    label,
                    url
                })
            )
        }

        export function attachReport(isAttached: boolean) {
            return new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder({
                    customId: 'manager_attach_report',
                    label: 'שייך דיווח',
                    disabled: isAttached,
                    emoji: "🔀",
                    style: ButtonStyle.Success
                })
            );

        }
        export function tools_report_link(url: string) {
            return new ActionRowBuilder<ButtonBuilder>().addComponents([
                new ButtonBuilder({
                    label: "העבר אותי לצ'אט",
                    url,
                    style: ButtonStyle.Link
                }),
            ])
        }

        export function tools_sure_close_yes_no() {
            return new ActionRowBuilder<ButtonBuilder>().addComponents([
                new ButtonBuilder({
                    label: "אני בטוח/ה",
                    customId: 'sure_yes',
                    style: ButtonStyle.Success
                }),
                new ButtonBuilder({
                    label: "התחרטתי",
                    customId: "sure_no",
                    style: ButtonStyle.Danger
                })
            ])
        }

        export const tools_attach = new ButtonBuilder({
            customId: "tools_attach",
            label: "שיוך צ'אט אליי",
            emoji: "🔀",
            style: ButtonStyle.Success
        });

        export const tools_manager = new ButtonBuilder({
            customId: "tools_manager",
            label: "הגדרות ניהול",
            emoji: '🧑‍💼',
            style: ButtonStyle.Primary
        });

        export const tools_close = new ButtonBuilder({
            customId: "tools_close",
            label: "סגירת צ'אט",
            emoji: '✖️',
            style: ButtonStyle.Danger
        })

        export const tools_report = new ButtonBuilder({
            customId: "tools_report",
            label: "דיווח",
            emoji: '🚩',
            style: ButtonStyle.Secondary
        });

        export const user_report_helper = new ButtonBuilder({
            customId: "user_report_helper",
            label: "דווח על תומך",
            emoji: '🚩',
            style: ButtonStyle.Secondary
        });

        export const user_suggest = new ButtonBuilder({
            customId: "user_suggest",
            label: "יש לי הצעת שיפור",
            emoji: "✅",
            style: ButtonStyle.Success
        })

        export const supporterTools = new ActionRowBuilder<ButtonBuilder>().addComponents([
            tools_close,
            tools_manager,
            tools_report,
            tools_attach,
        ]);

        export const managerTools = new ActionRowBuilder<ButtonBuilder>().addComponents([
            new ButtonBuilder({
                customId: "tools_manager_change_supporter",
                label: "החלפת תומך",
                emoji: '👼',
                style: ButtonStyle.Success,
            }),
            new ButtonBuilder({
                customId: "tools_manager_reveal",
                label: "גילוי משתמש",
                emoji: '👁️',
                style: ButtonStyle.Secondary,
            }),
        ]);

        export function changeHelper(helpers: any[]) {
            const selectMenu = new StringSelectMenuBuilder({
                customId: "helpers_list",
                placeholder: "בחר תומך אחד או יותר",
                minValues: 1,
                maxValues: helpers.length,
            });
            helpers.forEach(helper => {
                selectMenu.addOptions({ label: helper.displayName, description: "Helper", value: helper.id, emoji: '🇭' });
            });
            return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);
        };

        export const resetHelpers = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder({
                label: "מחיקת הרשאות לכל התומכים",
                customId: 'tools_reset_helpers',
                emoji: '🔄',
                style: ButtonStyle.Danger,
            })
        );

    };

    export namespace Modals {

        const reportCause = new TextInputBuilder({
            customId: 'reportCause',
            label: 'סיבת הדיווח',
            style: TextInputStyle.Paragraph,
            required: true
        });

        const reportCauseActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(reportCause);
        export const reportChatModal = new ModalBuilder({
            customId: 'reportModal',
            title: "דיווח על צ'אט חריג"
        }).addComponents(reportCauseActionRow);


        const reportHelperCause = new TextInputBuilder({
            customId: 'reportHelperCause',
            label: 'סיבת הדיווח',
            style: TextInputStyle.Paragraph,
            required: true
        });

        const helperName = new TextInputBuilder({
            customId: 'helperName',
            label: 'שם התומך',
            style: TextInputStyle.Short,
            required: true,
            placeholder: `לדוגמה: D3mocracy#8662`
        });
        const reportHelperCauseActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents([helperName, reportHelperCause]) as any;
        export const reportHelperModal = new ModalBuilder({
            customId: 'reportHelperModal',
            title: "דיווח על תומך"
        }).addComponents(reportHelperCauseActionRow);
    }

} 