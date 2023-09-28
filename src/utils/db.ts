import { MongoClient } from "mongodb";
require("dotenv").config();
namespace DataBase {
    export const client: MongoClient = new MongoClient(process.env.MongoURL!);

    export const conversationsCollection = DataBase.client.db("Angel").collection("Conversations");

    export const configCollection = DataBase.client.db("Angel").collection("Config");

    export const embedMessagesCollection = DataBase.client.db("Angel").collection("EmbedMessages");
}

export default DataBase;