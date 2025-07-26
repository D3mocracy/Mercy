import { MongoClient } from "mongodb";
import { CONSTANTS } from "./Constants";
require("dotenv").config();

namespace DataBase {
    export const client: MongoClient = new MongoClient(process.env.MongoURL!);
    const database = client.db(CONSTANTS.DATABASE.NAME);

    export const conversationsCollection = database.collection(CONSTANTS.DATABASE.COLLECTIONS.CONVERSATIONS);
    export const configCollection = database.collection(CONSTANTS.DATABASE.COLLECTIONS.CONFIG);
    export const embedMessagesCollection = database.collection(CONSTANTS.DATABASE.COLLECTIONS.EMBED_MESSAGES);
    export const volunteerCollection = database.collection(CONSTANTS.DATABASE.COLLECTIONS.VOLUNTEER);
    export const reportCollection = database.collection(CONSTANTS.DATABASE.COLLECTIONS.REPORTS);
    export const suggestionCollection = database.collection(CONSTANTS.DATABASE.COLLECTIONS.SUGGESTIONS);
    export const punishmentsCollection = database.collection(CONSTANTS.DATABASE.COLLECTIONS.PUNISHMENTS);
}

export default DataBase;