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
                author,
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
            })
        }

        export async function reportHelperMessage(interaction: ModalSubmitInteraction, helpers: string) {
            return new EmbedBuilder({
                color: colors.blue,
                title: `התקבל דיווח על תומך`,
                description: `**סיבת הדיווח:**
                ${interaction.fields.getTextInputValue('reportHelperCause')}
                `,
            }).addFields([
                { name: "שם התומך על פי המשתמש", value: `${interaction.fields.getTextInputValue("helperName")}`, inline: true },
                { name: "תומך אחרון שזוהה לפי המערכת", value: `${helpers}`, inline: true },
                { name: "מנהל מטפל", value: `!לא שויך מנהל!` },
            ])
        };
        export const volunteerMessage = new EmbedBuilder({
            color: colors.white,
            title: "הצעת התנדבות",
            description: `לו`,
        });
        export const reportMessage = new EmbedBuilder({
            color: colors.white,
            title: "דיווח על חבר צוות",
            description: `לו`,
        });
        export const suggestIdeasMessage = new EmbedBuilder({
            color: colors.white,
            title: "פידבקים, הצעות ודיווחי באגים",
            description: `לו`,
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
              color: colors.white,
              title: "התקבל טופס להתנדבות בשרת",
              fields: [
                { name: "שם בדיסקורד", value: `${user}`, inline: false },
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
            label: "דווח על חבר צוות",
            emoji: '🏴',
            style: ButtonStyle.Danger
        });

        export const user_suggest = new ButtonBuilder({
            customId: "user_suggest",
            label: "יש לי הצעת שיפור",
            emoji: "✅",
            style: ButtonStyle.Success
        })

        export const user_volunteer = new ButtonBuilder({
            customId: "user_volunteer",
            label: "התנדבות בשרת",
            emoji: '🏴',
            style: ButtonStyle.Secondary
        });
    }

    export namespace Modals {
        //Volunteer modal
        const dateOfBirth = new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder({
            customId: 'date_of_birth',
            label: 'שנת לידה',
            style: TextInputStyle.Short,
            required: true,
            placeholder: "שנת לידה"
        }));

        const aboutYourself = new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder({
            customId: 'about_yourself',
            label: 'ספרו לנו קצת על עצמכם',
            style: TextInputStyle.Paragraph,
            required: true,
            placeholder: 'ספרו לנו קצת על עצמכם'
        }));

        const why = new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder({
            customId: 'why',
            label: 'מדוע אתם מעוניינים להתנדב בשרת?',
            style: TextInputStyle.Paragraph,
            required: true,
            placeholder: 'מדוע אתם מעוניינים להתנדב בשרת?'
        }));

        const freq = new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder({
            customId: 'freq',
            label: 'מהי תדירות הפעילות שלכם בדיסקורד?',
            style: TextInputStyle.Short,
            required: true,
            placeholder: 'מהי תדירות הפעילות שלכם בדיסקורד?'
        }));

        const other = new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder({
            customId: 'other',
            label: 'דברים נוספים שברצונכם לציין',
            style: TextInputStyle.Paragraph,
            required: false,
            placeholder: 'דברים נוספים שברצונכם לציין'
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
            placeholder: "פרט על הרעיון שלך ככל האפשר"
        }));

        const comments = new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder({
            customId: 'suggest_comments',
            label: 'הערות נוספות',
            style: TextInputStyle.Short,
            required: false,
            placeholder: `הערות נוספות שתרצה לכתוב (לא חובה)`
        }));

        export const suggestIdeaModal = new ModalBuilder({
            customId: 'suggestIdea',
            title: "הצעת שיפור / דיווח על באג"
        }).addComponents([explaination, comments]);

        //Report helper modal
        const reportHelperCause = new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder({
            customId: 'reportHelperCause',
            label: 'סיבת הדיווח',
            style: TextInputStyle.Paragraph,
            required: true
        }));

        const helperName = new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder({
            customId: 'helperName',
            label: "שם התומך / מספר הצ'אט",
            style: TextInputStyle.Short,
            minLength: 4,
            required: true,
            placeholder: `לדוגמה: D3mocracy#8662 / צ'אט 43`
        }));

        export const reportHelperModal = new ModalBuilder({
            customId: 'reportHelperModal',
            title: "דיווח על תומך"
        }).addComponents([helperName, reportHelperCause]);
    }
}