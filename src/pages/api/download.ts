import { NextApiRequest, NextApiResponse } from "next";
import {
  convertMarkdownToDocx,
  convertMarkdownToPdf,
} from "@/backend/utils/conversion";
import { saveAs } from "file-saver";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { format, response } = req.body;

  try {
    let fileBuffer;
    let contentType;
    let fileExtension;

    switch (format) {
      case "md":
        fileBuffer = Buffer.from(response, "utf-8");
        contentType = "text/markdown";
        fileExtension = "md";
        break;
      case "pdf":
        fileBuffer = await convertMarkdownToPdf(response);
        contentType = "application/pdf";
        fileExtension = "pdf";
        break;
      case "docx":
        fileBuffer = await convertMarkdownToDocx(response);
        contentType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        fileExtension = "docx";
        break;
      default:
        return res.status(400).json({ error: "Invalid format" });
    }

    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=response.${fileExtension}`
    );
    res.send(fileBuffer);
  } catch (error) {
    console.error("Error converting file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
