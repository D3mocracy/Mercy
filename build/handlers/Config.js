"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../utils/db"));
class ConfigHandler {
    static config = {
        conversationCatagory: {},
        conversationLog: {},
        reportChannel: {},
        requestHelperChannel: {},
        staffChannel: {},
        errorChannel: {},
        suggestIdeasChannel: {},
        vacationChannel: {},
        volunteerChannel: {},
        punishmentChannel: {},
        managerRole: {},
        helperRole: {},
        supervisorRole: {},
        memberRole: {},
        helperOfTheMonthRole: {},
        helperitOfTheMonthRole: {},
        guild: {},
        importantChannels: [{ "": "" }],
    };
    async loadConfig(client) {
        const configDocument = (await db_1.default.configCollection.find({}).toArray())[0];
        const guild = client.guilds.cache.get(process.env.GuildID);
        return (ConfigHandler.config = {
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
            get vacationChannel() {
                return client.channels.cache.get(configDocument.vacationChannelId);
            },
            get volunteerChannel() {
                return client.channels.cache.get(configDocument.volunteerChannelId);
            },
            get punishmentChannel() {
                return client.channels.cache.get(configDocument.punishmentChannelId);
            },
            get managerRole() {
                return guild.roles.cache.get(configDocument.managerRole);
            },
            get helperRole() {
                return guild.roles.cache.get(configDocument.helperRole);
            },
            get supervisorRole() {
                return guild.roles.cache.get(configDocument.supervisorRole);
            },
            get memberRole() {
                return guild.roles.cache.get(configDocument.memberRole);
            },
            get helperOfTheMonthRole() {
                return guild.roles.cache.get(configDocument.helperOfTheMonthRoleId);
            },
            get helperitOfTheMonthRole() {
                return guild.roles.cache.get(configDocument.helperitOfTheMonthRoleId);
            },
            importantChannels: configDocument.importantChannels,
        });
    }
}
exports.default = ConfigHandler;
//# sourceMappingURL=Config.js.map