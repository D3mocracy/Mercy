import { EmbedData } from "discord.js";
declare class CustomEmbedMessages {
    private key;
    private channelId;
    message: EmbedData;
    private constructor();
    load(): Promise<void>;
    static getKeyFromMessage(message: string): string;
    static createHandler(key: string, channelId: string): Promise<CustomEmbedMessages>;
    sendMessage(): Promise<void>;
}
export default CustomEmbedMessages;
//# sourceMappingURL=CustomEmbedMessages.d.ts.map