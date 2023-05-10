import { MongoClient } from "mongodb";
require("dotenv").config();
namespace DataBase {
    export const client: MongoClient = new MongoClient(process.env.MongoURL!);

    /*
    userId: string,
    staffMemberId: string,
    channelId: string,
    open: boolean,
    */
    export const conversationsCollection = DataBase.client.db("Mercy").collection("Conversations");

    /*
    ticketCatagoryId: string,
    managerRole: string,
    helperRole: string,
    */
    export const configCollection = DataBase.client.db("Mercy").collection("Config");

    export const embedMessagesCollection = DataBase.client.db("Mercy").collection("EmbedMessages");
}

export default DataBase;