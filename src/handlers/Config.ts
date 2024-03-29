import DataBase from "../utils/db";
import { Config, ConfigDocument } from "../utils/types";
import { CategoryChannel, TextChannel, Role, Guild, Client } from "discord.js";

class ConfigHandler {
  public static config: Config = {
    conversationCatagory: {} as CategoryChannel,
    conversationLog: {} as TextChannel,
    reportChannel: {} as TextChannel,
    requestHelperChannel: {} as TextChannel,
    staffChannel: {} as TextChannel,
    errorChannel: {} as TextChannel,
    suggestIdeasChannel: {} as TextChannel,
    vacationChannel: {} as TextChannel,
    volunteerChannel: {} as TextChannel,
    punishmentChannel: {} as TextChannel,
    managerRole: {} as Role,
    helperRole: {} as Role,
    supervisorRole: {} as Role,
    memberRole: {} as Role,
    helperOfTheMonthRole: {} as Role,
    helperitOfTheMonthRole: {} as Role,
    guild: {} as Guild,
    importantChannels: [{ "": "" }],
  };

  async loadConfig(client: Client): Promise<Config> {
    const configDocument: ConfigDocument = (
      await DataBase.configCollection.find({}).toArray()
    )[0] as any;
    const guild: Guild = client.guilds.cache.get(
      process.env.GuildID as string
    ) as Guild;

    return (ConfigHandler.config = {
      get guild() {
        return guild;
      },
      get conversationCatagory() {
        return client.channels.cache.get(
          configDocument.conversationCatagoryId
        ) as CategoryChannel;
      },
      get conversationLog() {
        return client.channels.cache.get(
          configDocument.conversationLogId
        ) as TextChannel;
      },
      get reportChannel() {
        return client.channels.cache.get(
          configDocument.reportChannelId
        ) as TextChannel;
      },
      get requestHelperChannel() {
        return client.channels.cache.get(
          configDocument.requestHelperChannelId
        ) as TextChannel;
      },
      get staffChannel() {
        return client.channels.cache.get(
          configDocument.staffChannelId
        ) as TextChannel;
      },
      get errorChannel() {
        return client.channels.cache.get(
          configDocument.errorChannelId
        ) as TextChannel;
      },
      get suggestIdeasChannel() {
        return client.channels.cache.get(
          configDocument.suggestIdeasChannelId
        ) as TextChannel;
      },
      get vacationChannel() {
        return client.channels.cache.get(
          configDocument.vacationChannelId
        ) as TextChannel;
      },
      get volunteerChannel() {
        return client.channels.cache.get(
          configDocument.volunteerChannelId
        ) as TextChannel;
      },
      get punishmentChannel() {
        return client.channels.cache.get(
          configDocument.punishmentChannelId
        ) as TextChannel;
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

export default ConfigHandler;
