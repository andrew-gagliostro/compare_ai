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
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";

ffmpeg.setFfmpegPath(ffmpegPath);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MAX_CHUNK_SIZE = 20 * 1024 * 1024; // 20 MB

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

const getAudioMetadata = (filePath: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        resolve(metadata);
      }
    });
  });
};

const splitAudioFile = async (filePath: string): Promise<string[]> => {
  const chunkPaths: string[] = [];
  const outputDir = path.dirname(filePath);
  const outputPattern = path.join(outputDir, "chunk_%03d.mp3");

  // Print file metadata
  try {
    const metadata = await getAudioMetadata(filePath);
    console.log("File Metadata:", JSON.stringify(metadata, null, 2));
  } catch (error) {
    console.error("Error getting file metadata:", error);
  }

  console.log(`Splitting audio file: ${filePath}`);

  await new Promise<void>((resolve, reject) => {
    ffmpeg(filePath)
      .outputOptions([
        "-f",
        "segment",
        "-segment_time",
        "600", // 10 minutes in seconds
        "-c",
        "copy",
      ])
      .output(outputPattern)
      .on("start", (commandLine) => {
        console.log("Spawned ffmpeg with command: " + commandLine);
      })
      .on("end", () => {
        console.log("Splitting finished");
        resolve();
      })
      .on("error", (err, stdout, stderr) => {
        console.error("Error during splitting:", err);
        console.error("ffmpeg stdout:", stdout);
        console.error("ffmpeg stderr:", stderr);
        reject(err);
      })
      .run();
  });

  // Collect the generated chunk files
  const files = fs.readdirSync(outputDir);
  files.forEach((file) => {
    if (file.startsWith("chunk_") && file.endsWith(".mp3")) {
      chunkPaths.push(path.join(outputDir, file));
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
    if (fs.existsSync(chunkPath)) {
      try {
        fs.unlinkSync(chunkPath); // Clean up the chunk file
        console.log(`Deleted chunk file: ${chunkPath}`);
      } catch (error) {
        console.error(`Failed to delete chunk file: ${chunkPath}`, error);
      }
    } else {
      console.warn(`Chunk file not found: ${chunkPath}`);
    }
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
    messages.splice(1, 0, {
      role: "system",
      content: `Additionally, answer the following question (continuing to use formatted markdown) based on the transcription: ${prompt}`,
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

      console.log(`AUDIOFILE_OBJECT: \n${JSON.stringify(audioFile, null, 4)}`);
      // Ensure the MIME type is one of the supported types
      const supportedMimeTypes = [
        "audio/mpeg",
        "audio/mp4",
        "audio/mpeg",
        "audio/mpga",
        "audio/m4a",
        "audio/wav",
        "audio/webm",
        "audio/x-m4a",
      ];

      if (!supportedMimeTypes.includes(audioFile.mimetype)) {
        return {
          status: 400,
          success: false,
          message: "Unsupported audio format",
        };
      }

      // Convert the file to mp3 if it's not already in that format
      const newFilePath = `${audioFile.filepath}.mp3`;
      if (audioFile.mimetype !== "audio/mpeg") {
        await new Promise<void>((resolve, reject) => {
          ffmpeg(audioFile.filepath)
            .toFormat("mp3")
            .on("end", () => {
              console.log(`Converted ${audioFile.filepath} to ${newFilePath}`);
              fs.renameSync(audioFile.filepath, newFilePath); // Ensure the file is renamed after conversion
              resolve();
            })
            .on("error", (err) => {
              console.error(
                `Error converting file: ${audioFile.filepath}`,
                err
              );
              reject(err);
            })
            .save(newFilePath);
        });
      } else {
        fs.renameSync(audioFile.filepath, newFilePath);
      }

      // Save the audio file to blob storage
      // const blob: PutBlobResult = await put(
      //   `/audio/${id}.mp3`,
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
