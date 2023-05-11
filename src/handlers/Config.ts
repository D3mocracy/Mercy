import DataBase from "../utils/db";
import { Config, ConfigDocument } from "../utils/types";
import { CategoryChannel, TextChannel, Role, Guild, Client } from "discord.js";

class ConfigHandler {
    public static config: Config = {
        conversationCatagory: "",
        conversationLog: {} as TextChannel,
        reportChannel: {} as TextChannel,
        requestHelperChannel: {} as TextChannel,
        staffChannel: {} as TextChannel,
        errorChannel: {} as TextChannel,
        suggestIdeasChannel: {} as TextChannel,
        managerRole: {} as Role,
        helperRole: {} as Role,
        memberRole: {} as Role,
        helperOfTheMonthRole: {} as Role,
        guild: {} as Guild,
        importantChannels: [{ "": "" }],
    };

    constructor(private bot: Client) { }

    async loadConfig(): Promise<Config> {
        const configDocument: ConfigDocument = (await DataBase.configCollection.find({}).toArray())[0] as any;
        const guild: Guild = this.bot.guilds.cache.get(process.env.GuildID as string) as Guild;

        return ConfigHandler.config = {
            conversationCatagory: this.bot.channels.cache.get(configDocument.conversationCatagoryId) as CategoryChannel,
            conversationLog: this.bot.channels.cache.get(configDocument.conversationLogId) as TextChannel,
            reportChannel: this.bot.channels.cache.get(configDocument.reportChannelId) as TextChannel,
            requestHelperChannel: this.bot.channels.cache.get(configDocument.requestHelperChannelId) as TextChannel,
            staffChannel: this.bot.channels.cache.get(configDocument.staffChannelId) as TextChannel,
            errorChannel: this.bot.channels.cache.get(configDocument.errorChannelId) as TextChannel,
            suggestIdeasChannel: this.bot.channels.cache.get(configDocument.suggestIdeasChannelId) as TextChannel,
            managerRole: guild.roles.cache.get(configDocument.managerRole) as Role,
            helperRole: guild.roles.cache.get(configDocument.helperRole) as Role,
            memberRole: guild.roles.cache.get(configDocument.memberRole) as Role,
            helperOfTheMonthRole: guild.roles.cache.get(configDocument.helperOfTheMonthRoleId) as Role,
            guild: guild as Guild,
            importantChannels: configDocument.importantChannels,
        };
    }
}

export default ConfigHandler;
