/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import cheerio from "cheerio";
import axios from "axios";
import { JSDOM, VirtualConsole } from "jsdom";
import OpenAI from "openai";
import { NodeHtmlMarkdown } from "node-html-markdown";
import type { NextApiRequest, NextApiResponse } from "next";
import ResponseHelper from "@/backend/responseHelper";
import formidable, { File, IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import os from "os";
import puppeteer from "puppeteer";
import { Readability } from "@mozilla/readability";
import TurndownService from "turndown";
import { ChatCompletionMessageParam } from "openai/resources";
import { parse } from "csv-parse/sync";
import SubmissionHistory from "@/models/SubmissionHistory";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const config = {
  maxDuration: 200,
  api: {
    bodyParser: false, // Disable the default bodyParser
  },
};

function getRandomUserAgent() {
  const userAgents = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Safari/605.1.15",
    // Add more user agents as needed
  ];
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

// Helper to simulate human-like delays
function delay(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

// Renamed and updated fetch function
async function fetchReadableUrlContent(url) {
  try {
    await delay(1000 + Math.random() * 2000); // Random delay between 1s and 3s

    const axiosConfig = {
      headers: {
        "User-Agent": getRandomUserAgent(),
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        DNT: "1", // Do Not Track Request Header
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
    };

    // Use axios to fetch the webpage content
    const response = await axios.get(url, axiosConfig);

    const htmlContent = response.data;
    const dom = new JSDOM(htmlContent);
    const article = new Readability(dom.window.document).parse();

    // Verify that the article content exists
    console.log("ARTICLE: " + JSON.stringify(article, null, 4));
    if (!article || !article.content) {
      console.error("Failed to retrieve the article content.");
      return null;
    }

    // Convert the article content from HTML to plain text or simpler markdown
    const markdown = NodeHtmlMarkdown.translate(article.content);

    return markdown;
  } catch (error) {
    console.error("An error occurred:", error);
    return null;
  }
}

// function that takes a string and truncates it to a word boundary of given word count
function truncateStringToTokenCount(str: string, num: number) {
  return str.split(/\s+/).slice(0, num).join(" ");
}

// function that removes links from markdown
function removeLinksFromMarkdown(text: string) {
  // Replace all link occurrences with the link text
  let regex = /\[([^\]]+)]\(([^)]+)\)/g;
  text = text.replace(regex, "$1");
  return text;
}

async function parseForm(
  req: NextApiRequest
): Promise<{ fields: any; files: any }> {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

async function parseCsvFile(filePath: string): Promise<string> {
  // Read the entire file content
  try {
    const fileContent = await fs.promises.readFile(filePath);

    // Parse the CSV without converting to JSON object, each record will be an array of strings
    const records = parse(fileContent, {
      skip_empty_lines: true,
      trim: true,
      bom: true,
      relax_column_count: true,
      relax_quotes: true,
      skipRecordsWithEmptyValues: true,
    });

    // Join each row with a comma, and then join rows with newlines to form a string that looks like a regular CSV
    return records.map((row) => row.join(",")).join("\n");
  } catch (e) {
    console.error("Unable to parse CSV file", e);
    return "";
  }
}

class Response extends ResponseHelper {
  async post(): Promise<any> {
    const { id } = this.request.query;
    /*make a script that will take prompt of type string and links
   of string array and feed the prompt to gpt4 and return the result
  */
    let filePaths: string[] = [];
    let prompt: string = "";
    try {
      /*take in the prompt (string) and links (string array) from the client request body
    using openai (version 4.4.0), feed the prompt using "gpt-3.5-turbo" model and using openai.ChatCompletion.create return the response in the
    result field of res object
    */

      const { fields, files } = await parseForm(this.request);

      console.log("COMPARE: setting up request body");

      try {
        prompt = fields.prompt.toString();
      } catch (parseError) {
        return {
          status: 400,
          success: "Error parsing links",
          error: parseError,
        };
      }

      let messages: any[] = [
        {
          role: "user",
          content: prompt,
        },
        {
          role: "system",
          content:
            "You will be provided with a set of messages, where each message represents text scraped from a web page and/or messages parsed from csv files (denoted with names WEB:${link} or CSV). Your task is to return a comparison/analysis (depending on the above user prompt) based on the content included in the upcoming low messages \
           (which is potentially unstructured content pulled from web pages and articles) and in the context of the previous prompt question. \
            If the content of a web page, the content of the message will start with status:url where url is the url of the page and status is the parsing status, and then a new line where the content of the page will start. If a page is unreadable(parsing failed), a web message will either be only the status:url or the status:url and some error response - please address any unreadable content in your response.\
            I want you to use the content as your single source of truth when answering their prompt.\
            Please provide a table comparing the different objects (if appropriate) as well as long-form response to their prompt (using markdown for the formatting of the entire response, including the table)",
        },
      ];

      let scrapedText = [];

      const userHistory = await SubmissionHistory.findById(id);
      if (!userHistory) {
        return {
          status: 404,
          success: false,
          message: "userHistory not found",
        };
      }

      // Extract links from the userHistory document
      const { links } = userHistory;
      // Now you have prompt as a string, links as a string array, and filePaths as an array of the paths to the saved files
      console.log({ prompt, links, filePaths });
      let linkStatuses = [];
      for (let link of links) {
        const url = link.link;

        const content = await fetchReadableUrlContent(link.link); // Assuming each link is an object with a 'url' property
        if (content) {
          // If content was successfully fetched and parsed, mark the link as 'completed'
          linkStatuses.push({ link: link.link, status: "Parsed" });
          messages.push({
            role: "user",
            content: `Parsed:${url}\n${content ? content : ""}`,
            name: `WEB`,
          });
        } else {
          // If fetching/parsing failed, mark the link as 'failed'
          linkStatuses.push({ link: link.link, status: "Failed To Parse" });
          messages.push({
            role: "user",
            content: `Failed To Parse:${url}\n${content ? content : ""}`,
            name: `WEB`,
          });
        }
      }
      userHistory.links = linkStatuses; // Assuming there's a field in your schema to store these statuses
      await userHistory.save();

      if (files.files) {
        const uploadedFiles = Array.isArray(files.files)
          ? files.files
          : [files.files];
        for (let file of uploadedFiles) {
          const csvContent = await parseCsvFile(file.filepath);
          messages.push({
            role: "user",
            content: csvContent,
            name: "CSV",
          });
          try {
            await fs.promises.unlink(file.filepath);
            console.log(`Unlinked filepath: ${file.filepath}`);
          } catch (e) {
            console.error(`Unable to unlink filepath: ${file.filepath}`, e);
          }
        }
      }

      await Promise.all(
        filePaths.map(async (filePath) => {
          await fs.promises.unlink(filePath);
        })
      );

      // messages.push({
      //   role: "system",
      //   content: JSON.stringify(scrapedText),
      // });

      // scrape text from https links and add each to new array of strings called scrapedText
      console.log("MESSAGES: " + JSON.stringify(messages, null, 4));
      const docWithMessages = await SubmissionHistory.findByIdAndUpdate(
        id,
        { $set: { messages: messages } },
        { new: true } // This option returns the document after update was applied
      );

      let aiResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: messages as ChatCompletionMessageParam[],
        temperature: 0.75,
      });

      // log the response and return the response to client with 200 status code
      console.log(aiResponse);
      let response = JSON.stringify(aiResponse.choices[0].message.content);
      let plainResponse = response.replace(/\\n/g, "\n");
      plainResponse = plainResponse.replace(/^"|"$/g, "");
      const docWithResponse = await SubmissionHistory.findByIdAndUpdate(
        id,
        { $set: { response: plainResponse } },
        { new: true } // This option returns the document after update was applied
      );

      return {
        status: 200,
        success: "post call succeed!",
        result: plainResponse,
      };
    } catch (e) {
      // log error and return error to client with status code and info about error
      console.log(e);
      return {
        status: 500,
        success: "post call failed!",
        error: e,
      };
      await Promise.all(
        filePaths.map(async (filePath) => {
          await fs.promises.unlink(filePath);
          // If you also want to remove the directory (assuming one directory per file)
          await fs.promises.rmdir(path.dirname(filePath));
        })
      );
    }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = new Response(req, res);
  await response.send();
}
