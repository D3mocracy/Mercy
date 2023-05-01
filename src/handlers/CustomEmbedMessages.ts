import { EmbedBuilder, TextChannel } from "discord.js";
import DataBase from "../utils/db";
import { CustomMessage } from "../utils/types";
import { Utils } from "../utils/Utils";

class CustomEmbedMessages {

    message: CustomMessage = {} as any;

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
        const channel = await Utils.getChannelById(this.channelId) as TextChannel;
        const color: any = !!this.message?.color ? this.message?.color : '#F9E900';
        const embedMessage = new EmbedBuilder({
            author: { iconURL: 'https://i.imgur.com/ATfQQi7.png', name: 'AngeLove - אנונימי' },
            title: this.message.title,
            description: this.message.description
        }).setColor(color);
        await channel.send({ embeds: [embedMessage] })
    }

}

export default CustomEmbedMessages;