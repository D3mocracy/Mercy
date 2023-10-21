import { ActionRowBuilder, EmbedBuilder } from "discord.js";
import CustomEmbedMessages from "../../handlers/CustomEmbedMessages";
import { StringSelectMenuBuilder } from "@discordjs/builders";

export namespace UserMessageUtils {
    const author = { iconURL: 'https://i.imgur.com/ATfQQi7.png', name: 'Mercy - אנונימי' };
    export namespace CustomEmbedMessages {
        export const subjects = new EmbedBuilder({
            title: `בחירת נושא הצ'אט`,
            description: `לפני פתיחת הצ'אט יש לבחור את הנושא שעליו אתם מעוניינים לשוחח עליו מהרשימה.\nאם לא קיים נושא רלוונטי, ניתן לבחור באופציה "אחר".`,
            color: 0xffffff
        });
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
        )
    }
}