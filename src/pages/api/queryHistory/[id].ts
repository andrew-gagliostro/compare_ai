import QueryHistory, { QueryHistoryModel } from "@/models/QueryHistory"; // Adjust the import path as needed
import User, { UserModel } from "@/models/User"; // Adjust the import path as needed
var createError = require("http-errors");
const { ObjectId } = require("mongodb");
import type { NextApiRequest, NextApiResponse } from "next";
import ResponseHelper from "@/backend/responseHelper";
import connect from "@/backend/connect";

class QueryHistoryIdHandler extends ResponseHelper {
  async post(): Promise<any> {
    return {
      status: 405,
      success: false,
      message: "Method Not Allowed",
    };
  }

  async get(): Promise<any> {
    try {
      const { id } = this.request.query;

      if (!ObjectId.isValid(id)) {
        return {
          status: 400,
          success: false,
          message: "Invalid ID format",
        };
      }

      let queryHistory = await QueryHistory.findById(id);

      if (!queryHistory) {
        return {
          status: 404,
          success: false,
          message: "Submission History not found",
        };
      }

      return {
        status: 200,
        success: "get call succeed!",
        result: queryHistory,
      };
    } catch (e) {
      console.log(e);
      return {
        status: 500,
        success: "get call failed!",
        error: e,
      };
    }
  }

  async put(): Promise<any> {
    try {
      const { id } = this.request.query;

      if (!ObjectId.isValid(id)) {
        return {
          status: 400,
          success: false,
          message: "Invalid ID format",
        };
      }

      const queryHistory = await QueryHistory.findByIdAndUpdate(
        id,
        this.request.body,
        {
          new: true,
        }
      );

      if (!queryHistory) {
        return {
          status: 404,
          success: false,
          message: "Submission History not found",
        };
      }

      return {
        status: 200,
        success: "put call succeed!",
        result: queryHistory,
      };
    } catch (e) {
      console.log(e);
      return {
        status: 500,
        success: "put call failed!",
        error: e,
      };
    }
  }

  async delete(): Promise<any> {
    try {
      const { id } = this.request.query;

      if (!ObjectId.isValid(id)) {
        return {
          status: 400,
          success: false,
          message: "Invalid ID format",
        };
      }

      const queryHistory = await QueryHistory.findByIdAndDelete(id);

      if (!queryHistory) {
        return {
          status: 404,
          success: false,
          message: "Submission History not found",
        };
      }

      return {
        status: 200,
        success: "delete call succeed!",
        result: queryHistory,
      };
    } catch (e) {
      console.log(e);
      return {
        status: 500,
        success: "delete call failed!",
        error: e,
      };
    }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connect();
  const response = new QueryHistoryIdHandler(req, res);
  await response.send();
}
