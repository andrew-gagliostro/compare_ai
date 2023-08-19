import { servicesLogger } from "../config/winston.config";

const logger = {
  log: function (
    level: string,
    correlationId: string | null | undefined,
    message: string
  ) {
    servicesLogger.log(level, message, {
      correlationId: correlationId !== undefined ? correlationId : null,
    });
  },
  info: function (correlationId: string | null | undefined, message: string) {
    servicesLogger.info(message, {
      correlationId: correlationId ? correlationId : null,
    });
  },
  debug: function (correlationId: string | null | undefined, message: string) {
    servicesLogger.debug(message, {
      correlationId: correlationId ? correlationId : null,
    });
  },
  verbose: function (
    correlationId: string | null | undefined,
    message: string
  ) {
    servicesLogger.verbose(message, {
      correlationId: correlationId ? correlationId : null,
    });
  },
  warn: function (correlationId: string | null | undefined, message: string) {
    servicesLogger.warn(message, {
      correlationId: correlationId ? correlationId : null,
    });
  },
  error: function (
    correlationId: string | null | undefined,
    message: string,
    error: any
  ) {
    servicesLogger.error(`${message}: ${error}`, {
      correlationId: correlationId ? correlationId : null,
    });
  },
};

export default logger;
