import Image from "next/image";

import React, { Component } from "react";
import HomeLinks from "@/components/layout/HomeLinks";
import { Hero } from "@/components/hero/Hero";
import { Typography } from "@material-ui/core";
import { NavbarTwoColumns } from "@/components/navigation/NavbarTwoColumns";
import { DropDown } from "@/components/hero/DropDown";
import { Logo } from "@/components/hero/Logo";
import { NavBar } from "@/components/navigation/NavBar";
import { Footer } from "@/components/layout/Footer";
import CompareForm from "@/components/compare/CompareForm";
import { Box } from "@mui/material";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-between items-center">
      <Box sx={{display:'flex', flexDirection:'column', minHeight:'100vh', flexGrow: 1, justifyContent:'space-between'}}>
        <NavBar />
        <HomeLinks></HomeLinks>
        <Box sx={{ display: "flex", width: "100%", height: "fit-content" }}>
          <CompareForm></CompareForm>
        </Box>
        <Footer></Footer>
      </Box>
    </main>
  );
}
