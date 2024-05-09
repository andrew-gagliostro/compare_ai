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
import { chromium } from "playwright";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const config = {
  maxDuration: 200,
  api: {
    bodyParser: false, // Disable the default bodyParser
  },
};

// async function fetchAndConvertToMarkdown(url) {
//   try {
//     // Use axios to fetch the webpage content
//     const response = await axios.get(url, {
//       headers: {
//         "User-Agent":
//           "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
//       },
//     });

//     const htmlContent = response.data;
//     const dom = new JSDOM(htmlContent);
//     const article = new Readability(dom.window.document).parse();

//     // Verify that the article content exists
//     if (!article || !article.content) {
//       console.error("Failed to retrieve the article content.");
//       return null;
//     }

//     // Convert the article content from HTML to Markdown
//     const markdown = NodeHtmlMarkdown.translate(article.content);

//     return markdown;
//   } catch (error) {
//     console.error("An error occurred:", error);
//     return null;
//   }
// }

async function fetchAndConvertToMarkdown(url: string): Promise<string | null> {
  const browser = await chromium.launch({ headless: true }); // Make sure headless is set to true for production environments
  try {
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Safari/537.36",
      geolocation: { latitude: 59.95, longitude: 30.31667 },
      permissions: ["geolocation"],
    });
    const page = await context.newPage();

    // Disguise headless state
    await context.addInitScript(() => {
      Object.defineProperty(navigator, "webdriver", {
        get: () => false,
      });
    });

    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Simulate human-like delays
    await page.waitForTimeout(1000); // wait for 1 second

    // Get the entire HTML of the page
    const htmlContent = await page.content();

    console.log("HTMLCONTENT: " + JSON.stringify(htmlContent));

    // Use JSDOM and Readability to parse and extract meaningful content
    const dom = new JSDOM(htmlContent, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    await browser.close();

    if (article && article.textContent) {
      console.log("ARTICLE: " + JSON.stringify(article));
      return article.textContent;
    }
    return null;
  } catch (error) {
    console.error("Error loading the page:", error);
    await browser.close();
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

class Response extends ResponseHelper {
  async post(): Promise<any> {
    /*make a script that will take prompt of type string and links
   of string array and feed the prompt to gpt4 and return the result
  */
    let filePaths: string[] = [];
    let prompt: string = "";
    let links: string[] = [];
    try {
      /*take in the prompt (string) and links (string array) from the client request body
    using openai (version 4.4.0), feed the prompt using "gpt-3.5-turbo" model and using openai.ChatCompletion.create return the response in the
    result field of res object
    */

      const { fields, files } = await parseForm(this.request);

      console.log("COMPARE: setting up request body");

      try {
        prompt = fields.prompt.toString();
        Object.keys(fields).forEach((key) => {
          if (key.startsWith("links[")) {
            links.push(fields[key].toString());
          }
        });
      } catch (parseError) {
        return {
          status: 400,
          success: "Error parsing links",
          error: parseError,
        };
      }

      if (files.files) {
        const uploadedFiles = Array.isArray(files.files)
          ? files.files
          : [files.files];
        filePaths = uploadedFiles.map((file) => file.filepath);
      }

      // Now you have prompt as a string, links as a string array, and filePaths as an array of the paths to the saved files
      console.log({ prompt, links, filePaths });

      let messages = [
        {
          role: "user",
          content: prompt,
        },
        {
          role: "system",
          content:
            "You will be provided with a set of messages, where each message represents text from a web page. Your task is to return a comparison/analysis (depending on the above user prompt) based on the content included in the below messages \
            (which is potentially unstructured content pulled from web pages and articles) and in \
           the context of the previous prompt question. For example, if the prompt question is 'What is the best laptop for me?', and the messages are text from webpages that contain data regarding different laptops \
           please provide a long-form response to their prompt as well as a table comparing the different objects if appropriate (using markdown for the formatting of the entire response, including the table)",
        },
      ];

      let scrapedText = [];

      for (let link of links) {
        const url = link;

        const content = await fetchAndConvertToMarkdown(url);
        scrapedText.push(JSON.stringify(content));
      }

      await Promise.all(
        filePaths.map(async (filePath) => {
          await fs.promises.unlink(filePath);
        })
      );

      messages.push({
        role: "system",
        content: JSON.stringify(scrapedText),
      });

      // scrape text from https links and add each to new array of strings called scrapedText
      console.log("MESSAGES: " + JSON.stringify(messages));
      let aiResponse = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: messages as ChatCompletionMessageParam[],
        temperature: 0.75,
      });

      // log the response and return the response to client with 200 status code
      console.log(aiResponse);
      let response = JSON.stringify(aiResponse.choices[0].message.content);
      const plainResponse = response.replace(/\\n/g, "\n");
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
