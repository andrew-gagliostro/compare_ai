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

    // Define your API call here
    const apiName = "compareapi";
    const path = "/links_and_prompts";
    const myInit = {
      // Set your headers and other options here
      // ...
      queryStringParameters: {
        prompt: prompt,
        links: links,
      },
    };

    try {
      let temp = await API.get(apiName, path, myInit);
      console.log(temp);
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
    </form>
  );
}

export default StyledForm;
