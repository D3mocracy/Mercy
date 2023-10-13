"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMessageUtils = void 0;
const discord_js_1 = require("discord.js");
const builders_1 = require("@discordjs/builders");
var UserMessageUtils;
(function (UserMessageUtils) {
    const author = { iconURL: 'https://i.imgur.com/ATfQQi7.png', name: 'Mercy - אנונימי' };
    let CustomEmbedMessages;
    (function (CustomEmbedMessages) {
        CustomEmbedMessages.subjects = new discord_js_1.EmbedBuilder({
            title: `בחירת נושא הצ'אט`,
            description: `לפני פתיחת הצ'אט יש לבחור את הנושא שעליו אתם מעוניינים לשוחח עליו מהרשימה.\nאם לא קיים נושא רלוונטי, ניתן לבחור באופציה "אחר".`,
            color: 0xffffff
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
            "בריאות",
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
    })(Actions = UserMessageUtils.Actions || (UserMessageUtils.Actions = {}));
})(UserMessageUtils || (exports.UserMessageUtils = UserMessageUtils = {}));
//# sourceMappingURL=UserMU.js.map