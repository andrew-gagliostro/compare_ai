import mongoose from "mongoose";

export interface SubmissionHistoryModel {
  _id?: string;
  user_id: string;
  prompt: string;
  links: Array<string>;
  response: string;
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
      type: [String],
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

export default (mongoose.models
  .SubmissionHistory as mongoose.Model<SubmissionHistoryModel>) ||
  mongoose.model("SubmissionHistory", submissionHistorySchema);
