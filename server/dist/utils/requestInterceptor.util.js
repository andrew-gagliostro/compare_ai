"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestInterceptor = void 0;
const express_correlation_id_1 = __importDefault(require("express-correlation-id"));
const logger_util_1 = __importDefault(require("../utils/logger.util"));
function requestInterceptor(req, res, next) {
    const message = `${req.method} ${req.headers.host}${req.url}`;
    logger_util_1.default.info(express_correlation_id_1.default.getId(), message);
    next();
}
exports.requestInterceptor = requestInterceptor;
