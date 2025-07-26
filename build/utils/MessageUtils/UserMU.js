"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMessageUtils = void 0;
const discord_js_1 = require("discord.js");
const builders_1 = require("@discordjs/builders");
var UserMessageUtils;
(function (UserMessageUtils) {
    const author = { iconURL: 'https://i.imgur.com/ATfQQi7.png', name: 'Mercy - אנונימי' };
    const colors = {
        blue: 0x86b5dd,
        pink: 0xfe929f,
        gold: 0xfcc22d,
        red: 0xff0000,
        green: 0x33c76e,
        white: 0xffffff,
    };
    let CustomEmbedMessages;
    (function (CustomEmbedMessages) {
        CustomEmbedMessages.subjects = new discord_js_1.EmbedBuilder({
            title: `בחירת נושא הצ'אט`,
            description: `לפני פתיחת הצ'אט יש לבחור את הנושא שעליו אתם מעוניינים לשוחח עליו מהרשימה.\nאם לא קיים נושא רלוונטי, ניתן לבחור באופציה "אחר".`,
            color: colors.white
        });
        CustomEmbedMessages.noMessageForTwentyFourHours = new discord_js_1.EmbedBuilder({
            title: "לא שמענו מכם זמן מה, האם אתם מעוניינים להמשיך בשיחה?",
            color: colors.white
        });
        CustomEmbedMessages.userWantsToContinueConversation = new discord_js_1.EmbedBuilder({
            title: "המשתמש בחר להמשיך את השיחה",
            color: colors.green
        });
    })(CustomEmbedMessages = UserMessageUtils.CustomEmbedMessages || (UserMessageUtils.CustomEmbedMessages = {}));
    let Actions;
    (function (Actions) {
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
        ];
        Actions.selectSubject = new discord_js_1.ActionRowBuilder().addComponents(new builders_1.StringSelectMenuBuilder({
            custom_id: "select_subject",
            placeholder: "בחר נושא",
            options: subjects.map(subject => ({ label: subject, value: subject }))
        }));
        function unActiveChannelButtons(disabled) {
            return new discord_js_1.ActionRowBuilder().addComponents([new discord_js_1.ButtonBuilder({
                    customId: "unactive_close_chat",
                    label: "לא (סגירת הצ'אט)",
                    disabled,
                    style: discord_js_1.ButtonStyle.Danger,
                }),
                new discord_js_1.ButtonBuilder({
                    customId: "unactive_continue_chat",
                    label: "כן",
                    disabled,
                    style: discord_js_1.ButtonStyle.Success,
                })
            ]);
        }
        Actions.unActiveChannelButtons = unActiveChannelButtons;
    })(Actions = UserMessageUtils.Actions || (UserMessageUtils.Actions = {}));
})(UserMessageUtils = exports.UserMessageUtils || (exports.UserMessageUtils = {}));
//# sourceMappingURL=UserMU.js.map