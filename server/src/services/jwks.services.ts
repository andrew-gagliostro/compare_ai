import { jwks, key } from "../models/jwks.model";
import logger from "../utils/logger.util";
import correlator from "express-correlation-id";

export default class JwksService {

    public async getJwks(): Promise<jwks> {
        try{
            if (!process.env.PUBLIC_KEY) {
                throw new Error("Public Key Not ");
            }
            const pubKey: key = JSON.parse(process.env.PUBLIC_KEY);
            return {
              keys: [pubKey],
            } as jwks;
        } catch(e) {
        logger.error(correlator.getId(), "Error getting JWKS", e)
        throw e;
        }
    }
}