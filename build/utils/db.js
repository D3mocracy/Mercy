"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const Constants_1 = require("./Constants");
require("dotenv").config();
var DataBase;
(function (DataBase) {
    DataBase.client = new mongodb_1.MongoClient(process.env.MongoURL);
    const database = DataBase.client.db(Constants_1.CONSTANTS.DATABASE.NAME);
    DataBase.conversationsCollection = database.collection(Constants_1.CONSTANTS.DATABASE.COLLECTIONS.CONVERSATIONS);
    DataBase.configCollection = database.collection(Constants_1.CONSTANTS.DATABASE.COLLECTIONS.CONFIG);
    DataBase.embedMessagesCollection = database.collection(Constants_1.CONSTANTS.DATABASE.COLLECTIONS.EMBED_MESSAGES);
    DataBase.volunteerCollection = database.collection(Constants_1.CONSTANTS.DATABASE.COLLECTIONS.VOLUNTEER);
    DataBase.reportCollection = database.collection(Constants_1.CONSTANTS.DATABASE.COLLECTIONS.REPORTS);
    DataBase.suggestionCollection = database.collection(Constants_1.CONSTANTS.DATABASE.COLLECTIONS.SUGGESTIONS);
    DataBase.punishmentsCollection = database.collection(Constants_1.CONSTANTS.DATABASE.COLLECTIONS.PUNISHMENTS);
})(DataBase || (DataBase = {}));
exports.default = DataBase;
//# sourceMappingURL=db.js.map