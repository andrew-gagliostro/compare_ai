/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import axios from "axios";
import { JSDOM } from "jsdom";
import OpenAI from "openai";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { Readability } from "@mozilla/readability";

export const config = {
  maxDuration: 60,
  api: {
    bodyParser: false, // Disable the default bodyParser
  },
};

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
export async function fetchReadableUrlContent(url) {
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
