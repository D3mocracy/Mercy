export class CantLoadConversationFromDB extends Error {
    constructor() {
        super(`Can't load conversation from DB`);
        this.name = "CantLoadConversationFromDB"
    }
}