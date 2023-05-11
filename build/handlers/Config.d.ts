import { Config } from "../utils/types";
import { Client } from "discord.js";
declare class ConfigHandler {
    private bot;
    static config: Config;
    constructor(bot: Client);
    loadConfig(): Promise<Config>;
}
export default ConfigHandler;
//# sourceMappingURL=Config.d.ts.map