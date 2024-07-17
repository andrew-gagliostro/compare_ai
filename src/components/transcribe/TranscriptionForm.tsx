import React, { useState, useRef, ChangeEvent } from "react";
import {
  TextField,
  Button,
  IconButton,
  Paper,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypePrism from "@mapbox/rehype-prism";
import "prismjs/themes/prism.css"; // Ensure this CSS is imported for syntax highlighting
import DeleteIcon from "@mui/icons-material/Delete";

interface FileWithPreview extends File {
  preview: string;
}

function TranscriptionForm() {
  const [audioFile, setAudioFile] = useState<FileWithPreview | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setAudioFile(Object.assign(file, { preview: URL.createObjectURL(file) }));
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
      elevation={3}
      sx={{
        width: "90%",
        my: 4,
        p: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Generate Transcription
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={handleFileChange}
          accept="audio/*"
        />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => fileInputRef.current?.click()}
            sx={{ mb: 2, maxWidth: "fit-content" }}
          >
            Choose File
          </Button>
          {audioFile && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body1" sx={{ flexGrow: 1 }}>
                {audioFile.name}
              </Typography>
              <IconButton onClick={handleRemoveFile}>
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </Box>
      </form>
      {response === "Loading..." ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 4,
          }}
        >
          <CircularProgress />
        </Box>
      ) : response ? (
        <Box
          sx={{
            my: 5,
            width: "95%",
            padding: 2,
            borderRadius: 1,
            flexDirection: "column",
            display: "flex",
            justifyContent: "flex-start",
            color: "black",
            fontSize: "medium",
            textAlign: "left",
            overflowX: "auto", // Allows horizontal scrolling
            // Ensures table is not wider than the screen on mobile devices
            maxWidth: {
              xs: "100vw", // Adjust for extra small screens
              sm: "100%", // Adjust for small screens and up
            },
            // Ensures the table is fully visible on small devices by subtracting potential margins/paddings
            marginLeft: { xs: "-16px", sm: "auto" },
            marginRight: { xs: "-16px", sm: "auto" },
            "&::-webkit-scrollbar": {
              height: "6px", // Adjust scrollbar height for aesthetics
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,0.3)", // Adjust scrollbar color for visibility
            },
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize, rehypePrism]}
          >
            {response.replace(/^"|"$/g, "")}
          </ReactMarkdown>
        </Box>
      ) : null}
    </Paper>
  );
}

export default TranscriptionForm;
