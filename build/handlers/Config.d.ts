import { Config } from "../utils/types";
import { Client } from "discord.js";
declare class ConfigHandler {
    static config: Config;
    loadConfig(client: Client): Promise<Config>;
}
export default ConfigHandler;
//# sourceMappingURL=Config.d.ts.map