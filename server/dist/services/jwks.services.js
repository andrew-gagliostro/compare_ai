"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_util_1 = __importDefault(require("../utils/logger.util"));
const express_correlation_id_1 = __importDefault(require("express-correlation-id"));
class JwksService {
    async getJwks() {
        try {
            if (!process.env.PUBLIC_KEY) {
                throw new Error("Public Key Not ");
            }
            const pubKey = JSON.parse(process.env.PUBLIC_KEY);
            return {
                keys: [pubKey],
            };
        }
        catch (e) {
            logger_util_1.default.error(express_correlation_id_1.default.getId(), "Error getting JWKS", e);
            throw e;
        }
    }
}
exports.default = JwksService;
