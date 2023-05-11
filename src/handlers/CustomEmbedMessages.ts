import { EmbedBuilder, TextChannel, EmbedData } from "discord.js";
import DataBase from "../utils/db";
import { Utils } from "../utils/Utils";

class CustomEmbedMessages {

    message: EmbedData = {} as any;

    private constructor(private key: string, private channelId: string) {
        this.key = key;
        this.channelId = channelId;
    }

    async load() {
        this.message = await DataBase.embedMessagesCollection.findOne({ key: this.key }) as any;
    }

    static getKeyFromMessage(message: string) {
        return message.split('&')[1];
    }

    static async createHandler(key: string, channelId: string) {
        const handler = new CustomEmbedMessages(key, channelId);
        await handler.load();
        return handler;
    }

    async sendMessage() {
        (await Utils.getChannelById(this.channelId) as TextChannel).send({
            embeds: [
                new EmbedBuilder({
                    ...this.message,
                    color: undefined,
                }).setColor(this.message.color as any)
            ]
        });
    }

}

export default CustomEmbedMessages;