"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../utils/db"));
class ConfigHandler {
    bot;
    static config = {
        conversationCatagory: "",
        conversationLog: {},
        reportChannel: {},
        requestHelperChannel: {},
        staffChannel: {},
        errorChannel: {},
        suggestIdeasChannel: {},
        managerRole: {},
        helperRole: {},
        memberRole: {},
        helperOfTheMonthRole: {},
        guild: {},
        importantChannels: [{ "": "" }],
    };
    constructor(bot) {
        this.bot = bot;
    }
    async loadConfig() {
        const configDocument = (await db_1.default.configCollection.find({}).toArray())[0];
        const guild = this.bot.guilds.cache.get(process.env.GuildID);
        return ConfigHandler.config = {
            conversationCatagory: this.bot.channels.cache.get(configDocument.conversationCatagoryId),
            conversationLog: this.bot.channels.cache.get(configDocument.conversationLogId),
            reportChannel: this.bot.channels.cache.get(configDocument.reportChannelId),
            requestHelperChannel: this.bot.channels.cache.get(configDocument.requestHelperChannelId),
            staffChannel: this.bot.channels.cache.get(configDocument.staffChannelId),
            errorChannel: this.bot.channels.cache.get(configDocument.errorChannelId),
            suggestIdeasChannel: this.bot.channels.cache.get(configDocument.suggestIdeasChannelId),
            managerRole: guild.roles.cache.get(configDocument.managerRole),
            helperRole: guild.roles.cache.get(configDocument.helperRole),
            memberRole: guild.roles.cache.get(configDocument.memberRole),
            helperOfTheMonthRole: guild.roles.cache.get(configDocument.helperOfTheMonthRoleId),
            guild: guild,
            importantChannels: configDocument.importantChannels,
        };
    }
}
exports.default = ConfigHandler;
//# sourceMappingURL=Config.js.map