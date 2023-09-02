import React, { useState } from "react";
import { Amplify, API } from "aws-amplify";
import {
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

function StyledForm() {
  const [prompt, setPrompt] = useState("");
  const [links, setLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState("");
  const [response, setResponse] = useState<any>(null);

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

    try {
      let res = await API.post(apiName, path, myInit);

      /*
      after posting to above endpoint, get response and
      setResponse to the result field of response
      */

      setResponse(JSON.parse(res.result)["content"]);
      console.log(JSON.stringify(res));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col text-center w-full h-full p-5 bg-gray-200 rounded-lg"
    >
      <div className="mb-5">
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
      </div>
      <div className="mb-5">
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
      </div>
      <div className="mb-5">
        <List>
          {links.map((link, index) => (
            <ListItem key={index}>
              <ListItemText primary={link} className="text-black" />
              <IconButton onClick={() => handleRemoveLink(index)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </div>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        className="bg-gray-900"
      >
        Submit
      </Button>
      {/* if response is null, show nothing
      if response === "Loading..." create a loading box with some sort of effect
      else print out a styled response and have is fade in with some sort of effect*/}
      {response === null ? (
        ""
      ) : response === "Loading..." ? (
        <div className="flex flex-col mt-5 justify-center items-center">
          <div className="w-16 h-16 border-4 border-t-4 border-gray-900 rounded-full animate-spin"></div>
          <p className="text-black">{response}</p>
        </div>
      ) : (
        <div className="flex flex-col mt-5 justify-center items-center">
          <div className="w-16 h-16 border-4 border-t-4 border-gray-900 rounded-full animate-spin"></div>
          <p className="text-black">{response}</p>
        </div>
      )}
    </form>
  );
}

export default StyledForm;
