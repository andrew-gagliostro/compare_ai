import { NextApiRequest, NextApiResponse } from "next";
import formidable, { File, IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import connect from "@/backend/connect";
import ResponseHelper from "@/backend/responseHelper";
import OpenAI from "openai";
import mime from "mime-types";
import { ChatCompletionMessageParam } from "openai/resources";
import QueryHistory from "@/models/QueryHistory";
import { put, PutBlobResult } from "@vercel/blob";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";

const FFMPEG_CORE_VERSION = "0.12.5";
const ffmpeg = new FFmpeg();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MAX_CHUNK_SIZE = 20 * 1024 * 1024; // 20 MB

const loadFFmpeg = async () => {
  const baseURL = `https://unpkg.com/@ffmpeg/core-mt@${FFMPEG_CORE_VERSION}/dist/umd`;

  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    workerURL: await toBlobURL(
      `${baseURL}/ffmpeg-core.worker.js`,
      "text/javascript"
    ),
  });
};

const transcribeAudioChunk = async (
  chunkPath: string,
  prompt: string | null
): Promise<any> => {
  const audioStream = fs.createReadStream(chunkPath);
  console.log("transcribing chunk: " + chunkPath);

  const transcribeResponse: any = await openai.audio.transcriptions.create({
    file: audioStream,
    model: "whisper-1",
    prompt:
      "Kindly provide a transcription in English, ensuring to include appropriate capitalization and punctuation as needed.",
    response_format: "verbose_json",
    timestamp_granularities: ["segment"],
  });

  console.log(
    `finished transcribing ${chunkPath}: \n ${JSON.stringify(
      transcribeResponse,
      null,
      4
    )}`
  );
  return transcribeResponse.segments.map((segment: any) => ({
    text: segment.text,
    start: segment.start,
    end: segment.end,
  }));
};

const splitAudioFile = async (filePath: string): Promise<string[]> => {
  const chunkPaths: string[] = [];
  const outputDir = path.dirname(filePath);
  const outputPattern = "chunk_%03d.m4a";

  if (!ffmpeg.loaded) {
    await loadFFmpeg();
  }

  await ffmpeg.writeFile("input.m4a", await fetchFile(filePath));

  await ffmpeg.exec([
    "-i",
    "input.m4a",
    "-f",
    "segment",
    "-segment_time",
    "600", // 10 minutes in seconds
    "-c",
    "copy",
    outputPattern,
  ]);

  const files = await ffmpeg.listDir("readdir");
  files.forEach(async (file) => {
    if (file.startsWith("chunk_") && file.endsWith(".m4a")) {
      const chunkPath = path.join(outputDir, file);
      fs.writeFileSync(chunkPath, await ffmpeg.readFile(file));
      chunkPaths.push(chunkPath);
    }
  });

  console.log(`CHUNKPATHS: ${chunkPaths}`);
  return chunkPaths;
};

const transcribeAudio = async (
  filePath: string,
  prompt: string | null
): Promise<any> => {
  const chunkPaths = await splitAudioFile(filePath);
  const transcriptions = [];

  for (const chunkPath of chunkPaths) {
    try {
      const transcribeResponse = await transcribeAudioChunk(chunkPath, prompt);
      transcriptions.push(...transcribeResponse);
    } catch (error) {
      console.error(`Failed to transcribe chunk: ${chunkPath}`, error);
    }
  }

  for (const chunkPath of chunkPaths) {
    fs.unlinkSync(chunkPath); // Clean up the chunk file
  }

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
      content: JSON.stringify(transcriptions),
    },
  ];

  if (prompt) {
    messages.push({
      role: "system",
      content: `Additionally, answer the following question based on the transcription: ${prompt}`,
    });
  }

  let aiResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: messages as ChatCompletionMessageParam[],
    temperature: 0.25,
  });

  let response = aiResponse.choices[0].message.content;
  let plainResponse = response.replace(/```sh/g, "```bash");

  return plainResponse;
};

export const config = {
  api: {
    bodyParser: false,
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
    const { id } = this.request.query;
    try {
      const { files } = await parseForm(this.request);
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

      // Ensure the MIME type is correct
      const supportedMimeTypes = [
        "audio/mpeg",
        "audio/mp4",
        "audio/mpeg",
        "audio/mpga",
        "audio/m4a",
        "audio/wav",
        "audio/webm",
      ];

      if (!supportedMimeTypes.includes(audioFile.mimetype)) {
        return {
          status: 400,
          success: false,
          message: "Unsupported audio format",
        };
      }

      // Convert the file to m4a if it's not already in that format
      const newFilePath = `${audioFile.filepath}.m4a`;
      if (audioFile.mimetype !== "audio/m4a") {
        if (!ffmpeg.isLoaded()) {
          await loadFFmpeg();
        }

        await ffmpeg.writeFile("input", await fetchFile(audioFile.filepath));
        await ffmpeg.exec(["-i", "input", "output.m4a"]);
        fs.writeFileSync(newFilePath, ffmpeg.readFile("output.m4a"));
      } else {
        fs.renameSync(audioFile.filepath, newFilePath);
      }

      // Save the audio file to blob storage
      // const blob: PutBlobResult = await put(
      //   `/audio/${id}.m4a`,
      //   fs.createReadStream(newFilePath),
      //   {
      //     access: "public",
      //     addRandomSuffix: false,
      //   }
      // );

      // console.log("SAVED TO BLOB");

      const queryHistory = await QueryHistory.findById(id);
      if (!queryHistory) {
        return {
          status: 404,
          success: false,
          message: "Query history not found",
        };
      }

      const transcription = await transcribeAudio(
        newFilePath,
        queryHistory.prompt
      );
      fs.unlinkSync(newFilePath); // Clean up the uploaded file

      await QueryHistory.findByIdAndUpdate(
        id,
        { $set: { response: transcription /*blob: blob*/ } },
        { new: true }
      );

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
