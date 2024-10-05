import React, { useState } from "react";
import Image from "next/image";
import HomeLinks from "@/components/layout/HomeLinks";
import { Hero } from "@/components/hero/Hero";
import { Typography, Tabs, Tab, Box, autocompleteClasses } from "@mui/material";
import { NavbarTwoColumns } from "@/components/navigation/NavbarTwoColumns";
import { DropDown } from "@/components/hero/DropDown";
import { Logo } from "@/components/hero/Logo";
import { NavBar } from "@/components/navigation/NavBar";
import { Footer } from "@/components/footer/Footer";
import CompareForm from "@/components/compare/CompareForm";
import TranscriptionForm from "@/components/transcribe/TranscriptionForm";

export default function Home() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box className="flex min-h-screen flex-col justify-start items-center">
      <NavBar />
      {/* <Box
        sx={{
          display: "flex",
          pl: 0.5,
          width: "100%",
          borderColor: "divider",
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="basic tabs example"
          sx={{ fontWeight: 300 }}
        >
          <Tab
            label="Web and File Analysis"
            sx={{ textTransform: "none", fontWeight: "bold" }}
          />
          <Tab
            label="Transcribe Audio (Beta)"
            sx={{ textTransform: "none", fontWeight: "bold" }}
          />
        </Tabs>
      </Box> */}
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
        {selectedTab === 0 && <CompareForm />}
        {selectedTab === 1 && <TranscriptionForm />}
        <HomeLinks />
      </Box>
      <Footer />
    </Box>
  );
}
