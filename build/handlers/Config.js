"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../utils/Utils");
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
        guild: {}
    };
    async loadConfig() {
        const configDocument = (await db_1.default.configCollection.find({}).toArray())[0];
        const fetchPromises = [
            Utils_1.Utils.getGuild().channels.fetch(configDocument.ticketCatagoryId),
            Utils_1.Utils.getChannelById(configDocument.ticketLogId),
            Utils_1.Utils.getChannelById(configDocument.reportChannelId),
            Utils_1.Utils.getChannelById(configDocument.reportHelperChannelId),
            Utils_1.Utils.getChannelById(configDocument.staffChannelId),
            Utils_1.Utils.getChannelById(configDocument.errorChannel),
            Utils_1.Utils.getRoleById(configDocument.managerRole),
            Utils_1.Utils.getRoleById(configDocument.helperRole),
            Utils_1.Utils.getRoleById(configDocument.memberRole),
            Utils_1.Utils.getRoleById(configDocument.helperOfTheMonthRoleId),
            Utils_1.Utils.getGuild(),
        ];
        const [ticketCategory, ticketLog, reportChannel, reportHelperChannel, staffChannel, errorChannel, managerRole, helperRole, memberRole, helperOfTheMonthRole, guild,] = await Promise.all(fetchPromises);
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
        };
    }
}
exports.default = ConfigHandler;
//# sourceMappingURL=Config.js.map