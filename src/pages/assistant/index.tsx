import Image from "next/image";

import React, { Component } from "react";
import HomeLinks from "@/components/layout/HomeLinks";
import { Hero } from "@/components/hero/Hero";
import { Typography } from "@mui/material";
import { NavbarTwoColumns } from "@/components/navigation/NavbarTwoColumns";
import { DropDown } from "@/components/hero/DropDown";
import { Logo } from "@/components/hero/Logo";
import { NavBar } from "@/components/navigation/NavBar";
import { Footer } from "@/components/footer/Footer";
import CompareForm from "@/components/compare/CompareForm";
import { Box } from "@mui/material";

export default function Home() {
  return (
    <Box className="flex min-h-screen flex-col justify-start items-center">
      <NavBar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          flexGrow: 2,
          justifyContent: "space-between",
          alignContent: "center",
          justifyItems: "center",
          alignItems: "center",
        }}
      >
        <CompareForm></CompareForm>
        <HomeLinks></HomeLinks>
      </Box>
      <Footer></Footer>
    </Box>
  );
}
