import { auth_entry } from "@prisma/client";
import AuthRepo from "../repository/auth.repository";
import * as jose from 'jose'
import sha256 from "fast-sha256";
import logger from "../utils/logger.util";
import correlator from "express-correlation-id";

const alg = 'ES256'
const pk = process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY : "";
const port = process.env.PORT ? process.env.PORT : 8080;

export default class TokenService {
  private authRepo: AuthRepo = new AuthRepo();

  public async generateToken(authorization_code: string, code_verifier: string): Promise<string> {

    try {
      
      //fetch auth_entry from db with associated authroization_code
      let authEntry: auth_entry | null = await this.authRepo.findEntryByAuthCode(authorization_code);

      //authorization code wasn't issued
      if(!authEntry) {
        throw new Error("Invalid Authorization Code");
      }

      //determine expected value to be held in code_challenge with associated authorization_code
      const convertedVerifier = jose.base64url.encode(sha256(new TextEncoder().encode(code_verifier)));
      //verifier doesn't match challenge according to PKCE S256
      if(!(authEntry.code_challenge == convertedVerifier)) {
        throw new Error("Invalid Code Verifier");
      }
      //using private key env variable string
      const key: jose.JWK = JSON.parse(pk);

      //building payload and protected header
      const payload = {
          iss: `http://localhost:${port}`,
          sub: `any_username`
        }
      const protectedHeader = {
          kid: key.kid,
          alg: 'ES256'
      }
      //using jose.importJWK corresponding to ES256 signing algorithm
      const privateKey = await jose.importJWK(key, alg)
      //gen signed jwt
      const signedJWT = await new jose.SignJWT(payload).setProtectedHeader(protectedHeader).sign(privateKey);
      //update auth_entry
      authEntry.updated_ts = new Date()
      //hashing token to store in db
      authEntry.token = jose.base64url.encode(sha256(new TextEncoder().encode(signedJWT)));
      await this.authRepo.updateAuthEntry(authEntry);
      return signedJWT;
      
    } catch(e) {
      logger.error(correlator.getId(), "Unable to generate token", e);
      throw e;
    }

  }

}
