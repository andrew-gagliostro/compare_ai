import { ReactNode } from "react";
import { Twitter, Instagram, Facebook, LinkedIn } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";

const FooterIconList = () => (
  <Box className="w-full flex flex-row flex-wrap space-x-5 justify-center pb-5">
    <IconButton sx={{ color: "inherit", mx: 2 }}>
      <Facebook />
    </IconButton>
    <IconButton sx={{ color: "inherit", mx: 2 }}>
      <Instagram />
    </IconButton>
    <IconButton sx={{ color: "inherit", mx: 2 }}>
      <Twitter />
    </IconButton>
    <IconButton sx={{ color: "inherit", mx: 2 }}>
      <LinkedIn />
    </IconButton>
  </Box>
);

export { FooterIconList };
