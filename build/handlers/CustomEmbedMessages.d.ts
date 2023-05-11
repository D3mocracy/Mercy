import { EmbedData, Client } from "discord.js";
declare class CustomEmbedMessages {
    private client;
    private key;
    private channelId;
    message: EmbedData;
    private constructor();
    load(): Promise<any>;
    static getKeyFromMessage(message: string): string;
    static createHandler(client: Client, key: string, channelId: string): Promise<CustomEmbedMessages | undefined>;
    sendMessage(): Promise<void>;
}
export default CustomEmbedMessages;
//# sourceMappingURL=CustomEmbedMessages.d.ts.map