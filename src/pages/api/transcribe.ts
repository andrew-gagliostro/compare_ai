import { NextApiRequest, NextApiResponse } from "next";
import formidable, { File, IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import connect from "@/backend/connect";
import ResponseHelper from "@/backend/responseHelper";
import OpenAI from "openai";
import mime from "mime-types"; // Import mime-types for setting MIME type
import { ChatCompletionMessageParam } from "openai/resources";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const transcribeAudio = async (filePath: string): Promise<any> => {
  const audioStream = fs.createReadStream(filePath);

  const transcribeResponse = await openai.audio.transcriptions.create({
    file: audioStream,
    model: "whisper-1",
    prompt:
      "Kindly provide a transcription in English, ensuring to include appropriate capitalization and punctuation as needed.",
    response_format: "verbose_json",
    timestamp_granularities: ["segment"],
  });

  let messages: any[] = [
    {
      role: "system",
      content:
        'You will be provided with a object representing a transcription of an audio recording. \
        This object will have fields "text" as well as "segments", representing the whole text as well as timestamped segments.\
        Please respond with (and only with) a formatted markdown representation of the transcription, including timestamps between suspected changes of speakers and/or new sentences/breaks in speaking.',
    },
    {
      role: "user",
      content: JSON.stringify(transcribeResponse, null, 4),
    },
  ];

  let aiResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: messages as ChatCompletionMessageParam[],
    temperature: 0.5,
  });

  let response = JSON.stringify(aiResponse.choices[0].message.content);
  let plainResponse = response.replace(/\\n/g, "\n");
  plainResponse = plainResponse.replace(/^"|"$/g, "");

  console.log("AI MARKDOWN RESPONSE: \n" + plainResponse);

  return plainResponse;
};

export const config = {
  api: {
    bodyParser: false, // Disabling the default bodyParser
  },
};

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
    try {
      const { files } = await parseForm(this.request);
      console.log("Files received: ", files); // Log the files object to debug
      let audioFile = files.audio as File;

      if (!audioFile) {
        return {
          status: 400,
          success: false,
          message: "No audio file uploaded",
        };
      }

      // If audioFile is an array, take the first element
      if (Array.isArray(audioFile)) {
        audioFile = audioFile[0];
      }

      console.log("Audio file details: ", {
        filepath: audioFile.filepath,
        mimetype: audioFile.mimetype,
        originalFilename: audioFile.originalFilename,
      }); // Log the file details to debug

      // Ensure the MIME type is correct
      if (audioFile.mimetype !== "audio/m4a") {
        audioFile.mimetype = "audio/m4a";
      }

      // Rename the file if necessary
      const newFilePath = `${audioFile.filepath}.m4a`;
      fs.renameSync(audioFile.filepath, newFilePath);

      const transcription = await transcribeAudio(newFilePath);
      fs.unlinkSync(newFilePath); // Clean up the uploaded file
      console.log(JSON.stringify(transcription, null, 4));

      return {
        status: 200,
        success: true,
        transcription,
      };
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        success: false,
        message: "Internal server error",
      };
    }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connect();
  const response = new Response(req, res);
  await response.send();
}
