"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const discord_js_1 = require("discord.js");
var MessageService;
(function (MessageService) {
    let EmbedMessages;
    (function (EmbedMessages) {
        EmbedMessages.StartConversationAsk = new discord_js_1.EmbedBuilder({
            color: 0x0099ff,
            title: "אתה עומד לפתוח צ'אט אנונימי",
            description: "לחיצה על כפתור ההסכמה תתחיל צ'אט אנונימי עם אחד מחברי הצוות לקבלת עזרה, פריקה ושיתוף. כל הודעה שתכתב אצלך תופיע לאיש צוות בצ'אנל נפרד בשרת הראשי, שים לב שהמערכת אנונימית למעט מקרים העוברים על חוקי המדינה וידרשו פעולות דיווח.",
            footer: { text: "בלחיצה על כפתור ההסכמה אתה מאשר את תנאי השימוש בשרת ומודע לכך שצוות השרת אינו צוות מוסמך" }
        });
    })(EmbedMessages = MessageService.EmbedMessages || (MessageService.EmbedMessages = {}));
    let Components;
    (function (Components) {
        Components.YesNo = new discord_js_1.ActionRowBuilder().addComponents([
            new discord_js_1.ButtonBuilder({
                customId: "yes_conv",
                label: "Yes",
                style: discord_js_1.ButtonStyle.Success
            }),
            new discord_js_1.ButtonBuilder({
                customId: "no_conv",
                label: "No",
                style: discord_js_1.ButtonStyle.Danger
            }),
        ]);
    })(Components = MessageService.Components || (MessageService.Components = {}));
})(MessageService = exports.MessageService || (exports.MessageService = {}));
//# sourceMappingURL=messageService.js.map