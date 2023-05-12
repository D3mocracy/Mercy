import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, EmbedBuilder, ModalSubmitInteraction, StringSelectMenuBuilder } from "discord.js";
import { Utils } from "../Utils";

export namespace ConversationManageMessageUtils {

    export namespace EmbedMessages {
        const author = { iconURL: 'https://i.imgur.com/ATfQQi7.png', name: 'Mercy - אנונימי' };
        const colors = {
            blue: 0x86b5dd,
            pink: 0xfe929f,
            gold: 0xfcc22d,
            red: 0xff0000,
            green: 0x33C76E
        }

        export function referManager(interaction: ModalSubmitInteraction) {
            return new EmbedBuilder({
                author,
                color: colors.pink,
                title: `התקבלה בקשה חדשה מתומך`,
                description: `${interaction.fields.getTextInputValue('referCause')}`
            }).addFields([
                { name: "תומך:", value: `${interaction.user.tag}` },
                { name: "סטטוס טיפול", value: `לא טופל` },
            ])
        };

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

        export function newChatStaff() {
            return new EmbedBuilder({
                author,
                color: colors.pink,
                title: `ניהול צ'אט נוכחי`,
                description: `משתמש פתח צ'אט, נא לתת סיוע בהתאם!`,
            });
        }

        export async function revealUserMessage(client: Client, userId: string) {
            const user = await Utils.getUserByID(client, userId);
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
    }

    export namespace Actions {
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

        export function markAsDone(isAttached: boolean) {
            return new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder({
                    customId: 'manager_mark_as_done',
                    label: 'סמן כבוצע',
                    disabled: isAttached,
                    emoji: "✔️",
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
            emoji: '⚙️',
            style: ButtonStyle.Primary
        });

        export const tools_close = new ButtonBuilder({
            customId: "tools_close",
            label: "סגירת צ'אט",
            emoji: '✖️',
            style: ButtonStyle.Danger
        })

        export const tools_report = new ButtonBuilder({
            customId: "tools_refer_manager",
            label: "הפנה מנהל",
            emoji: '🧑‍💼',
            style: ButtonStyle.Secondary
        });

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
    }

    export namespace Modals {

    }
}