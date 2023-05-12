import { EmbedBuilder, TextChannel, EmbedData, Client } from "discord.js";
import DataBase from "../utils/db";
import { Utils } from "../utils/Utils";

class CustomEmbedMessages {

    message: EmbedData = {} as any;

    private constructor(private client: Client, private key: string, private channelId: string) {
        this.key = key;
        this.channelId = channelId;
    }

    async load() {
        return this.message = await DataBase.embedMessagesCollection.findOne({ key: this.key }) as any;
    }

    static getKeyFromMessage(message: string) {
        return message.split('&')[1];
    }

    static async createHandler(client: Client, key: string, channelId: string) {
        const handler = new CustomEmbedMessages(client, key, channelId);
        const message = await handler.load();
        if (message) {
            return handler;
        } else { return; }
    }

    async sendMessage() {
        (Utils.getChannelById(this.client, this.channelId) as TextChannel).send({
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