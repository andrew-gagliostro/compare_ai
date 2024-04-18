import { Box } from "@mui/material";

const FooterCopyright = () => (
  <Box sx={{ color: "primary.main" }}>
    © Copyright {new Date().getFullYear()} {"Expressd"}.
    <Box>Created By Andrew Gagliostro</Box>
    {/*
     * PLEASE READ THIS SECTION
     * We'll really appreciate if you could have a link to our website
     * The link doesn't need to appear on every pages, one link on one page is enough.
     * Thank you for your support it'll mean a lot for us.
     */}
  </Box>
);

export { FooterCopyright };
