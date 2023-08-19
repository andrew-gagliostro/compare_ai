import { PrismaClient } from "@prisma/client";
import correlator from "express-correlation-id";
import logger from "../utils/logger.util";

const prisma = new PrismaClient({
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
  logger.info(
    correlator.getId(),
    `prisma query ${params.model}.${params.action} took ${after - before}ms`
  );
  return result;
});

prisma.$on("query", (event) => {
  // note: currently correlator returns undefined as "on query" is out of request context -> prisma plans to add query tracing in future
  // logger.debug(correlator.getId(), `Query: ${event.query} | Params: ${event.params} | Duration: ${event.duration}ms`);
});

export default prisma;
