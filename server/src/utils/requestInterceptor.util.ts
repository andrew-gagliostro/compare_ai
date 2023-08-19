import express from "express";
import correlator from "express-correlation-id";
import logger from "../utils/logger.util";

export function requestInterceptor(req: express.Request, res: express.Response, next: express.NextFunction) {
    const message = `${req.method} ${req.headers.host}${req.url}`;
    logger.info(correlator.getId(), message);
    next();
}