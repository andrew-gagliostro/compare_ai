import { auth_entry } from "@prisma/client";
import express from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Controller, Get, Query, Request, Route, SuccessResponse } from "tsoa";
import AuthService from "../services/auth.services";
const port = process.env.PORT ? process.env.PORT : 8080;

const discovery_document = {
  issuer: `http://localhost:${port}`,
  authorization_endpoint: `http://localhost:${port}/authorize`,
  token_endpoint: `http://localhost:${port}/token`,
  jwks_uri: `http://localhost:${port}/jwks.json`,
  scopes_supported: ["openid"],
};

@Route("/")
export class AuthorizationController extends Controller {

  private authService: AuthService = new AuthService();

  /**
   * @summary Endpoint for client to retrieve OpenID Discovery Document
   * @returns JSON with Discovery Document
   */
  @Get("/.well-known/openid-configuration")
  @SuccessResponse(StatusCodes.OK, ReasonPhrases.OK)
  public getOidConfig() {
    return discovery_document;
  }

  /**
   * @summary Authorization enpoint : validation error will be thrown if any query param is missing
   * @param redirect_uri URL to which server will redirect to following successful authorization
   * @param response_type fixed - 'code'
   * @param response_mode fixed - 'query'
   * @param code_challenge 43-character string generated in client
   * @param code_challenge_method fixed - 'S256'
   * @param scope  fixed - 'openid'
   */
  @Get("/authorize")
  @SuccessResponse(StatusCodes.OK, ReasonPhrases.OK)
  public async getAuthorization(
    @Request() request: express.Request,
    @Query() redirect_uri: string,
    @Query() response_type: string,
    @Query() response_mode: string,
    @Query() code_challenge: string,
    @Query() code_challenge_method: string,
    @Query() scope: string
  ) {
    //create record of auth_entry and generate authorization code for reference in token issuance
    const auth_entry: auth_entry = await this.authService.handleAuthorization(code_challenge);
    const response = (<any>request).res as express.Response;
    response.redirect(`${redirect_uri}?code=${auth_entry.auth_code}`);
  }
}
