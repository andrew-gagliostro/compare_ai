import { Document, Packer, Paragraph, TextRun } from "docx";
import { promisify } from "util";
import { Readable } from "stream";

export const convertMarkdownToDocx = async (
  markdown: string
): Promise<Buffer> => {
  const doc = new Document({
    sections: [
      {
        children: markdown.split("\n").map((line) => new Paragraph(line)),
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
};
