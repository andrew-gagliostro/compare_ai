"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_config_1 = require("../config/winston.config");
const logger = {
    log: function (level, correlationId, message) {
        winston_config_1.servicesLogger.log(level, message, {
            correlationId: correlationId !== undefined ? correlationId : null,
        });
    },
    info: function (correlationId, message) {
        winston_config_1.servicesLogger.info(message, {
            correlationId: correlationId ? correlationId : null,
        });
    },
    debug: function (correlationId, message) {
        winston_config_1.servicesLogger.debug(message, {
            correlationId: correlationId ? correlationId : null,
        });
    },
    verbose: function (correlationId, message) {
        winston_config_1.servicesLogger.verbose(message, {
            correlationId: correlationId ? correlationId : null,
        });
    },
    warn: function (correlationId, message) {
        winston_config_1.servicesLogger.warn(message, {
            correlationId: correlationId ? correlationId : null,
        });
    },
    error: function (correlationId, message, error) {
        winston_config_1.servicesLogger.error(`${message}: ${error}`, {
            correlationId: correlationId ? correlationId : null,
        });
    },
};
exports.default = logger;
