"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../utils/db"));
class ConfigHandler {
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
    async loadConfig(client) {
        const configDocument = (await db_1.default.configCollection.find({}).toArray())[0];
        const guild = client.guilds.cache.get(process.env.GuildID);
        console.log(configDocument);
        return ConfigHandler.config = {
            get guild() {
                return guild;
            },
            get conversationCatagory() {
                return client.channels.cache.get(configDocument.conversationCatagoryId);
            },
            get conversationLog() {
                return client.channels.cache.get(configDocument.conversationLogId);
            },
            get reportChannel() {
                return client.channels.cache.get(configDocument.reportChannelId);
            },
            get requestHelperChannel() {
                return client.channels.cache.get(configDocument.requestHelperChannelId);
            },
            get staffChannel() {
                return client.channels.cache.get(configDocument.staffChannelId);
            },
            get errorChannel() {
                return client.channels.cache.get(configDocument.errorChannelId);
            },
            get suggestIdeasChannel() {
                return client.channels.cache.get(configDocument.suggestIdeasChannelId);
            },
            get managerRole() {
                return guild.roles.cache.get(configDocument.managerRole);
            },
            get helperRole() {
                return guild.roles.cache.get(configDocument.helperRole);
            },
            get memberRole() {
                return guild.roles.cache.get(configDocument.memberRole);
            },
            get helperOfTheMonthRole() {
                return guild.roles.cache.get(configDocument.helperOfTheMonthRoleId);
            },
            importantChannels: configDocument.importantChannels
        };
    }
}
exports.default = ConfigHandler;
//# sourceMappingURL=Config.js.map