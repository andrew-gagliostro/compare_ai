import QueryHistory, { QueryHistoryModel } from "@/models/QueryHistory"; // Adjust the import path as needed
import User, { UserModel } from "@/models/User"; // Adjust the import path as needed
var createError = require("http-errors");
const { ObjectId } = require("mongodb");
import type { NextApiRequest, NextApiResponse } from "next";
import ResponseHelper from "@/backend/responseHelper";
import connect from "@/backend/connect";
import { fetchReadableUrlContent } from "@/backend/utils/fetchContent";

class ParseLinksHandler extends ResponseHelper {
  async post(): Promise<any> {
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

      let linkStatuses = [];

      for (let link of queryHistory.links) {
        const url = link.link;

        const content = await fetchReadableUrlContent(url); // Assuming each link is an object with a 'url' property
        if (content) {
          // If content was successfully fetched and parsed, mark the link as 'completed'
          linkStatuses.push({
            link: link.link,
            status: "Parsed",
            content: content,
          });
        } else {
          // If fetching/parsing failed, mark the link as 'failed'
          linkStatuses.push({
            link: link.link,
            status: "Failed To Parse",
          });
        }
      }
      queryHistory.links = linkStatuses;

      queryHistory.save();

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
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connect();
  const response = new ParseLinksHandler(req, res);
  await response.send();
}
