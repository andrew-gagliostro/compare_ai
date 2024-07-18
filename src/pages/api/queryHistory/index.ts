import QueryHistory, { QueryHistoryModel } from "@/models/QueryHistory"; // or wherever your schema is located;
import User, { UserModel } from "@/models/User"; // or wherever your schema is located;
var createError = require("http-errors");
var path = require("path");
const cheerio = require("cheerio");
const axios = require("axios");
const { JSDOM, VirtualConsole } = require("jsdom");
const OpenAI = require("openai");
const { Readability } = require("@mozilla/readability");
const { NodeHtmlMarkdown } = require("node-html-markdown");
import type { NextApiRequest, NextApiResponse } from "next";
import ResponseHelper from "@/backend/responseHelper";
import connect from "@/backend/connect";

class QueryHistoryHandler extends ResponseHelper {
  async post(): Promise<any> {
    /* input: user_id, prompt, links, response. */
    try {
      let user = { _id: "unidentified" } as any;
      if (!this.session || !this.session.user) {
        // return {
        //   status: 403,
        //   success: false,
        //   message: "Forbidden",
        // };
        user = { _id: "unidentified" };
      } else {
        user = (await User.findOne({
          name: this.session.user.name,
        })) as UserModel;
      }

      const body = { ...this.request.body, user_id: user._id };
      const queryHistory = new QueryHistory(body);

      await queryHistory.save();

      return {
        status: 200,
        success: "post call succeed!",
        result: queryHistory,
      };
    } catch (e) {
      console.log(e);
      return {
        status: 500,
        success: "post call failed!",
        error: e,
      };
    }
  }

  async get(): Promise<any> {
    try {
      let guestUser = false;
      if (!this.session || !this.session.user) {
        // return {
        //   status: 403,
        //   success: false,
        //   message: "Forbidden",
        // };
        guestUser = true;
      }

      if (guestUser) {
        const queryHistory = await QueryHistory.find({
          user_id: "guest",
        });

        return {
          status: 200,
          success: "get call succeed!",
          result: queryHistory,
        };
      }

      const user = await User.findOne({ name: this.session.user.name });

      const userId = user._id;
      const query = { user_id: userId };
      if (this.request.query.queryType) {
        query["queryType"] = this.request.query.queryType;
      } else {
        query["queryType"] = null;
      }

      const queryHistory = await QueryHistory.find(query);

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
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connect();
  const response = new QueryHistoryHandler(req, res);
  await response.send();
}
