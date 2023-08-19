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
const express_correlation_id_1 = __importDefault(require("express-correlation-id"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = require("../routes/routes");
const logger_util_1 = __importDefault(require("../utils/logger.util"));
const swaggerUi = __importStar(require("swagger-ui-express"));
const requestInterceptor_util_1 = require("../utils/requestInterceptor.util");
const next_1 = __importDefault(require("next"));
const dev = process.env.NODE_ENV !== "production";
const nextApp = (0, next_1.default)({ dev });
const handle = nextApp.getRequestHandler();
class App {
    app;
    constructor() {
        this.app = (0, express_1.default)();
        dotenv_1.default.config();
        this.config();
        this.routeHandler();
    }
    config() {
        nextApp.prepare().then(() => {
            this.app.use(body_parser_1.default.json({ limit: "50mb" }));
            this.app.use(body_parser_1.default.urlencoded({ extended: false }));
            this.app.use((0, cors_1.default)());
            this.app.use((0, cookie_parser_1.default)());
            this.app.use((0, express_correlation_id_1.default)());
            this.app.use(requestInterceptor_util_1.requestInterceptor);
            this.app.get("*", (req, res) => {
                return handle(req, res);
            });
        });
    }
    routeHandler() {
        (0, routes_1.RegisterRoutes)(this.app); // tsoa generated routes
        try {
            const YAML = require("yamljs");
            const swaggerDoc = YAML.load("./openapi.yaml"); // yamljs requires path to be supplied w/ single quotes
            //exposing endpoint for Identity Provider's Swagger UI API Documentation
            this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
        }
        catch (err) {
            logger_util_1.default.error(null, "Unable to load swagger-ui for openapi.yaml", err);
        }
    }
}
exports.default = new App().app;
