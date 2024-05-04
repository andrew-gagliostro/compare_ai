import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import React, { PropsWithChildren, useState } from "react";
// import AIDrawerTwo from 'src/components/AI/AIDrawerTwo';
import SideDrawer from "./SideDrawer";

const MainLayout = (props: PropsWithChildren) => {
  const { children } = props;
  const [AIDrawerOpen, setAIDrawerOpen] = useState(false);

  const handleClose = () => {
    setAIDrawerOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          // mr: (theme) => theme?.grid?.gutters,
        }}
      >
        <SideDrawer />
        <Container
          disableGutters
          maxWidth={false}
          sx={{
            margin: 0,
          }}
        >
          {children}
        </Container>
        {/* <AIDrawerTwo open={AIDrawerOpen} handleClose={handleClose} /> */}
      </Box>
    </>
  );
};

export default MainLayout;
