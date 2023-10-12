"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_html_transcripts_1 = require("discord-html-transcripts");
const types_1 = require("discord-html-transcripts/dist/types");
const MessageUtils_1 = require("../utils/MessageUtils");
const Config_1 = __importDefault(require("./Config"));
var Logger;
(function (Logger) {
    async function logTicket(ticketChannel, user) {
        const attachment = await (0, discord_html_transcripts_1.createTranscript)(ticketChannel, {
            limit: -1,
            returnType: types_1.ExportReturnType.Attachment,
            filename: `chat log ${ticketChannel.name.replaceAll('-', ' ')}.html`,
        });
        await Config_1.default.config.conversationLog?.send({ embeds: [await MessageUtils_1.MessageUtils.EmbedMessages.ticketLog(ticketChannel.name.replaceAll('-', ' '))], files: [attachment] });
        await user?.send({ embeds: [await MessageUtils_1.MessageUtils.EmbedMessages.ticketLog(ticketChannel.name.replaceAll('-', ' '))], files: [attachment] });
    }
    Logger.logTicket = logTicket;
    async function logError(error) {
        try {
            await Config_1.default.config.errorChannel?.send({ embeds: [MessageUtils_1.MessageUtils.EmbedMessages.errorLog(error)] });
        }
        catch (error) {
            console.error(error);
        }
    }
    Logger.logError = logError;
    async function logPunishemnt(punishment) {
        try {
            (await Config_1.default.config.punishmentChannel?.send({
                content: `${Config_1.default.config.managerRole}`,
                embeds: [MessageUtils_1.MessageUtils.EmbedMessages.punishmentLog(punishment)]
            }))?.edit({ content: null });
        }
        catch (error) {
            await logError(error);
        }
    }
    Logger.logPunishemnt = logPunishemnt;
})(Logger || (Logger = {}));
exports.default = Logger;
//# sourceMappingURL=Logger.js.map