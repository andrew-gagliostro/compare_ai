import { NextApiRequest, NextApiResponse } from "next";

import safeObject from "./safeObject";
import { Awaitable, Session, getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export interface Response {
  success: boolean;
  status: number;
  message?: any;
}

function Log(name: string, callback: Awaitable<any>) {
  return async function (this: any, ...args: any[]) {
    console.log(
      `Calling ${name} with Following Arguments:\n ${JSON.stringify(
        args,
        null,
        4
      )}`
    );
    const result = await callback.apply(this, args);
    console.log(`${name} RETURNED:\n`, JSON.stringify(result, null, 4));
    return result;
  };
}

class ResponseHelper {
  request: NextApiRequest;

  response: NextApiResponse;

  safeProps: string[] = [];

  session: Session | null = null;

  constructor(req: NextApiRequest, res: NextApiResponse) {
    this.request = req;
    this.response = res;
  }

  methodNotAllowed(): Response {
    return {
      status: 405,
      success: false,
      message: `Method ${this.request.method} not allowed.`,
    };
  }

  static notFound(resource: string): Response {
    return {
      status: 404,
      success: false,
      message: `${resource} not found.`,
    };
  }

  static forbidden(): Response {
    return {
      status: 403,
      success: false,
      message: "Forbidden.",
    };
  }

  static invalidRequest(invalidFields: string[]): Response {
    return {
      status: 400,
      success: false,
      message: `Required fields missing: ${invalidFields.join(",")}`,
    };
  }

  static invalidContentType(expected = "application/json") {
    return {
      status: 415,
      success: false,
      message: `Unsupported Media Type. Please use ${expected}`,
    };
  }

  safeObject<T>(obj: any): T {
    return safeObject<T>(obj, this.safeProps);
  }

  async get() {
    return this.methodNotAllowed();
  }

  async post() {
    return this.methodNotAllowed();
  }

  async put() {
    return this.methodNotAllowed();
  }

  async patch() {
    return this.methodNotAllowed();
  }

  async delete() {
    return this.methodNotAllowed();
  }

  async getSession() {
    this.session = await getServerSession(
      this.request,
      this.response,
      authOptions
    );
  }

  async send(): Promise<void | true> {
    await this.getSession();

    // Log the incoming request
    // console.log("Incoming Request:", {
    //   method: this.request.method,
    //   url: this.request.url,
    //   headers: this.request.headers,
    //   body: this.request.body, // Be cautious logging sensitive information
    // });

    let response: Response = {
      status: 200,
      success: true,
    };

    switch (this.request.method) {
      case "GET":
        response = await this.get();
        break;
      case "POST":
        response = await this.post();
        break;
      case "PUT":
        response = await this.put();
        break;
      case "PATCH":
        response = await this.patch();
        break;
      case "DELETE":
        response = await this.delete();
        break;
      default:
        response = this.methodNotAllowed();
    }

    // Log the response about to be sent
    // console.log("Sending Response:", JSON.stringify(response, null, 2));

    this.response.status(response.status).json(response);

    return true;
  }
}

export default ResponseHelper;
