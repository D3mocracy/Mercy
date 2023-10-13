"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportantLinksMessageUtils = void 0;
const discord_js_1 = require("discord.js");
const Config_1 = __importDefault(require("../../handlers/Config"));
var ImportantLinksMessageUtils;
(function (ImportantLinksMessageUtils) {
    let EmbedMessages;
    (function (EmbedMessages) {
        const author = { iconURL: 'https://i.imgur.com/ATfQQi7.png', name: 'Mercy - אנונימי' };
        const colors = {
            blue: 0x86b5dd,
            pink: 0xfe929f,
            gold: 0xfcc22d,
            red: 0xff0000,
            green: 0x33C76E,
            white: 0xffffff,
        };
        function mainMessage() {
            return new discord_js_1.EmbedBuilder({
                color: colors.pink,
                thumbnail: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Circle-icons-clipboard.svg/1200px-Circle-icons-clipboard.svg.png" },
                title: "מידע שימושי",
                description: `**לשרותכם מידע ולינקים חשובים בשרת**
                    ${Config_1.default.config.importantChannels?.map(channel => (`<#${Object.keys(channel).toString()}> - ${Object.values(channel)}`)).join('\n')}`,
                footer: { iconURL: author.iconURL, text: "בברכה, הנהלת הקהילה" }
            });
        }
        EmbedMessages.mainMessage = mainMessage;
        function suggestIdea(expain, comments, member) {
            return new discord_js_1.EmbedBuilder({
                title: "התקבל טופס פידבקים, הצעות ודיווחי באגים",
                description: `**תיאור**
                ${expain}

                **הערות נוספות**
                ${comments}`,
                timestamp: new Date(),
                color: colors.green
            });
        }
        EmbedMessages.suggestIdea = suggestIdea;
        function reportHelperMessage(helperName, reportCause) {
            return new discord_js_1.EmbedBuilder({
                color: colors.red,
                title: `התקבל טופס תלונה או דיווח על חבר צוות`,
                description: `**סיבת הדיווח**
                ${reportCause},
                `, timestamp: new Date(),
            }).addFields([
                { name: "שם התומך על פי המשתמש", value: `${helperName}`, inline: true },
                { name: "מנהל מטפל", value: `!לא שויך מנהל!` },
            ]);
        }
        EmbedMessages.reportHelperMessage = reportHelperMessage;
        ;
        EmbedMessages.volunteerMessage = new discord_js_1.EmbedBuilder({
            color: colors.white,
            title: "טופס התנדבות בשרת",
            description: `הנהלת השרת מחפשת מתנדבים בעלי זמן פנוי, יכולת הקשבה והכלה, יכולת לעמוד בעומס רגשי, ויכולות ביטוי גבוהות בכתב.
            אם אתם חושבים שאתם מתאימים אתם מוזמנים להגיש את טופס ההתנדבות בהתאם והנהלת השרת תבחון אותו. אם תמצאו כמתאימים, אחד מהמנהלים יפנה אליכם בהודעה פרטית להמשך התהליך.
            תודה לכם על הנכונות והרצון להתנדב ולהצטרף לצוות השרת!
            **הטופס אינו נשלח באופן אנונימי**`,
        });
        EmbedMessages.reportMessage = new discord_js_1.EmbedBuilder({
            color: colors.white,
            title: "טופס דיווחים ותלונות על חברי צוות",
            description: `אם ברצונכם לדווח על חבר צוות בשרת, יש למלא את טופס התלונה והנושא יועבר למנהלים ויטופל בהתאם.
            **הטופס נשלח באופן אנונימי**`,
        });
        EmbedMessages.suggestIdeasMessage = new discord_js_1.EmbedBuilder({
            color: colors.white,
            title: "טופס פידבקים, הצעות ודיווחי באגים",
            description: `מעוניינים להציע רעיון לשרת? לדווח על באג/בעיה כזו או אחרת, או להעניק משוב ופידבק לגבי השרת והתנהלותו? מוזמנים לבצע זאת בעזרת הטופס!
            **הטופס נשלח באופן אנונימי**`,
        });
        function volunteer(user, dateVolunteer, aboutYourselfVolunteer, whyVolunteer, freqVolunteer, moreVolunteer) {
            return new discord_js_1.EmbedBuilder({
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
        EmbedMessages.volunteer = volunteer;
    })(EmbedMessages = ImportantLinksMessageUtils.EmbedMessages || (ImportantLinksMessageUtils.EmbedMessages = {}));
    let Actions;
    (function (Actions) {
        Actions.user_report_helper = new discord_js_1.ButtonBuilder({
            customId: "user_report_helper",
            label: "דיווחים ותלונות על חברי צוות",
            emoji: '⚠️',
            style: discord_js_1.ButtonStyle.Danger
        });
        Actions.user_suggest = new discord_js_1.ButtonBuilder({
            customId: "user_suggest",
            label: "פידבקים, הצעות ודיווחי באגים",
            emoji: "💡",
            style: discord_js_1.ButtonStyle.Success
        });
        Actions.user_volunteer = new discord_js_1.ButtonBuilder({
            customId: "user_volunteer",
            label: "התנדבות בשרת",
            emoji: '🤍',
            style: discord_js_1.ButtonStyle.Primary
        });
    })(Actions = ImportantLinksMessageUtils.Actions || (ImportantLinksMessageUtils.Actions = {}));
    let Modals;
    (function (Modals) {
        //Volunteer modal
        const dateOfBirth = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder({
            customId: 'date_of_birth',
            label: 'שנת לידה',
            style: discord_js_1.TextInputStyle.Short,
            required: true,
            min_length: 4,
            max_length: 4,
            placeholder: "ציינו את שנת הלידה שלכם"
        }));
        const aboutYourself = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder({
            customId: 'about_yourself',
            label: 'ספרו לנו קצת על עצמכם',
            style: discord_js_1.TextInputStyle.Paragraph,
            required: true,
            min_length: 20,
            max_length: 300,
            placeholder: `תעסוקה, תחביבים, תחומי עניין וכל דבר אחר שתרצו לשתף`
        }));
        const why = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder({
            customId: 'why',
            label: 'מדוע אתם מעוניינים להתנדב בשרת?',
            style: discord_js_1.TextInputStyle.Paragraph,
            required: true,
            min_length: 20,
            max_length: 300,
            placeholder: 'ציינו את הסיבות מדוע אתם מעוניינים להתנדב בשרת'
        }));
        const freq = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder({
            customId: 'freq',
            label: 'מהי תדירות הפעילות שלכם בדיסקורד?',
            style: discord_js_1.TextInputStyle.Short,
            required: true,
            max_length: 50,
            placeholder: `לדוגמה: פעם בשבוע, כשעה ביום, כ-5 שעות ביום וכדומה`
        }));
        const other = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder({
            customId: 'other',
            label: 'דברים נוספים שברצונכם לציין',
            style: discord_js_1.TextInputStyle.Paragraph,
            required: false,
            max_length: 200,
            placeholder: 'לא חובה'
        }));
        Modals.volunteerModal = new discord_js_1.ModalBuilder({
            customId: 'volunteer_modal',
            title: "התנדבות בשרת",
        }).addComponents([dateOfBirth, aboutYourself, why, freq, other]);
        //Suggest idea modal
        const explaination = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder({
            customId: 'suggest_explain',
            label: 'פירוט',
            style: discord_js_1.TextInputStyle.Paragraph,
            required: true,
            min_length: 10,
            max_length: 300,
            placeholder: "פירוט הפידבק/ההצעה/הדיווח"
        }));
        const comments = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder({
            customId: 'suggest_comments',
            label: "דברים נוספים שברצונכם לציין",
            style: discord_js_1.TextInputStyle.Short,
            required: false,
            max_length: 200,
            placeholder: "לא חובה"
        }));
        Modals.suggestIdeaModal = new discord_js_1.ModalBuilder({
            customId: 'suggestIdea',
            title: "פידבקים, הצעות ודיווחי באגים"
        }).addComponents([explaination, comments]);
        //Report helper modal
        const reportHelperCause = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder({
            customId: 'reportHelperCause',
            label: 'סיבת הדיווח',
            style: discord_js_1.TextInputStyle.Paragraph,
            placeholder: "פרטו על סיבת הדיווח",
            min_length: 10,
            max_length: 300,
            required: true
        }));
        const helperName = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder({
            customId: 'helperName',
            label: "שם חבר הצוות ו/או מספר הצ'אט הרלוונטי",
            style: discord_js_1.TextInputStyle.Short,
            required: true,
            max_length: 20,
            placeholder: `לדוגמה: מאי / צ'אט 45`
        }));
        Modals.reportHelperModal = new discord_js_1.ModalBuilder({
            customId: 'reportHelperModal',
            title: "דיווחים ותלונות על חברי צוות"
        }).addComponents([helperName, reportHelperCause]);
    })(Modals = ImportantLinksMessageUtils.Modals || (ImportantLinksMessageUtils.Modals = {}));
})(ImportantLinksMessageUtils || (exports.ImportantLinksMessageUtils = ImportantLinksMessageUtils = {}));
//# sourceMappingURL=ImportantLinks.js.map