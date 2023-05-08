import DataBase from "../utils/db";
import { Config } from "../utils/types";

class ConfigHandler {
    async getConfig(): Promise<Config> {
        return (await DataBase.configCollection.find({}).toArray())[0] as any;
    }

}

export default ConfigHandler;