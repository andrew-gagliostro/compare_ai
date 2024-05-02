/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
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
const puppeteer = require("puppeteer");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function fetchAndConvertToMarkdown(url) {
  try {
    // Use axios to fetch the webpage content
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
      },
    });

    const htmlContent = response.data;
    const dom = new JSDOM(htmlContent);
    const article = new Readability(dom.window.document).parse();

    // Verify that the article content exists
    if (!article || !article.content) {
      console.error("Failed to retrieve the article content.");
      return null;
    }

    // Convert the article content from HTML to Markdown
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

class Response extends ResponseHelper {
  async post(): Promise<any> {
    /*make a script that will take prompt of type string and links
   of string array and feed the prompt to gpt4 and return the result
  */
    try {
      /*take in the prompt (string) and links (string array) from the client request body
    using openai (version 4.4.0), feed the prompt using "gpt-3.5-turbo" model and using openai.ChatCompletion.create return the response in the
    result field of res object
    */
      console.log("COMPARE: setting up request body");
      const { prompt, links } = this.request.body;

      let messages = [
        {
          role: "user",
          content: prompt,
        },
        {
          role: "system",
          content:
            "You will be provided with a set of messages, where each message represents text from a web page. Your task is to return a comparison of the different items/objects mentioned in the messages in \
           the context of the previous prompt question. For example, if the prompt question is 'What is the best laptop for me?', and the messages are text from webpages that contain data regarding different laptops \
           please provide a long form as well as a table comparing the objects using markdown",
        },
      ];

      let scrapedText = [];

      for (let link of links) {
        const url = link;

        const content = await fetchAndConvertToMarkdown(url);

        scrapedText.push(JSON.stringify(content));
      }

      messages.push({
        role: "system",
        content: JSON.stringify(scrapedText),
      });

      // scrape text from https links and add each to new array of strings called scrapedText

      let response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: messages,
        temperature: 0.75,
      });
      // log the response and return the response to client with 200 status code
      console.log(response);
      response = JSON.stringify(response.choices[0].message.content);
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
