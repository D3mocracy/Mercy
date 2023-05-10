import { MongoClient } from "mongodb";
require("dotenv").config();
namespace DataBase {
    export const client: MongoClient = new MongoClient(process.env.MongoURL!);

    export const conversationsCollection = DataBase.client.db("Mercy").collection("Conversations");

    export const configCollection = DataBase.client.db("Mercy").collection("Config");

    export const embedMessagesCollection = DataBase.client.db("Mercy").collection("EmbedMessages");
}

export default DataBase;