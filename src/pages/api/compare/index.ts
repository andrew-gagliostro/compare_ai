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

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateChatPrompt(url: string) {
  const headers = new Headers({
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
  });

  const resp = await fetch(url, { headers });

  const text = await resp.text();

  const virtualConsole = new VirtualConsole();
  const doc = new JSDOM(text, { virtualConsole });

  const reader = new Readability(doc.window.document);
  const article = reader.parse();
  const contentMarkdown = NodeHtmlMarkdown.translate(article.content);

  console.log(
    "CONTENT MARKDOWN: \n" + JSON.stringify(contentMarkdown, null, 4)
  );

  const markdown = removeLinksFromMarkdown(contentMarkdown);

  return markdown;

  const truncatedString = truncateStringToTokenCount(markdown, 3500);

  // return {
  //   prompt: [
  //     { role: "system", content: "You are a helpful assistant." },
  //     {
  //       role: "user",
  //       content:
  //         "Can you help create a <200 word summary of the following web page based on key metrics that you can find?",
  //     },
  //     { role: "user", content: "The article is formatted as markdown." },
  //     {
  //       role: "user",
  //       content: `The title of the page is ${article.title}.`,
  //     },
  //     {
  //       role: "user",
  //       content: `The page is as follows: \n${truncatedString}`,
  //     },
  //   ],
  //   title: `${article.title}`,
  // };
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

        // const { prompt, title } = await generateChatPrompt(url);
        const content = await generateChatPrompt(url);
        const chatInput = {
          model: "gpt-4",
          messages: prompt,
          temperature: 0.4,
        };

        // const completion = await openai.chat.completions.create(chatInput);
        // console.log(JSON.stringify(completion.choices[0].message));
        // scrapedText.push(JSON.stringify(completion.choices[0].message.content));
        scrapedText.push(JSON.stringify(content));
      }

      messages.push({
        role: "system",
        content: JSON.stringify(scrapedText),
      });

      // messages.push({
      //   role: "user",
      //   content: JSON.stringify(scrapedText),
      // });

      // scrape text from https links and add each to new array of strings called scrapedText

      let response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: messages,
        temperature: 0,
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
