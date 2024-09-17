import { NextApiRequest, NextApiResponse } from "next";
import { mdToPdf } from "md-to-pdf";
import { unified } from "unified";
import markdown from "remark-parse";
import remarkGfm from "remark-gfm";
import docx from "remark-docx";

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
        const pdf = await mdToPdf(
          { content: response },
          {
            pdf_options: {
              format: "A4",
              printBackground: true,
            },
            css: `
              table {
                width: 100%;
                overflow: hidden; 
                text-overflow: ellipsis; 
                word-wrap: break-word;
                font-size: 8px;
              }
              th, td {
                text-align: left;
                border: 1px solid #ddd;
                word-wrap: break-word;
              }
              th {
                background-color: #f2f2f2;
              }
              .markdown-body {
                font-size: 10px;
              }
            `,
          }
        ).catch(console.error);
        if (pdf) {
          fileBuffer = pdf.content;
          contentType = "application/pdf";
          fileExtension = "pdf";
        }
        break;
      case "docx":
        const processor = unified()
          .use(markdown)
          .use(remarkGfm)
          .use(docx, { output: "buffer" });
        const doc = await processor.process(response);
        fileBuffer = await doc.result;
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
