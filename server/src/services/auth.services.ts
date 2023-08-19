import { auth_entry } from "@prisma/client";
import correlator from "express-correlation-id";
import AuthRepo from "../repository/auth.repository";
import logger from "../utils/logger.util";

export default class AuthService {

  private authRepo: AuthRepo = new AuthRepo();

  //function to generate authorization code and hold with codeChallenge for token administration
  public async handleAuthorization(code_challenge: string): Promise<auth_entry> {
    try {
      //generate random authorization code
      const authCode = this.random(20);
      //save authEntry with codeChallenge and authCode
      const entry: auth_entry = await this.authRepo.createAuthEntry(code_challenge, authCode) 
      //return auth_entry
      return entry;
    } catch(e) {
      logger.error(correlator.getId(), "Error generating authorization code", e);
      throw e;
    }

  }

  
  //random string generator where n is length of desired string
  private random(n: number): string {
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var token = '';
    for(var i = 0; i < n; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }
    return token;
  }
}
