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
    export const conversationsCollection = DataBase.client.db("AngeLove").collection("Conversations");

    /*
    ticketCatagoryId: string,
    managerRole: string,
    helperRole: string,
    */
    export const configCollection = DataBase.client.db("AngeLove").collection("Config");

    export const embedMessagesCollection = DataBase.client.db("AngeLove").collection("EmbedMessages");
}

export default DataBase;