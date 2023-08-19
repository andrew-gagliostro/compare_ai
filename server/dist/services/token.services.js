"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_repository_1 = __importDefault(require("../repository/auth.repository"));
const jose = __importStar(require("jose"));
const fast_sha256_1 = __importDefault(require("fast-sha256"));
const logger_util_1 = __importDefault(require("../utils/logger.util"));
const express_correlation_id_1 = __importDefault(require("express-correlation-id"));
const alg = 'ES256';
const pk = process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY : "";
const port = process.env.PORT ? process.env.PORT : 8080;
class TokenService {
    authRepo = new auth_repository_1.default();
    async generateToken(authorization_code, code_verifier) {
        try {
            //fetch auth_entry from db with associated authroization_code
            let authEntry = await this.authRepo.findEntryByAuthCode(authorization_code);
            //authorization code wasn't issued
            if (!authEntry) {
                throw new Error("Invalid Authorization Code");
            }
            //determine expected value to be held in code_challenge with associated authorization_code
            const convertedVerifier = jose.base64url.encode((0, fast_sha256_1.default)(new TextEncoder().encode(code_verifier)));
            //verifier doesn't match challenge according to PKCE S256
            if (!(authEntry.code_challenge == convertedVerifier)) {
                throw new Error("Invalid Code Verifier");
            }
            //using private key env variable string
            const key = JSON.parse(pk);
            //building payload and protected header
            const payload = {
                iss: `http://localhost:${port}`,
                sub: `any_username`
            };
            const protectedHeader = {
                kid: key.kid,
                alg: 'ES256'
            };
            //using jose.importJWK corresponding to ES256 signing algorithm
            const privateKey = await jose.importJWK(key, alg);
            //gen signed jwt
            const signedJWT = await new jose.SignJWT(payload).setProtectedHeader(protectedHeader).sign(privateKey);
            //update auth_entry
            authEntry.updated_ts = new Date();
            //hashing token to store in db
            authEntry.token = jose.base64url.encode((0, fast_sha256_1.default)(new TextEncoder().encode(signedJWT)));
            await this.authRepo.updateAuthEntry(authEntry);
            return signedJWT;
        }
        catch (e) {
            logger_util_1.default.error(express_correlation_id_1.default.getId(), "Unable to generate token", e);
            throw e;
        }
    }
}
exports.default = TokenService;
