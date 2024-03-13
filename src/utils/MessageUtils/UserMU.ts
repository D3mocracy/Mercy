import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import CustomEmbedMessages from "../../handlers/CustomEmbedMessages";
import { StringSelectMenuBuilder } from "@discordjs/builders";

export namespace UserMessageUtils {
    const author = { iconURL: 'https://i.imgur.com/ATfQQi7.png', name: 'Mercy - אנונימי' };
    const colors = {
        blue: 0x86b5dd,
        pink: 0xfe929f,
        gold: 0xfcc22d,
        red: 0xff0000,
        green: 0x33c76e,
        white: 0xffffff,
      };
    export namespace CustomEmbedMessages {
        export const subjects = new EmbedBuilder({
            title: `בחירת נושא הצ'אט`,
            description: `לפני פתיחת הצ'אט יש לבחור את הנושא שעליו אתם מעוניינים לשוחח עליו מהרשימה.\nאם לא קיים נושא רלוונטי, ניתן לבחור באופציה "אחר".`,
            color: colors.white
        });

        export const noMessageForTwentyFourHours = new EmbedBuilder({
            title: "לא שמענו מכם זמן מה, האם אתם מעוניינים להמשיך בשיחה?",
            color: colors.white
        })

        export const userWantsToContinueConversation = new EmbedBuilder({
          title: "המשתמש בחר להמשיך את השיחה",
          color: colors.green
      })
    }
    export namespace Actions {
        const subjects = [
            "משפחה",
            "חברים",
            "אהבה וזוגיות",
            "יחסי מין",
            "גוף ונפש",
            "בריאות ותזונה",
            "קריירה",
            "צבא",
            "לימודים",
            "כסף",
            "אחר"
        ]
        export const selectSubject = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder({
                custom_id: "select_subject",
                placeholder: "בחר נושא",
                options: subjects.map(subject => ({ label: subject, value: subject }))
            })
        );

        export function unActiveChannelButtons(disabled: boolean) {
            return new ActionRowBuilder<ButtonBuilder>().addComponents(
              [new ButtonBuilder({
                customId: "unactive_close_chat",
                label: "לא (סגירת הצ'אט)",
                disabled,
                style: ButtonStyle.Danger,
              }),
              new ButtonBuilder({
                customId: "unactive_continue_chat",
                label: "כן",
                disabled,
                style: ButtonStyle.Success,
              })
              ]
            );
          }
    }
}