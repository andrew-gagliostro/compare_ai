import { Logo } from "../hero/Logo";
import { FooterCopyright } from "./FooterCopyright";
import { FooterIconList } from "./FooterIconList";
import { Box, Button, Container } from "@mui/material";
import { styled } from "@mui/system";
import { secondary } from "@/theme";

const StyledFooterButton = styled(Button)(() => ({
  fontSize: "1rem",
  fontWeight: "bold",
  color: "inherit",
}));

const Footer = () => (
  <Box
    sx={{
      borderTop: `2px solid ${secondary}`,
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      width: "100%",
      // background:
      //   "linear-gradient(to bottom right, rgb(215, 215, 215), gray)",
      pt: 1,
      pb: 3,
    }}
    className="footer"
  >
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-around",
      }}
      className="navbar"
    >
      <StyledFooterButton>
        <div>Home</div>
      </StyledFooterButton>
      <StyledFooterButton>
        <div>About</div>
      </StyledFooterButton>
      <StyledFooterButton>
        <div>Docs</div>
      </StyledFooterButton>

      <StyledFooterButton>
        <div>Sign In/Sign Up</div>
      </StyledFooterButton>
    </Box>
    <FooterIconList />
    <Box className="text-sm">
      <FooterCopyright />
    </Box>
  </Box>
);

export { Footer };
