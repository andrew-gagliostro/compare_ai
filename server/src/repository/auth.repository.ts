import { auth_entry } from "@prisma/client";
import prisma from "./prisma.client";

export default class AuthRepo {
  public async createAuthEntry(code_challenge: string, auth_code: string): Promise<auth_entry> {
    return await prisma.auth_entry.create({ data: {
      auth_code: auth_code,
      code_challenge: code_challenge
    }})
  }

  public async findEntryByAuthCode(auth_code: string): Promise<auth_entry | null> {
    return await prisma.auth_entry.findFirst({where: {auth_code:auth_code}})
  }

  public async updateAuthEntry(entry: auth_entry): Promise<auth_entry> {
    return await prisma.auth_entry.update({where: {id: entry.id}, data: entry});
  }

}
