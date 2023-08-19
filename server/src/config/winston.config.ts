import winston, { createLogger, format, transports } from "winston";

const config = {
  serviceLogFile: {
    filename: "logs/services.log",
    level: "info", //minimum severity log
    handleExceptions: true,
    format: format.combine(
      format.timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
      format.json(),
      format.align()
    ),
    json: true,
  },
  console: {
    level: "debug", // minimum severity logged
    handleExceptions: true,
    format: format.combine(
      format.timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
      format.json(),
      format.align()
    ),
    json: true,
  },
};

const servicesLogger = createLogger({
  transports: [
    new transports.File(config.serviceLogFile),
    new transports.Console(config.console),
  ],
  exitOnError: false,
});

winston.loggers.add("servicesLogger", servicesLogger);

export { servicesLogger };
