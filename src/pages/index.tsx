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

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-between items-center">
      <Hero />
      <HomeLinks></HomeLinks>
      <Footer></Footer>
    </main>
  );
}
