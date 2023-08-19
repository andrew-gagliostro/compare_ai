"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationController = void 0;
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = require("http-status-codes");
const tsoa_1 = require("tsoa");
const auth_services_1 = __importDefault(require("../services/auth.services"));
const port = process.env.PORT ? process.env.PORT : 8080;
const discovery_document = {
    issuer: `http://localhost:${port}`,
    authorization_endpoint: `http://localhost:${port}/authorize`,
    token_endpoint: `http://localhost:${port}/token`,
    jwks_uri: `http://localhost:${port}/jwks.json`,
    scopes_supported: ["openid"],
};
let AuthorizationController = class AuthorizationController extends tsoa_1.Controller {
    authService = new auth_services_1.default();
    /**
     * @summary Endpoint for client to retrieve OpenID Discovery Document
     * @returns JSON with Discovery Document
     */
    getOidConfig() {
        return discovery_document;
    }
    /**
     * @summary Authorization enpoint : validation error will be thrown if any query param is missing
     * @param redirect_uri URL to which server will redirect to following successful authorization
     * @param response_type fixed - 'code'
     * @param response_mode fixed - 'query'
     * @param code_challenge 43-character string generated in client
     * @param code_challenge_method fixed - 'S256'
     * @param scope  fixed - 'openid'
     */
    async getAuthorization(request, redirect_uri, response_type, response_mode, code_challenge, code_challenge_method, scope) {
        //create record of auth_entry and generate authorization code for reference in token issuance
        const auth_entry = await this.authService.handleAuthorization(code_challenge);
        const response = request.res;
        response.redirect(`${redirect_uri}?code=${auth_entry.auth_code}`);
    }
};
__decorate([
    (0, tsoa_1.Get)("/.well-known/openid-configuration"),
    (0, tsoa_1.SuccessResponse)(http_status_codes_1.StatusCodes.OK, http_status_codes_1.ReasonPhrases.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthorizationController.prototype, "getOidConfig", null);
__decorate([
    (0, tsoa_1.Get)("/authorize"),
    (0, tsoa_1.SuccessResponse)(http_status_codes_1.StatusCodes.OK, http_status_codes_1.ReasonPhrases.OK),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __param(3, (0, tsoa_1.Query)()),
    __param(4, (0, tsoa_1.Query)()),
    __param(5, (0, tsoa_1.Query)()),
    __param(6, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AuthorizationController.prototype, "getAuthorization", null);
AuthorizationController = __decorate([
    (0, tsoa_1.Route)("/")
], AuthorizationController);
exports.AuthorizationController = AuthorizationController;
