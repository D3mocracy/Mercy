import { MongoClient } from "mongodb";
declare namespace DataBase {
    const client: MongoClient;
    const conversationsCollection: import("mongodb").Collection<import("bson").Document>;
    const configCollection: import("mongodb").Collection<import("bson").Document>;
    const embedMessagesCollection: import("mongodb").Collection<import("bson").Document>;
    const volunteerCollection: import("mongodb").Collection<import("bson").Document>;
    const reportCollection: import("mongodb").Collection<import("bson").Document>;
    const suggestionCollection: import("mongodb").Collection<import("bson").Document>;
    const punishmentsCollection: import("mongodb").Collection<import("bson").Document>;
}
export default DataBase;
//# sourceMappingURL=db.d.ts.map