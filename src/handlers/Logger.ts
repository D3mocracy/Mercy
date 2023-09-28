import { createTranscript } from "discord-html-transcripts";
import { ExportReturnType } from "discord-html-transcripts/dist/types";
import { DMChannel, TextChannel, User } from "discord.js";
import { MessageUtils } from "../utils/MessageUtils";
import { Utils } from "../utils/Utils";
import ConfigHandler from "./Config";

namespace Logger {

    export async function logTicket(ticketChannel: TextChannel, user?: User) {
        const attachment = await createTranscript(ticketChannel, {
            limit: -1,
            returnType: ExportReturnType.Attachment,
            filename: `chat log ${ticketChannel.name.replaceAll('-', ' ')}.html`,
        });
        await ConfigHandler.config.conversationLog?.send({ embeds: [await MessageUtils.EmbedMessages.ticketLog(ticketChannel.name.replaceAll('-', ' '))], files: [attachment] })
        await user?.send({ embeds: [await MessageUtils.EmbedMessages.ticketLog(ticketChannel.name.replaceAll('-', ' '))], files: [attachment] })
    }

    export async function logError(error: Error) {
        try {
            await ConfigHandler.config.errorChannel?.send({ embeds: [MessageUtils.EmbedMessages.errorLog(error)] });
        } catch (error) {
            console.error(error);
        }
    }

}

export default Logger;