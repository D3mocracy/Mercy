"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const db_1 = __importDefault(require("../utils/db"));
class ConfigHandler {
    static config = {
        ticketCatagory: "",
        ticketLog: {},
        reportChannel: {},
        reportHelperChannel: {},
        staffChannel: {},
        errorChannel: {},
        managerRole: {},
        helperRole: {},
        memberRole: {},
        helperOfTheMonthRole: {},
        guild: {},
        importantChannels: [{ "": "" }],
    };
    async loadConfig() {
        const configDocument = (await db_1.default.configCollection.find({}).toArray())[0];
        const guild = await __1.client.guilds.fetch(process.env.GuildID);
        const fetchPromises = [
            __1.client.channels.fetch(configDocument.conversationCatagoryId),
            __1.client.channels.fetch(configDocument.conversationLogId),
            __1.client.channels.fetch(configDocument.reportChannelId),
            __1.client.channels.fetch(configDocument.requestHelperChannelId),
            __1.client.channels.fetch(configDocument.staffChannelId),
            __1.client.channels.fetch(configDocument.errorChannelId),
            guild.roles.fetch(configDocument.managerRole),
            guild.roles.fetch(configDocument.helperRole),
            guild.roles.fetch(configDocument.memberRole),
            guild.roles.fetch(configDocument.helperOfTheMonthRoleId),
        ];
        const [ticketCategory, ticketLog, reportChannel, reportHelperChannel, staffChannel, errorChannel, managerRole, helperRole, memberRole, helperOfTheMonthRole,] = await Promise.all(fetchPromises);
        return ConfigHandler.config = {
            ticketCatagory: ticketCategory,
            ticketLog: ticketLog,
            reportChannel: reportChannel,
            reportHelperChannel: reportHelperChannel,
            staffChannel: staffChannel,
            errorChannel: errorChannel,
            managerRole: managerRole,
            helperRole: helperRole,
            memberRole: memberRole,
            helperOfTheMonthRole: helperOfTheMonthRole,
            guild: guild,
            importantChannels: configDocument.importantChannels,
        };
    }
}
exports.default = ConfigHandler;
//# sourceMappingURL=Config.js.map