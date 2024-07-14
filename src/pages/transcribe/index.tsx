import React, { ChangeEvent, useRef, useState } from "react";
import {
  TextField,
  Button,
  IconButton,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypePrism from "@mapbox/rehype-prism";
import "prismjs/themes/prism.css";
import DeleteIcon from "@mui/icons-material/Delete";

interface FileWithPreview extends File {
  preview: string;
}

function TranscriptionForm() {
  const [audioFile, setAudioFile] = useState<FileWithPreview | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setAudioFile(
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
    }
  };

  const handleRemoveFile = () => {
    if (audioFile) {
      URL.revokeObjectURL(audioFile.preview);
      setAudioFile(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setResponse("Loading...");

    if (!audioFile) {
      setResponse("Please upload an audio file.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", audioFile);

    try {
      const response = await axios.post("/api/transcribe", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResponse(response.data.transcription);
    } catch (error) {
      console.error(error);
      setResponse("An error occurred. Please try again.");
    } finally {
      handleRemoveFile();
    }
  };

  return (
    <Paper
      sx={{
        width: "90%",
        my: 4,
        p: 3,
        backgroundColor: "rgba(255, 255, 255, 0.75)", // Semi-transparent white background
        backdropFilter: "blur(10px)", // Adding a blur effect to the background
        borderRadius: "15px", // Optional: Adding some rounded corners to the Paper component
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          alignSelf: "flex-start",
          color: "secondary.main",
          fontWeight: "bolder",
          fontSize: "1.3rem",
          pb: 2,
        }}
      >
        Transcription Form
      </Box>
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <Box sx={{ marginBottom: 2, display: "flex", flexDirection: "column" }}>
          <Typography fontWeight={"bold"}>Upload Audio File</Typography>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept="audio/*"
            style={{ display: "none" }}
          />
          <Button
            variant="contained"
            sx={{
              display: "flex",
              backgroundColor: "secondary.main",
              mt: 1,
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            Choose File
          </Button>
          {audioFile && (
            <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
              <Typography>{audioFile.name}</Typography>
              <IconButton onClick={handleRemoveFile}>
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </Box>
        <Button
          type="submit"
          variant="contained"
          sx={{
            display: "flex",
            maxWidth: "20%",
            justifySelf: "center",
            alignSelf: "center",
            margin: "auto",
            backgroundColor: "secondary.main",
          }}
        >
          Submit
        </Button>
      </form>
      <Box sx={{ marginTop: 10 }}>
        {response === "Loading..." ? (
          <Box className="flex flex-col mt-10 justify-center items-center">
            <svg
              aria-hidden="true"
              className="w-16 h-16 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <p className="text-black mt-10">{response}</p>
          </Box>
        ) : response ? (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              color: "white",
              fontSize: "medium",
              textAlign: "left",
              background: "linear-gradient(to bottom,  #e0e0e0, #e6e6e6)",
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                my: 1,
                width: "95%",
                padding: 2,
                borderRadius: 1,
                flexDirection: "column",
                display: "flex",
                justifyContent: "flex-start",
                color: "black",
                fontSize: "medium",
                textAlign: "left",
                overflowX: "auto",
                maxWidth: {
                  xs: "100vw",
                  sm: "100%",
                },
                marginLeft: { xs: "-16px", sm: "auto" },
                marginRight: { xs: "-16px", sm: "auto" },
                "&::-webkit-scrollbar": {
                  height: "6px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0,0,0,0.3)",
                },
              }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize, rehypePrism]}
              >
                {response}
              </ReactMarkdown>
            </Box>
          </Box>
        ) : null}
      </Box>
    </Paper>
  );
}

export default TranscriptionForm;
