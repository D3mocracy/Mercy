import { createTranscript } from "discord-html-transcripts";
import { ExportReturnType } from "discord-html-transcripts/dist/types";
import { TextChannel } from "discord.js";
import { config } from "..";
import { MessageUtils } from "../utils/MessageUtils";
import { Utils } from "../utils/Utils";

namespace Logger {

    export async function logTicket(ticketChannel: TextChannel) {
        const logChannel: TextChannel = await Utils.getChannelById(config.ticketLogId) as any;
        const attachment = await createTranscript(ticketChannel, {
            limit: -1,
            returnType: ExportReturnType.Attachment,
            filename: 'question_log.html',
        });
        await logChannel.send({ embeds: [await MessageUtils.EmbedMessages.ticketLog(ticketChannel.name)], files: [attachment] })
    }

}

export default Logger;