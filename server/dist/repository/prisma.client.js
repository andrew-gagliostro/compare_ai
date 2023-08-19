"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_correlation_id_1 = __importDefault(require("express-correlation-id"));
const logger_util_1 = __importDefault(require("../utils/logger.util"));
const prisma = new client_1.PrismaClient({
    log: [
        {
            emit: "event",
            level: "query",
        },
        {
            emit: "stdout",
            level: "error",
        },
        {
            emit: "stdout",
            level: "info",
        },
        {
            emit: "stdout",
            level: "warn",
        },
    ],
});
prisma.$use(async (params, next) => {
    const before = Date.now();
    const result = await next(params);
    const after = Date.now();
    logger_util_1.default.info(express_correlation_id_1.default.getId(), `prisma query ${params.model}.${params.action} took ${after - before}ms`);
    return result;
});
prisma.$on("query", (event) => {
    // note: currently correlator returns undefined as "on query" is out of request context -> prisma plans to add query tracing in future
    // logger.debug(correlator.getId(), `Query: ${event.query} | Params: ${event.params} | Duration: ${event.duration}ms`);
});
exports.default = prisma;
