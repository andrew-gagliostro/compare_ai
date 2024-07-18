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
} from "@mui/material";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypePrism from "@mapbox/rehype-prism";
import "prismjs/themes/prism.css"; // Ensure this CSS is imported for syntax highlighting
import DeleteIcon from "@mui/icons-material/Delete";
import { AuthCtx } from "@/context/AuthContext";
import { UserModel } from "@/models/User";
import { QueryHistoryModel } from "@/models/QueryHistory";

interface FileWithPreview extends File {
  preview: string;
}

function TranscriptionForm() {
  const [audioFile, setAudioFile] = useState<FileWithPreview | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [history, setHistory] = useState<QueryHistoryModel[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getSession } = useContext(AuthCtx);
  const [user, setUser] = useState<UserModel | null>(null);

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
        prompt: "Transcription request",
        links: [],
        response: null,
        queryType: "TRANSCRIPTION",
      };

      const postResponse = await axios.post(`/api/queryHistory`, postData);
      const historyId = postResponse.data.result._id;

      const formData = new FormData();
      formData.append("audio", audioFile);

      axios.post(`/api/transcribe/${historyId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const pollForResponse = async (id) => {
        const response = await axios.get(`/api/queryHistory/${id}`);
        if (response.data.result.response !== null) {
          const newItem = response.data.result.response as QueryHistoryModel;
          setResponse(newItem.response);
          setHistory((prevHistory) => [newItem, ...prevHistory]);
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
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize, rehypePrism]}
          >
            {response.replace(/^"|"$/g, "")}
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
          <Table
            sx={{ minWidth: 650 }}
            aria-label="transcription history table"
          >
            <TableHead sx={{ backgroundColor: "secondary.main" }}>
              <TableRow sx={{ textAlign: "center" }}>
                <TableCell
                  sx={{
                    color: "common.white",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    textAlign: "center",
                    borderRight: "1px solid #504b5f",
                    borderBottom: "1px solid #504b5f",
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
                    borderRight: "1px solid #504b5f",
                    borderBottom: "1px solid #504b5f",
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
                      borderRight: "1px solid #504b5f",
                      borderBottom: "1px solid #504b5f",
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
                      borderRight: "1px solid #504b5f",
                      borderBottom: "1px solid #504b5f",
                      "&:last-child": {
                        borderRight: "none",
                      },
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
