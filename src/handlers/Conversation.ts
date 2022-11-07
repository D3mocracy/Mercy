import { Message } from "discord.js"
import { Utils } from "../utils/Utils";
import CommunicateConversationHandler from "./CommunicateConversation";
import StartConversation from "./StartConversation";

class ConversationHandler {
    constructor(private message: Message) {
        this.message = message;
    };

    async handle() {
        const hasOpenConversation = await Utils.hasOpenConversation(this.message.author.id);
        const channel = this.message.channel;

        if (channel.isDMBased() && !hasOpenConversation) {
            await new StartConversation(this.message).askStartConversation();
            return;
        }

        if ((channel.isDMBased() && hasOpenConversation) || await Utils.isTicketChannel(channel)) {
            await new CommunicateConversationHandler(this.message, channel.type).createHandler();
            return;
        }
    };


}

export default ConversationHandler;