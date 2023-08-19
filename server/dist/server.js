"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./config/app"));
const logger_util_1 = __importDefault(require("./utils/logger.util"));
const PORT = process.env.PORT || 8080;
app_1.default.listen(PORT, () => {
    logger_util_1.default.info(null, `Server listening on port ${PORT}!`);
});
