import { createTranscript } from "discord-html-transcripts";
import { ExportReturnType } from "discord-html-transcripts/dist/types";
import { TextChannel } from "discord.js";
import { MessageUtils } from "../utils/MessageUtils";
import { Utils } from "../utils/Utils";
import ConfigHandler from "./Config";

namespace Logger {

    export async function logTicket(ticketChannel: TextChannel) {
        const logChannel: TextChannel = ConfigHandler.config.conversationLog;
        const attachment = await createTranscript(ticketChannel, {
            limit: -1,
            returnType: ExportReturnType.Attachment,
            filename: 'question_log.html',
        });
        await logChannel.send({ embeds: [await MessageUtils.EmbedMessages.ticketLog(ticketChannel.name.replaceAll('-', ' '))], files: [attachment] })
    }

    export async function logError(error: Error) {
        try {
            const errorChannel = ConfigHandler.config.errorChannel;
            console.log(errorChannel)
            await errorChannel.send({ embeds: [MessageUtils.EmbedMessages.errorLog(error)] });
        } catch (error) {
            console.error(error);
        }
    }

}

export default Logger;