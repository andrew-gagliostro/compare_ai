import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  InputAdornment,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Paper,
  Container,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./Markdown.module.scss";
import axios from "axios";
import { Box } from "@mui/material";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypePrism from "@mapbox/rehype-prism";
import "prismjs/themes/prism.css";
import SubmissionHistory, {
  SubmissionHistoryModel,
} from "@/models/SubmissionHistory";
import { AuthCtx } from "@/context/AuthContext";
import { primary } from "@/theme";

function StyledForm() {
  const [prompt, setPrompt] = useState("");
  const [links, setLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [history, setHistory] = useState<Partial<SubmissionHistoryModel>[]>([]); // Add state variable for user history
  const { getSession } = React.useContext(AuthCtx);

  useEffect(() => {
    // Fetch user's submission history on component mount
    const fetchUserHistory = async () => {
      try {
        const res = await axios.get(`/api/userHistory`); // replace with the right endpoint
        // Sort the history from most recent to oldest based on the createdAt timestamp
        const sortedHistory = res.data.result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setHistory(sortedHistory); // Set the sorted history
        console.log(JSON.stringify(sortedHistory)); // Log sorted data
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserHistory();
  }, []);

  const handleAddLink = () => {
    if (newLink.trim() !== "") {
      setLinks([...links, newLink]);
      setNewLink("");
    }
  };

  const handleLinkInputKeyPress = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the form from submitting
      handleAddLink();
    }
  };

  const handleRemoveLink = (index: any) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    setLinks(updatedLinks);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setResponse("Loading...");
    // Define your API call here
    const apiName = "compareapi";
    const path = "/api";
    //change below to body parameters
    const myInit = {
      // Set your headers and other options here
      // ...
      body: {
        prompt: prompt,
        links: links,
      },

      //add prompt and links to body
    };

    let res = null as any;

    try {
      // let res = await API.post(apiName, path, myInit);

      res = await axios.post(`/api/compare`, {
        prompt: prompt,
        links: links,
      });
      console.log("GOT RESPONSE");
      /*
      after posting to above endpoint, get response and
      setResponse to the result field of response
      */
      let temp = res.data.result;
      //remove double quotes from temp string
      temp = temp.replace(/['"]+/g, "");
      temp = temp.replace(/^"|"$/g, "");
      setResponse(temp);
    } catch (error) {
      console.log(error);
    }

    if (res) {
      try {
        // change the api endpoint to the correct one
        const session = await getSession();
        let temp = res.data.result;
        temp = temp.replace(/['"]+/g, "");
        temp = temp.replace(/^"|"$/g, "");
        await axios.post(`/api/userHistory`, {
          prompt: prompt,
          links: links,
          response: temp,
        });
        let newHistory = history.concat([
          { prompt: prompt, links: links, response: temp },
        ]);
        setHistory(newHistory);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleLoadHistory = (index: any) => {
    const historyItem = history[index];
    setPrompt(historyItem.prompt || "");
    setLinks(historyItem.links || []);
    setResponse(historyItem.response.replace(/^"|"$/g, ""));
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
        Create New Comparison
      </Box>
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <Box className="mb-5">
          <TextField
            label="Prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            variant="outlined"
            fullWidth
            required
            InputProps={{
              className: "text-black",
            }}
          />
        </Box>
        <Box sx={{ marginBottom: 5 }}>
          <TextField
            label="Add Link"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
            onKeyPress={handleLinkInputKeyPress}
            variant="outlined"
            fullWidth
            InputProps={{
              className: "text-black",
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleAddLink}>
                    <AddIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box
          className="mb-5"
          sx={{
            color: "gray",
            maxWidth: "100%",
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignContent: "center",
          }}
        >
          <List
            className="mb-5"
            sx={{
              color: "gray",
              display: "flex",
              maxWidth: "100%",
              flexDirection: "column",
              alignItemS: "center",
              alignContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            {links.map((link, index) => (
              <ListItem
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
                key={index}
              >
                <Typography
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: "black",
                    maxWidth: "90%",
                  }}
                >
                  {link}
                </Typography>
                <IconButton onClick={() => handleRemoveLink(index)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
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
        {/* if response is null, show nothing
      if response === "Loading..." create a loading box with some sort of effect
      else print out a styled response and have is fade in with some sort of effect*/}
        <Box sx={{ marginTop: 10 }}>
          {response === null ? (
            ""
          ) : response === "Loading..." ? (
            // Spinning loading wheel saying Loading...
            <Box className="flex flex-col mt-10 justify-center items-center">
              <svg
                aria-hidden="true"
                className="w-16 h- mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
          ) : (
            // eslint-disable-next-line react/no-children-prop
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                color: "white",
                fontSize: "medium",
                textAlign: "left",
                background:
                  "linear-gradient(to bottom,  rgba(203,203,203,255), rgba(203,203,203,255))",
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
          )}
        </Box>
      </form>
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
          Query History
        </Box>
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, overflow: "hidden", width: "100%" }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="submission history table">
            <TableHead sx={{ backgroundColor: "secondary.main" }}>
              <TableRow>
                <TableCell sx={{ color: "common.white", fontWeight: "bold" }}>
                  Prompt
                </TableCell>
                <TableCell sx={{ color: "common.white", fontWeight: "bold" }}>
                  Links
                </TableCell>
                <TableCell sx={{ color: "common.white", fontWeight: "bold" }}>
                  Response
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((item, index) =>
                item.response && item.links ? (
                  <TableRow
                    key={index}
                    sx={{
                      "&:nth-of-type(odd)": {
                        backgroundColor: "action.hover",
                      },
                      "&:hover": { backgroundColor: "action.selected" },
                    }}
                    onDoubleClick={() => handleLoadHistory(index)}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        color: "text.primary",
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.prompt}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "text.primary",
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.links.join(", ")}
                    </TableCell>
                    <TableCell sx={{ color: "text.primary" }}>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeSanitize, rehypePrism]}
                      >
                        {item.response}
                      </ReactMarkdown>
                    </TableCell>
                  </TableRow>
                ) : null
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Paper>
  );
}

export default StyledForm;
