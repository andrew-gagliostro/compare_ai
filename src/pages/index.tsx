import Image from "next/image";

import React, { Component } from "react";
import HomeLinks from "@/components/layout/HomeLinks";
import { Hero } from "@/components/hero/Hero";
import { NavbarTwoColumns } from "@/components/navigation/NavbarTwoColumns";
import { DropDown } from "@/components/hero/DropDown";
import { Logo } from "@/components/hero/Logo";
import { NavBar } from "@/components/navigation/NavBar";
import { Footer } from "@/components/layout/Footer";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "@/theme";

export default function Home() {
  return (
    <ThemeProvider theme>
      <CssBaseline />
      <main className="flex min-h-screen flex-col justify-between items-center">
        <Hero />
        <HomeLinks></HomeLinks>
        <Footer></Footer>
      </main>
    </ThemeProvider>
  );
}
