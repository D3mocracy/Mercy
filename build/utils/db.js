"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
require("dotenv").config();
var DataBase;
(function (DataBase) {
    DataBase.client = new mongodb_1.MongoClient(process.env.MongoURL);
    DataBase.conversationsCollection = DataBase.client.db("Mercy").collection("Conversations");
    DataBase.configCollection = DataBase.client.db("Mercy").collection("Config");
    DataBase.embedMessagesCollection = DataBase.client.db("Mercy").collection("EmbedMessages");
})(DataBase || (DataBase = {}));
exports.default = DataBase;
//# sourceMappingURL=db.js.map