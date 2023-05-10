import { Utils } from "../utils/Utils";
import DataBase from "../utils/db";
import { Config, ConfigDocument } from "../utils/types";
import { CategoryChannel, TextChannel, Role, Guild } from "discord.js";

class ConfigHandler {
    public static config: Config = {
        ticketCatagory: "",
        ticketLog: {} as TextChannel,
        reportChannel: {} as TextChannel,
        reportHelperChannel: {} as TextChannel,
        staffChannel: {} as TextChannel,
        errorChannel: {} as TextChannel,
        managerRole: {} as Role,
        helperRole: {} as Role,
        memberRole: {} as Role,
        helperOfTheMonthRole: {} as Role,
        guild: {} as Guild
    };

    async loadConfig(): Promise<Config> {
        const configDocument: ConfigDocument = (await DataBase.configCollection.find({}).toArray())[0] as any;

        const fetchPromises = [
            Utils.getGuild().channels.fetch(configDocument.ticketCatagoryId),
            Utils.getChannelById(configDocument.ticketLogId),
            Utils.getChannelById(configDocument.reportChannelId),
            Utils.getChannelById(configDocument.reportHelperChannelId),
            Utils.getChannelById(configDocument.staffChannelId),
            Utils.getChannelById(configDocument.errorChannel),
            Utils.getRoleById(configDocument.managerRole),
            Utils.getRoleById(configDocument.helperRole),
            Utils.getRoleById(configDocument.memberRole),
            Utils.getRoleById(configDocument.helperOfTheMonthRoleId),
            Utils.getGuild(),
        ];

        const [
            ticketCategory,
            ticketLog,
            reportChannel,
            reportHelperChannel,
            staffChannel,
            errorChannel,
            managerRole,
            helperRole,
            memberRole,
            helperOfTheMonthRole,
            guild,
        ] = await Promise.all(fetchPromises);

        return ConfigHandler.config = {
            ticketCatagory: ticketCategory as CategoryChannel,
            ticketLog: ticketLog as TextChannel,
            reportChannel: reportChannel as TextChannel,
            reportHelperChannel: reportHelperChannel as TextChannel,
            staffChannel: staffChannel as TextChannel,
            errorChannel: errorChannel as TextChannel,
            managerRole: managerRole as Role,
            helperRole: helperRole as Role,
            memberRole: memberRole as Role,
            helperOfTheMonthRole: helperOfTheMonthRole as Role,
            guild: guild as Guild,
        };
    }
}

export default ConfigHandler;
