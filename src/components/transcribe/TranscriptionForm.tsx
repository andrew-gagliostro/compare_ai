import React, {
  useState,
  useRef,
  ChangeEvent,
  useEffect,
  useContext,
} from "react";
import {
  TextField,
  Button,
  IconButton,
  Paper,
  Box,
  Typography,
  CircularProgress,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Tabs,
  Tab,
} from "@mui/material";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypePrism from "@mapbox/rehype-prism";
import "prismjs/themes/prism.css"; // Ensure this CSS is imported for syntax highlighting
import DeleteIcon from "@mui/icons-material/Delete";
import { AudioFile } from "@mui/icons-material";
import { AuthCtx } from "@/context/AuthContext";
import { UserModel } from "@/models/User";
import { QueryHistoryModel } from "@/models/QueryHistory";
import { styled } from "@mui/system";
import { Play } from "next/font/google";

interface FileWithPreview extends File {
  preview: string;
}

function TranscriptionForm() {
  const [audioFile, setAudioFile] = useState<FileWithPreview | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [history, setHistory] = useState<QueryHistoryModel[]>([]);
  const [analysisType, setAnalysisType] = useState("TRANSCRIPTION_ONLY");
  const [prompt, setPrompt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getSession } = useContext(AuthCtx);
  const [user, setUser] = useState<UserModel | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  useEffect(() => {
    const updateUser = () => {
      try {
        const session = getSession();

        if (!session || !session.user) {
          setUser(null);
        } else {
          setUser(session.user as UserModel);
        }
      } catch {
        setUser(null);
      }
    };
    updateUser();
  }, []);

  const fetchQueryHistory = async () => {
    try {
      const res = await axios.get(`/api/queryHistory?queryType=TRANSCRIPTION`);
      const sortedHistory = res.data.result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setHistory(sortedHistory);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchQueryHistory();
  }, []);

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

    try {
      const postData = {
        prompt:
          analysisType === "TRANSCRIPTION_WITH_ANALYSIS"
            ? prompt
            : "Transcription request",
        links: [],
        response: null,
        queryType: "TRANSCRIPTION",
      };

      const postResponse = await axios.post(`/api/queryHistory`, postData);
      const historyId = postResponse.data.result._id;

      const formData = new FormData();
      formData.append("audio", audioFile);

      await axios.post(`/api/transcribe/${historyId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const pollForResponse = async (id) => {
        const response = await axios.get(`/api/queryHistory/${id}`);
        if (response.data.result.response !== null) {
          const newItem = response.data.result as QueryHistoryModel;
          setHistory((prevHistory) => [newItem, ...prevHistory]);
          setResponse(newItem.response);
        } else {
          setTimeout(() => pollForResponse(id), 3000);
        }
      };

      pollForResponse(historyId);
    } catch (error) {
      console.error("Error submitting user history:", error);
      setResponse("An error occurred. Please try again.");
    } finally {
      handleRemoveFile();
    }
  };

  const handlePlayAudio = async (id: string) => {
    try {
      const response = await axios.get(`/api/audio/${id}`, {
        responseType: "blob",
      });
      const audioBlob = new Blob([response.data], { type: "audio/m4a" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioElement = document.getElementById(
        `audio-${id}`
      ) as HTMLAudioElement;
      if (audioElement) {
        audioElement.src = audioUrl;
        audioElement.play();
      }
    } catch (error) {
      console.error("Error fetching audio URL:", error);
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Tabs
            value={analysisType}
            onChange={(e, newValue) => setAnalysisType(newValue)}
            indicatorColor="secondary"
            textColor="primary"
            variant="fullWidth"
            sx={{ mb: 2 }}
          >
            <Tab
              label="Transcription Only"
              value="TRANSCRIPTION_ONLY"
              sx={{
                backgroundColor:
                  analysisType == "TRANSCRIPTION_ONLY"
                    ? "rgba(0, 0, 0, 0.1)"
                    : "null",
              }}
            />
            <Tab
              label="Transcription With Assistant Analysis"
              value="TRANSCRIPTION_WITH_ANALYSIS"
              sx={{
                backgroundColor:
                  analysisType == "TRANSCRIPTION_WITH_ANALYSIS"
                    ? "rgba(0, 0, 0, 0.1)"
                    : "null",
              }}
            />
          </Tabs>
          <Box
            sx={{ display: "flex", flexDirection: "column", minWidth: "70%" }}
          >
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
              {analysisType === "TRANSCRIPTION_WITH_ANALYSIS" && (
                <TextField
                  label="What would you like to know about this transcription?"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                />
              )}
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={
                  (analysisType == "TRANSCRIPTION_WITH_ANALYSIS" &&
                    (!prompt || !audioFile)) ||
                  (analysisType == "TRANSCRIPTION_ONLY" && !audioFile)
                    ? true
                    : false
                }
                sx={{ mt: 2 }}
              >
                Submit
              </Button>
            </Box>
          </Box>
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
            padding: 2,
            borderRadius: 1,
            flexDirection: "column",
            display: "flex",
            justifyContent: "flex-start",
            color: "black",
            fontSize: "medium",
            textAlign: "left",
            overflowX: "auto", // Allows horizontal scrolling
            maxWidth: {
              xs: "100vw", // Adjust for extra small screens
              sm: "100%", // Adjust for small screens and up
            },
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
          <ReactMarkdown remarkPlugins={[]} rehypePlugins={[]}>
            {response}
          </ReactMarkdown>
        </Box>
      ) : null}
      <Box
        sx={{
          display: "flex",
          py: 5,
          flexDirection: "column",
          height: "fit-content",
          marginTop: 2,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
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
          {user ? "Transcription History" : "Example Transcriptions"}
        </Box>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            overflowX: "auto", // Allows horizontal scrolling
            width: "100%",
            maxWidth: {
              xs: "100vw", // Adjust for extra small screens
              sm: "100%", // Adjust for small screens and up
            },
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
          <Table
            sx={{ minWidth: 650 }}
            aria-label="transcription history table"
          >
            <TableHead sx={{ backgroundColor: "secondary.main" }}>
              <TableRow
                sx={{ textAlign: "center", borderBottom: "2px solid black" }}
              >
                <TableCell
                  sx={{
                    color: "common.white",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid #1D29BF",
                  }}
                >
                  Created
                </TableCell>
                <TableCell
                  sx={{
                    color: "common.white",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    textAlign: "center",
                    borderRight: "1px solid #1D29BF",
                    borderBottom: "1px solid #1D29BF",
                  }}
                >
                  Transcription
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:nth-of-type(odd)": {
                      backgroundColor: "action.hover",
                    },
                    "&:hover": { backgroundColor: "action.selected" },
                    "&:last-child": {
                      borderBottom: "none",
                    },
                  }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      color: "text.primary",
                      maxWidth: 200,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      verticalAlign: "top",
                      borderRight: "1px solid #1D29BF",
                      borderBottom: "1px solid #1D29BF",
                    }}
                  >
                    {new Date(item.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "text.primary",
                      borderRight: "1px solid #1D29BF",
                      borderBottom: "1px solid #1D29BF",
                      "&:last-child": {
                        borderRight: "none",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        my: 1,
                        padding: 2,
                        borderRadius: 1,
                        flexDirection: "column",
                        display: "flex",
                        justifyContent: "flex-start",
                        color: "black",
                        fontSize: "medium",
                        textAlign: "left",
                        overflowX: "auto", // Allows horizontal scrolling
                        maxWidth: {
                          xs: "100vw", // Adjust for extra small screens
                          sm: "100%", // Adjust for small screens and up
                        },
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
                      <ReactMarkdown remarkPlugins={[]} rehypePlugins={[]}>
                        {item.response}
                      </ReactMarkdown>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Paper>
  );
}

export default TranscriptionForm;
