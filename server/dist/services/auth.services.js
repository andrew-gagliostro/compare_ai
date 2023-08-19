"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_correlation_id_1 = __importDefault(require("express-correlation-id"));
const auth_repository_1 = __importDefault(require("../repository/auth.repository"));
const logger_util_1 = __importDefault(require("../utils/logger.util"));
class AuthService {
    authRepo = new auth_repository_1.default();
    //function to generate authorization code and hold with codeChallenge for token administration
    async handleAuthorization(code_challenge) {
        try {
            //generate random authorization code
            const authCode = this.random(20);
            //save authEntry with codeChallenge and authCode
            const entry = await this.authRepo.createAuthEntry(code_challenge, authCode);
            //return auth_entry
            return entry;
        }
        catch (e) {
            logger_util_1.default.error(express_correlation_id_1.default.getId(), "Error generating authorization code", e);
            throw e;
        }
    }
    //random string generator where n is length of desired string
    random(n) {
        var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var token = '';
        for (var i = 0; i < n; i++) {
            token += chars[Math.floor(Math.random() * chars.length)];
        }
        return token;
    }
}
exports.default = AuthService;
