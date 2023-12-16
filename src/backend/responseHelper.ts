import { NextApiRequest, NextApiResponse } from "next";

import safeObject from "./safeObject";

export interface Response {
  success: boolean;
  status: number;
  message?: any;
}

class ResponseHelper {
  request: NextApiRequest;

  response: NextApiResponse;

  safeProps: string[] = [];

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

  async send(): Promise<void | true> {
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

    this.response.status(response.status).json(response);

    return true;
  }
}

export default ResponseHelper;
