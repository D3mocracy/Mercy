"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CantLoadConversationFromDB = void 0;
class CantLoadConversationFromDB extends Error {
    constructor() {
        super(`Can't load conversation from DB`);
        this.name = "CantLoadConversationFromDB";
    }
}
exports.CantLoadConversationFromDB = CantLoadConversationFromDB;
//# sourceMappingURL=Errors.js.map