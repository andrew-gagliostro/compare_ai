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
Object.defineProperty(exports, "__esModule", { value: true });
exports.servicesLogger = void 0;
const winston_1 = __importStar(require("winston"));
const config = {
    serviceLogFile: {
        filename: "logs/services.log",
        level: "info",
        handleExceptions: true,
        format: winston_1.format.combine(winston_1.format.timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }), winston_1.format.json(), winston_1.format.align()),
        json: true,
    },
    console: {
        level: "debug",
        handleExceptions: true,
        format: winston_1.format.combine(winston_1.format.timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }), winston_1.format.json(), winston_1.format.align()),
        json: true,
    },
};
const servicesLogger = (0, winston_1.createLogger)({
    transports: [
        new winston_1.transports.File(config.serviceLogFile),
        new winston_1.transports.Console(config.console),
    ],
    exitOnError: false,
});
exports.servicesLogger = servicesLogger;
winston_1.default.loggers.add("servicesLogger", servicesLogger);
