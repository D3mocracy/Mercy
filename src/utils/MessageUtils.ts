import { Client, GuildMember, EmbedBuilder, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, ModalSubmitInteraction, TextChannel } from "discord.js";
import { Utils } from "./Utils";
import ConfigHandler from "../handlers/Config";

export namespace MessageUtils {
    const author = { iconURL: 'https://i.imgur.com/ATfQQi7.png', name: 'Mercy - אנונימי' };
    const colors = {
        blue: 0x86b5dd,
        pink: 0xfe929f,
        gold: 0xfcc22d,
        red: 0xff0000,
        green: 0x33C76E
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

        export function newChatUser(numberOfConversation: number) {
            return new EmbedBuilder({
                author,
                color: colors.pink,
                title: `צ'אט מספר ${numberOfConversation}`,
                description: `צוות השרת קיבל את הודעתכם בהצלחה! כל הודעה שתשלחו כאן תגיע באופן אנונימי לצוות.`,
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



        export async function staffMembers() {
            const managers = await Utils.getUsersWithRoleId(ConfigHandler.config.managerRole.id);
            const helpers = await Utils.getUsersWithRoleId(ConfigHandler.config.helperRole.id);
            return new EmbedBuilder({
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

    };

    export namespace Modals {

        //Refer Manager
        const reportCause = new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder({
            customId: 'referCause',
            label: 'בקשה',
            style: TextInputStyle.Paragraph,
            required: true
        }));

        export const referManagerModal = new ModalBuilder({
            customId: 'referManager',
            title: "שליחת בקשה למנהל / הפנה מנהל"
        }).addComponents(reportCause);




    }

} 