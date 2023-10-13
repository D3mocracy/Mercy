import { createTranscript } from "discord-html-transcripts";
import { ExportReturnType } from "discord-html-transcripts/dist/types";
import { TextChannel, User } from "discord.js";
import { MessageUtils } from "../utils/MessageUtils";
import ConfigHandler from "./Config";

namespace Logger {

    export async function logTicket(ticketChannel: TextChannel, user?: User) {
        const attachment = await createTranscript(ticketChannel, {
            limit: -1,
            returnType: ExportReturnType.Attachment,
            filename: `chat log ${ticketChannel.name.replaceAll('-', ' ')}.html`,
        });
        await ConfigHandler.config.conversationLog?.send({ embeds: [await MessageUtils.EmbedMessages.ticketLog(ticketChannel?.name.replaceAll('-', ' '))], files: [attachment] })
        await user?.send({ embeds: [await MessageUtils.EmbedMessages.ticketLog(ticketChannel?.name.replaceAll('-', ' '))], files: [attachment] })
    }

    export async function logError(error: Error) {
        try {
            await ConfigHandler.config.errorChannel?.send({ content: `${error}`, embeds: [MessageUtils.EmbedMessages.errorLog(error)] });
        } catch (error) {
            console.error(error);
            console.log(error);
        }
    }

    export async function logPunishemnt(punishment: any) {
        try {
            (await ConfigHandler.config.punishmentChannel?.send({
                content: `${ConfigHandler.config.managerRole}`,
                embeds: [MessageUtils.EmbedMessages.punishmentLog(punishment)]
            }))?.edit({ content: null })
        } catch (error: any) {
            await logError(error)
        }
    }

}

export default Logger;