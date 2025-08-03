import {
  Client,
  GuildMember,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  StringSelectMenuBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ModalSubmitInteraction,
  TextChannel,
  User,
} from "discord.js";
import { Utils } from "./Utils";
import ConfigHandler from "../handlers/Config";

export namespace MessageUtils {
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

  export namespace EmbedMessages {
    export const StartConversationAsk = new EmbedBuilder({
      color: colors.white,
      title: "אתם עומדים לפתוח צ'אט אנונימי",
      description:
        "לחיצה על כפתור ההסכמה תפתח צ'אט אנונימי עם אחד מחברי צוות השרת, וכל הודעה שתשלחו תופיע לאיש הצוות בצ'אנל נפרד בשרת. אתם מוזמנים לשתף אותנו בכל אשר על ליבכם - ברגשות, במחשבות, בבעיות ובפחדים, והצוות ישמח להעניק לכם מענה חם ואוהב בחזרה. שימו לב כי המערכת אנונימית - למעט מקרים העוברים על חוקי המדינה או מקרים חריגים אחרים אשר ידרשו פעולות דיווח.",
      footer: {
        text: "בלחיצה על כפתור ההסכמה אתם מאשרים את תנאי השימוש של השרת ומודעים לכך שצוות השרת אינו צוות מוסמך או מקצועי.",
      },
    });

    export const chatIsNotAvailable = new EmbedBuilder({
      color: colors.white,
      title: "צ'אט לא פעיל",
      description:
        "צ'אט זה לא פעיל יותר עקב סגירתו ולכן לא ניתן לבצע בו פעולות נוספות",
      footer: { text: "למידע נוסף ניתן לפנות לצוות השרת" },
    });

    export function errorLog(error: Error) {
      return new EmbedBuilder({
        title: `שגיאה נזרקה! - ${error.name}`,
        description: `${error.message}`,
        fields: [{ name: "Cause", value: `${error.cause}` }],
        color: colors.red,
        timestamp: new Date(),
      });
    }

    export function punishmentLog(punishment: any) {
      const punishConvert: any = {
        kick: "קיק",
        ban: "באן",
        timeout: "טיים אאוט"
      }
      const punishType = punishment.punishType;
      
      // Handle WhatsApp vs Discord users
      let punishedUserInfo: string;
      if (punishment.source === 'whatsapp' && punishment.whatsappNumber) {
        punishedUserInfo = `${punishment.whatsappNumber} (וואטסאפ)`;
      } else {
        const discordMember = Utils.getMemberByID(punishment.userId);
        punishedUserInfo = discordMember ? `${discordMember}` : punishment.userId || 'לא זמין';
      }
      
      return new EmbedBuilder({
        title: "התקבלה ענישה חדשה",
        description: `
          **המוענש**
          ${punishedUserInfo}

          **המעניש**
          ${Utils.getMemberByID(punishment.punisherId)}

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

    export function newChatUser(numberOfConversation: number) {
      return new EmbedBuilder({
        color: colors.white,
        title: `צ'אט ${numberOfConversation}`,
        description: `צוות השרת קיבל את הודעתכם בהצלחה! כל הודעה שתשלחו כאן תגיע באופן אנונימי לצוות.`,
      });
    }

    export function reopenChatUser(numberOfConversation: number) {
      return new EmbedBuilder({
        color: colors.white,
        title: `צ'אט ${numberOfConversation}`,
        description: `הצ'אט נפתח מחדש בהצלחה! כל הודעה שתשלחו כאן תגיע באופן אנונימי לצוות.`,
      });
    }

    export async function ticketLog(channelTitle: string) {
      return new EmbedBuilder({
        color: colors.white,
        title: `לוג ${channelTitle}`,
        description:
          "על מנת לראות את לוג הצ'אט יש להוריד את קובץ ה-html ולפתוח אותו במחשב",
      });
    }

    export const openChat = new EmbedBuilder({
      color: colors.white,
      title: `אתם לא לבד - דברו איתנו!`,
      description: `
      אנחנו מזמינים אתכם לפנות אלינו באמצעות הצ'אט האנונימי ונשמח להעניק עבורכם אוזן קשבת, תמיכה וייעוץ לכל חברי השרת. תרגישו חופשי לשתף אותנו ברגשות, במחשבות, בבעיות ובפחדים שלכם - ונשמח להעניק לכם מענה חם ואוהב בחזרה!\n
            **שימו 🤍, לחיצה על הכפתור מהווה את אישורכם לתנאי השימוש.**
            `,
    });

    export const sureMessageToClose = new EmbedBuilder({
      color: colors.red,
      title: "האם אתם בטוחים שברצונכם לסגור את הצ'אט?",
      description: "פעולה זו אינה הפיכה!",
    });

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
    };

    export function helperOfTheMonth(helper: GuildMember) {
      const nameOfMonth = monthNames[new Date().getMonth()];
      return new EmbedBuilder({
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

    export function helperitOfTheMonth(helper: GuildMember) {
      const nameOfMonth = monthNames[new Date().getMonth()];
      return new EmbedBuilder({
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

    export function staffMembers() {
      const managerRole = ConfigHandler.config.managerRole?.members;
      const helperRole = ConfigHandler.config.helperRole?.members;

      return new EmbedBuilder({
        author,
        color: colors.pink,
        thumbnail: {
          url: "https://cdn-icons-png.flaticon.com/512/2332/2332039.png",
        },
        title: "צוות השרת",
        description: `**מנהלים:**
                ${managerRole?.map((manager: any) => `${manager.user}`)}

                **תומכים:**
                ${helperRole?.map((helper: any) => `${helper.user}`).join("\n")}
                `,

        footer: {
          iconURL: author.iconURL,
          text: "תמיד כאן בשבילכם! - הנהלת הקהילה",
        },
      });
    }

    export function vacation(
      helperMember: GuildMember,
      vacationType: string,
      dateOne: string,
      dateTwo: string,
      cause: string
    ) {
      return new EmbedBuilder({
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
  }

  export namespace Actions {
    export const openChatButton =
      new ActionRowBuilder<ButtonBuilder>().addComponents([
        new ButtonBuilder({
          customId: "openChatButton",
          label: "פתיחת צ'אט אנונימי",
          style: ButtonStyle.Primary,
        }),
      ]);

    export function linkButton(url: string, label: string) {
      return new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder({
          style: ButtonStyle.Link,
          label,
          url,
        })
      );
    }

    export function disabledGreyButton(label: string) {
      return new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder({
          style: ButtonStyle.Secondary,
          label,
          disabled: true,
          customId: "disabledButton",
        })
      );
    }

    export function disabledGreenButton(label: string) {
      return new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder({
          style: ButtonStyle.Success,
          label,
          disabled: true,
          customId: "disabledButtonGreen",
        })
      );
    }
  }

  export namespace Modals {
    //Refer Manager
    const reportCause = new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder({
        customId: "referCause",
        label: "פירוט סיבת ההפנייה",
        max_length: 100,
        style: TextInputStyle.Paragraph,
        required: true,
      })
    );

    export const referManagerModal = new ModalBuilder({
      customId: "referManager",
      title: "הפניית מפקח",
    }).addComponents(reportCause);

    //Ask Vacation
    const vacationType = new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder({
        customId: "vacation_type",
        label: "סוג",
        style: TextInputStyle.Short,
        placeholder: "היעדרות או הפחתת פעילות",
        required: true,
      })
    );

    const date1 = new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder({
        customId: "vacation_date_one",
        label: "מהתאריך",
        style: TextInputStyle.Short,
        placeholder: "יש לציין את התאריך הרלוונטי",
        required: true,
      })
    );

    const date2 = new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder({
        customId: "vacation_date_two",
        label: "עד התאריך",
        style: TextInputStyle.Short,
        placeholder: `ניתן להשאיר ריק אם מדובר ביום אחד`,
        required: false,
      })
    );

    const causeVacation =
      new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder({
          customId: "vacation_cause",
          label: "סיבה",
          style: TextInputStyle.Paragraph,
          placeholder: `לא חובה`,
          required: false,
        })
      );

    export const vacationModal = new ModalBuilder({
      customId: "vacationModal",
      title: "בקשה להיעדרות או להפחתת פעילות",
    }).addComponents([vacationType, date1, date2, causeVacation]);

    //Volunteer
    const nameVolunteer =
      new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder({
          customId: "volunteer_name",
          label: "שם או כינוי",
          style: TextInputStyle.Short,
          placeholder: `חובה`,
          required: true,
        })
      );

    const dateVolunteer =
      new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder({
          customId: "volunteer_date",
          label: "שנת לידה",
          style: TextInputStyle.Short,
          placeholder: `חובה`,
          required: true,
        })
      );

    const aboutYourselfVolunteer =
      new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder({
          customId: "volunteer_about_yourself",
          label: "ספרו לנו קצת על עצמכם",
          style: TextInputStyle.Paragraph,
          placeholder: `חובה`,
          required: true,
        })
      );

    const whyVolunteer = new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder({
        customId: "volunteer_why",
        label: "מדוע אתם רוצים להתנדב בשרת?",
        style: TextInputStyle.Paragraph,
        placeholder: `חובה`,
        required: true,
      })
    );

    const freqVolunteer =
      new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder({
          customId: "volunteer_freq",
          label: "מהי תדירות הפעילות הכללית שלכם בדיסקורד?",
          style: TextInputStyle.Short,
          placeholder: `חובה`,
          required: true,
        })
      );

    const moreVolunteer =
      new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder({
          customId: "volunteer_more",
          label: "דברים נוספים שברצונכם לציין",
          style: TextInputStyle.Paragraph,
          placeholder: `לא חובה`,
          required: false,
        })
      );

    export const volunteerModal = new ModalBuilder({
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
  }
}
