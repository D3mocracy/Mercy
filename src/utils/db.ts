import { MongoClient } from "mongodb";
require("dotenv").config();
namespace DataBase {
    export const client: MongoClient = new MongoClient(process.env.MongoURL!);

    export const conversationsCollection = DataBase.client.db("Angel").collection("Conversations");

    export const configCollection = DataBase.client.db("Angel").collection("Config");

    export const embedMessagesCollection = DataBase.client.db("Angel").collection("EmbedMessages");

    export const volunteerCollection = DataBase.client.db("Angel").collection("Volunteer");

    export const reportCollection = DataBase.client.db("Angel").collection("Reports");

    export const suggestionCollection = DataBase.client.db("Angel").collection("Suggestions");

    export const punishmentsCollection = DataBase.client.db("Angel").collection("Punishments");
}

export default DataBase;