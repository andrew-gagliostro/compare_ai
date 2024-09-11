import { Document, Packer, Paragraph, TextRun } from "docx";
import markdownToPdf from "markdown-pdf";
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

export const convertMarkdownToPdf = async (
  markdown: string
): Promise<Buffer> => {
  const toPdf = promisify(markdownToPdf().from.string);
  const pdfBuffer = await toPdf(markdown);
  return pdfBuffer;
};
