"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_client_1 = __importDefault(require("./prisma.client"));
class AuthRepo {
    async createAuthEntry(code_challenge, auth_code) {
        return await prisma_client_1.default.auth_entry.create({ data: {
                auth_code: auth_code,
                code_challenge: code_challenge
            } });
    }
    async findEntryByAuthCode(auth_code) {
        return await prisma_client_1.default.auth_entry.findFirst({ where: { auth_code: auth_code } });
    }
    async updateAuthEntry(entry) {
        return await prisma_client_1.default.auth_entry.update({ where: { id: entry.id }, data: entry });
    }
}
exports.default = AuthRepo;
