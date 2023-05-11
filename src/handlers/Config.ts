import { client } from "..";
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
        const guild: Guild = await client.guilds.fetch(process.env.GuildID as string);

        const fetchPromises = [
            client.channels.fetch(configDocument.ticketCatagoryId),
            client.channels.fetch(configDocument.ticketLogId),
            client.channels.fetch(configDocument.reportChannelId),
            client.channels.fetch(configDocument.reportHelperChannelId),
            client.channels.fetch(configDocument.staffChannelId),
            client.channels.fetch(configDocument.errorChannel),
            guild.roles.fetch(configDocument.managerRole),
            guild.roles.fetch(configDocument.helperRole),
            guild.roles.fetch(configDocument.memberRole),
            guild.roles.fetch(configDocument.helperOfTheMonthRoleId),
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
