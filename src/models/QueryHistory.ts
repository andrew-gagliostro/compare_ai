import { PutBlobResult } from "@vercel/blob";
import mongoose from "mongoose";

enum Status {
  CREATED = "Created",
  FAILED = "Failed",
  COMPLETED = "Completed",
}

enum LinkStatus {
  SUBMITTED = "Submitted",
  PARSED = "Parsed",
  FAILED_TO_PARSE = "Failed To Parse",
}

export enum QueryType {
  TRANSCRIPTION = "TRANSCRIPTION",
  WEB_FILE_SCRAPE = "WEB_FILE_SCRAPE",
}

export interface LinkModel {
  link: string;
  content: string;
  ß;
  status: LinkStatus;
}

export interface QueryHistoryModel {
  _id?: string;
  user_id: string;
  prompt: string;
  links: Array<LinkModel>;
  response: string;
  status: Status;
  queryType: QueryType; // Add this line
  messages?: Array<Object>;
  createdAt: string;
  blob?: PutBlobResult;
}

const queryHistorySchema = new mongoose.Schema<QueryHistoryModel>(
  {
    user_id: {
      type: String,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    links: {
      type: [
        new mongoose.Schema<LinkModel>({
          link: {
            type: String,
            required: true,
          },
          content: {
            type: String,
            required: false,
          },
          status: {
            type: String,
            enum: LinkStatus,
            required: true,
          },
        }),
      ],
      required: true,
    },
    response: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: Status,
      required: false,
    },
    queryType: {
      type: String,
      enum: Object.values(QueryType),
      required: true,
    },
    messages: {
      type: [Object],
      required: false,
    },
    blob: {
      type: Object,
      required: false,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

export default (mongoose.models
  .QueryHistory as mongoose.Model<QueryHistoryModel>) ||
  mongoose.model("QueryHistory", queryHistorySchema);
