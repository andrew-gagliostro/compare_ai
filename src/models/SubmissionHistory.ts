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

export interface LinkModel {
  link: string;
  status: LinkStatus;
}

export interface SubmissionHistoryModel {
  _id?: string;
  user_id: string;
  prompt: string;
  links: Array<LinkModel>;
  response: string;
  status: Status;
}

const submissionHistorySchema = new mongoose.Schema<SubmissionHistoryModel>(
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
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

export default (mongoose.models
  .SubmissionHistory as mongoose.Model<SubmissionHistoryModel>) ||
  mongoose.model("SubmissionHistory", submissionHistorySchema);
