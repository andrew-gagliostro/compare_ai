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
        setHistory(res.data.result);
        console.log(JSON.stringify(res.data.result))
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

      res = (await axios.post(`/api/compare`, {
        prompt: prompt,
        links: links,
      }));
      console.log("GOT RESPONSE");
      /*
      after posting to above endpoint, get response and
      setResponse to the result field of response
      */
      let temp = res.data.result;
      //remove double quotes from temp string
      temp = temp.replace(/['"]+/g, "");
      setResponse(temp);
    } catch (error) {
      console.log(error);
    }

    if (res) {
      try {
        // change the api endpoint to the correct one
        const session = await getSession();
        await axios.post(`/api/userHistory`, {
          prompt: prompt,
          links: links,
          response: res.data.result,
        });
        let newHistory = history.concat([
          { prompt: prompt, links: links, response: res.data.result },
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
    setResponse(historyItem.response);
  };

  return (
    <Box
      sx={{
        minHeight: "50vh",
        display: "flex",
        flexDirection: "column",
        maxWidth: "100vw",
        color: "gray",
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "gray",
          },
          "&.Mui-focused fieldset": {
            borderColor: "black",
          },
        },
        "& .MuiInputLabel-root": {
          color: "gray",
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "black",
        },
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col text-center w-full dark:invert p-5 rounded-lg"
      >
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
          color="primary"
          className="bg-gray-900"
          sx={{
            display: "flex",
            maxWidth: "20%",
            justifySelf: "center",
            alignSelf: "center",
            margin: "auto",
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
                  color: "gray",
                  fontSize: "medium",
                  textAlign: "left",
                }}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeSanitize, rehypePrism]}
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
          flexDirection: "column",
          height: "fit-content",
          marginTop: 2,
        }}
      >
        <Typography variant="h6">History</Typography>
        <TableContainer component={Paper}>
          <Table sx={{ maxWidth: "100%" }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    maxWidth: 200,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Prompt
                </TableCell>
                <TableCell
                  sx={{
                    maxWidth: 200,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Links
                </TableCell>
                <TableCell>Response</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((item: Partial<SubmissionHistoryModel>, index) => {
                if (item.response && item.links)
                  return (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 }}}
                      onDoubleClick={() => handleLoadHistory(index)}
                    >
                      <TableCell
                        sx={{
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.prompt}
                      </TableCell>
                      <TableCell
                        sx={{
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.links.join(", ")}
                      </TableCell>
                      <TableCell>
                        <ReactMarkdown>{item.response}</ReactMarkdown>
                      </TableCell>
                    </TableRow>
                  );
                else {
                  return null;
                }
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default StyledForm;
