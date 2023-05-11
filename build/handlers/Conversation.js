"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../utils/Utils");
const CommunicateConversation_1 = __importDefault(require("./CommunicateConversation"));
const StartConversation_1 = __importDefault(require("./StartConversation"));
class ConversationHandler {
    message;
    constructor(message) {
        this.message = message;
        this.message = message;
    }
    ;
    async handle() {
        const hasOpenConversation = await Utils_1.Utils.hasOpenConversation(this.message.author.id);
        const channel = this.message.channel;
        if (channel.isDMBased() && !hasOpenConversation) {
            await new StartConversation_1.default(this.message).askStartConversation();
            return;
        }
        if ((channel.isDMBased() && hasOpenConversation) || await Utils_1.Utils.isTicketChannel(channel)) {
            await new CommunicateConversation_1.default(this.message, channel.type).createHandler();
            return;
        }
    }
    ;
}
exports.default = ConversationHandler;
//# sourceMappingURL=Conversation.js.map