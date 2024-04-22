import { Box } from "@mui/material";
import { Logo } from "../hero/Logo";
import DropDown from "./DropDown";
import { NavbarTwoColumns } from "./NavbarTwoColumns";

const menuItems = [
  { label: "Home", route: "/" },
  { label: "About", route: "/" },
  { label: "Sign In / Sign Up", route: "/api/auth/signin" },
  // add more menu items here
];

export function NavBar() {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        minHeight: "fit-content",
        maxHeight: "fit-content",
        px: 2,
        justifyContent: "center",
      }}
    >
      <NavbarTwoColumns logo={<Logo />}>
        {/* <DropDown menuItems={menuItems} /> */}
        <DropDown />
      </NavbarTwoColumns>
    </Box>
  );
}
