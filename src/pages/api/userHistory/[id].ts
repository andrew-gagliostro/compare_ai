import SubmissionHistory, {
  SubmissionHistoryModel,
} from "@/models/SubmissionHistory"; // Adjust the import path as needed
import User, { UserModel } from "@/models/User"; // Adjust the import path as needed
var createError = require("http-errors");
const { ObjectId } = require("mongodb");
import type { NextApiRequest, NextApiResponse } from "next";
import ResponseHelper from "@/backend/responseHelper";
import connect from "@/backend/connect";

class SubmissionHistoryIdHandler extends ResponseHelper {
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

      const submissionHistory = await SubmissionHistory.findById(id);

      if (!submissionHistory) {
        return {
          status: 404,
          success: false,
          message: "Submission History not found",
        };
      }

      return {
        status: 200,
        success: "get call succeed!",
        result: submissionHistory,
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

      const submissionHistory = await SubmissionHistory.findByIdAndUpdate(
        id,
        this.request.body,
        {
          new: true,
        }
      );

      if (!submissionHistory) {
        return {
          status: 404,
          success: false,
          message: "Submission History not found",
        };
      }

      return {
        status: 200,
        success: "put call succeed!",
        result: submissionHistory,
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

      const submissionHistory = await SubmissionHistory.findByIdAndDelete(id);

      if (!submissionHistory) {
        return {
          status: 404,
          success: false,
          message: "Submission History not found",
        };
      }

      return {
        status: 200,
        success: "delete call succeed!",
        result: submissionHistory,
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
  const response = new SubmissionHistoryIdHandler(req, res);
  await response.send();
}
