import DataBase from "../utils/db";
import { Config } from "../utils/types";

class ConfigHandler {
    private config: Config = {} as any;

    private async loadConfig() {
        this.config = (await DataBase.configCollection.find({}).toArray())[0] as any;
    }

    async getConfig(): Promise<Config> {
        await this.loadConfig();
        return this.config;
    }

}

export default ConfigHandler;