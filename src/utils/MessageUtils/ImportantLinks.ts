import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, GuildMember, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle, User } from "discord.js";
import ConfigHandler from "../../handlers/Config";

export namespace ImportantLinksMessageUtils {

    export namespace EmbedMessages {
        const author = { iconURL: 'https://i.imgur.com/ATfQQi7.png', name: 'Mercy - אנונימי' };
        const colors = {
            blue: 0x86b5dd,
            pink: 0xfe929f,
            gold: 0xfcc22d,
            red: 0xff0000,
            green: 0x33C76E,
            white: 0xffffff,
        }
        export function mainMessage() {
            return new EmbedBuilder({
                color: colors.pink,
                thumbnail: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Circle-icons-clipboard.svg/1200px-Circle-icons-clipboard.svg.png" },
                title: "מידע שימושי",
                description: `**לשרותכם מידע ולינקים חשובים בשרת**
                    ${ConfigHandler.config.importantChannels?.map(channel => (
                    `<#${Object.keys(channel).toString()}> - ${Object.values(channel)}`
                )).join('\n')}`,

                footer: { iconURL: author.iconURL, text: "בברכה, הנהלת הקהילה" }
            })
        }



        export function suggestIdea(expain: string, comments: string, member: GuildMember) {
            return new EmbedBuilder({
                title: "התקבל טופס פידבקים, הצעות ודיווחי באגים",
                description: `**תיאור**
                ${expain}

                **הערות נוספות**
                ${comments}`,
                timestamp: new Date(),
                color: colors.green
            })
        }

        export function reportHelperMessage(helperName: string, reportCause: string) {
            return new EmbedBuilder({
                color: colors.red,
                title: `התקבל טופס תלונה או דיווח על חבר צוות`,
                description: `**סיבת הדיווח**
                ${reportCause},
                `, timestamp: new Date(),
            }).addFields([
                { name: "שם התומך על פי המשתמש", value: `${helperName}`, inline: true },
                { name: "מנהל מטפל", value: `!לא שויך מנהל!` },
            ])
        };
        export const volunteerMessage = new EmbedBuilder({
            color: colors.white,
            title: "טופס התנדבות בשרת",
            description: `הנהלת השרת מחפשת מתנדבים בעלי זמן פנוי, יכולת הקשבה והכלה, יכולת לעמוד בעומס רגשי, ויכולות ביטוי גבוהות בכתב.
            אם אתם חושבים שאתם מתאימים אתם מוזמנים להגיש את טופס ההתנדבות בהתאם והנהלת השרת תבחון אותו. אם תמצאו כמתאימים, אחד מהמנהלים יפנה אליכם בהודעה פרטית להמשך התהליך.
            תודה לכם על הנכונות והרצון להתנדב ולהצטרף לצוות השרת!
            **הטופס אינו נשלח באופן אנונימי**`,
        });
        export const reportMessage = new EmbedBuilder({
            color: colors.white,
            title: "טופס דיווחים ותלונות על חברי צוות",
            description: `אם ברצונכם לדווח על חבר צוות בשרת, יש למלא את טופס התלונה והנושא יועבר למנהלים ויטופל בהתאם.
            **הטופס נשלח באופן אנונימי**`,
        });
        export const suggestIdeasMessage = new EmbedBuilder({
            color: colors.white,
            title: "טופס פידבקים, הצעות ודיווחי באגים",
            description: `מעוניינים להציע רעיון לשרת? לדווח על באג/בעיה כזו או אחרת, או להעניק משוב ופידבק לגבי השרת והתנהלותו? מוזמנים לבצע זאת בעזרת הטופס!
            **הטופס נשלח באופן אנונימי**`,
        });
        export function volunteer(
            user: User,
            dateVolunteer: string,
            aboutYourselfVolunteer: string,
            whyVolunteer: string,
            freqVolunteer: string,
            moreVolunteer: string
        ) {
            return new EmbedBuilder({
                color: colors.blue,
                title: "התקבל טופס התנדבות בשרת",
                fields: [
                    { name: "משתמש", value: `${user}`, inline: false },
                    { name: "שנת לידה", value: dateVolunteer, inline: false },
                    { name: "ספרו לנו קצת על עצמכם", value: aboutYourselfVolunteer, inline: false },
                    { name: "מדוע אתם רוצים להתנדב בשרת?", value: whyVolunteer, inline: false },
                    { name: "מהי תדירות הפעילות הכללית שלכם בדיסקורד?", value: freqVolunteer, inline: false },
                    { name: "דברים נוספים שברצונכם לציין", value: moreVolunteer, inline: false },
                ],
                timestamp: new Date(),
            });
        }
    }


    export namespace Actions {
        export const user_report_helper = new ButtonBuilder({
            customId: "user_report_helper",
            label: "דיווחים ותלונות על חברי צוות",
            emoji: '⚠️',
            style: ButtonStyle.Danger
        });

        export const user_suggest = new ButtonBuilder({
            customId: "user_suggest",
            label: "פידבקים, הצעות ודיווחי באגים",
            emoji: "💡",
            style: ButtonStyle.Success
        })

        export const user_volunteer = new ButtonBuilder({
            customId: "user_volunteer",
            label: "התנדבות בשרת",
            emoji: '🤍',
            style: ButtonStyle.Primary
        });
    }

    export namespace Modals {
        //Volunteer modal
        const dateOfBirth = new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder({
            customId: 'date_of_birth',
            label: 'שנת לידה',
            style: TextInputStyle.Short,
            required: true,
            min_length: 4,
            max_length: 4,
            placeholder: "ציינו את שנת הלידה שלכם"
        }));

        const aboutYourself = new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder({
            customId: 'about_yourself',
            label: 'ספרו לנו קצת על עצמכם',
            style: TextInputStyle.Paragraph,
            required: true,
            min_length: 20,
            max_length: 300,
            placeholder: `תעסוקה, תחביבים, תחומי עניין וכל דבר אחר שתרצו לשתף`
        }));

        const why = new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder({
            customId: 'why',
            label: 'מדוע אתם מעוניינים להתנדב בשרת?',
            style: TextInputStyle.Paragraph,
            required: true,
            min_length: 20,
            max_length: 300,
            placeholder: 'ציינו את הסיבות מדוע אתם מעוניינים להתנדב בשרת'
        }));

        const freq = new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder({
            customId: 'freq',
            label: 'מהי תדירות הפעילות שלכם בדיסקורד?',
            style: TextInputStyle.Short,
            required: true,
            max_length: 50,
            placeholder: `לדוגמה: פעם בשבוע, כשעה ביום, כ-5 שעות ביום וכדומה`
        }));

        const other = new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder({
            customId: 'other',
            label: 'דברים נוספים שברצונכם לציין',
            style: TextInputStyle.Paragraph,
            required: false,
            max_length: 200,
            placeholder: 'לא חובה'
        }));


        export const volunteerModal = new ModalBuilder({
            customId: 'volunteer_modal',
            title: "התנדבות בשרת",
        }).addComponents([dateOfBirth, aboutYourself, why, freq, other]);

        //Suggest idea modal
        const explaination = new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder({
            customId: 'suggest_explain',
            label: 'פירוט',
            style: TextInputStyle.Paragraph,
            required: true,
            min_length: 10,
            max_length: 300,
            placeholder: "פירוט הפידבק/ההצעה/הדיווח"
        }));

        const comments = new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder({
            customId: 'suggest_comments',
            label: "דברים נוספים שברצונכם לציין",
            style: TextInputStyle.Short,
            required: false,
            max_length: 200,
            placeholder: "לא חובה"
        }));

        export const suggestIdeaModal = new ModalBuilder({
            customId: 'suggestIdea',
            title: "פידבקים, הצעות ודיווחי באגים"
        }).addComponents([explaination, comments]);

        //Report helper modal
        const reportHelperCause = new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder({
            customId: 'reportHelperCause',
            label: 'סיבת הדיווח',
            style: TextInputStyle.Paragraph,
            placeholder: "פרטו על סיבת הדיווח",
            min_length: 10,
            max_length: 300,
            required: true
        }));

        const helperName = new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder({
            customId: 'helperName',
            label: "שם חבר הצוות ו/או מספר הצ'אט הרלוונטי",
            style: TextInputStyle.Short,
            required: true,
            max_length: 20,
            placeholder: `לדוגמה: מאי / צ'אט 45`
        }));

        export const reportHelperModal = new ModalBuilder({
            customId: 'reportHelperModal',
            title: "דיווחים ותלונות על חברי צוות"
        }).addComponents([helperName, reportHelperCause]);
    }
}