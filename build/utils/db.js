"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
require("dotenv").config();
var DataBase;
(function (DataBase) {
    DataBase.client = new mongodb_1.MongoClient(process.env.MongoURL);
    DataBase.conversationsCollection = DataBase.client.db("Angel").collection("Conversations");
    DataBase.configCollection = DataBase.client.db("Angel").collection("Config");
    DataBase.embedMessagesCollection = DataBase.client.db("Angel").collection("EmbedMessages");
})(DataBase || (DataBase = {}));
exports.default = DataBase;
//# sourceMappingURL=db.js.map