import Link from "next/link";
import { NavbarTwoColumns } from "../navigation/NavbarTwoColumns";
import { Logo } from "./Logo";
import React, { useEffect, useState, useContext } from "react";
import { AuthCtx } from "@/context/AuthContext";
import DropDown from "../navigation/DropDown";
import { useRouter } from "next/router";
import { NavBar } from "../navigation/NavBar";
import { Box, Button, Typography } from "@mui/material";
import { UserModel } from "@/models/User";

function Hero() {
  const router = useRouter();
  const [user, setUser] = useState<UserModel | null>(null);
  const { getSession } = useContext(AuthCtx);

  let session = getSession();

  useEffect(() => {
    const updateUser = () => {
      try {
        session = getSession();

        if (!session || !session.user) {
          setUser(null);
        } else {
          console.log("session.user", session.user);
          setUser(session.user as UserModel);
        }
      } catch {
        setUser(null);
      }
    };
    updateUser();

    // we are not using async to wait for updateUser, so there will be a flash of page where the user is assumed not to be logged in. If we use a flag
    // check manually the first time because we won't get a Hub event // cleanup
  }, [session]);

  return (
    <>
      <NavBar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyItems: "center",
          justifyContent: "space-around",
          alignItems: "center",
          boxSizing: "border-box",
          textAlign: "center",
          width: "100%",
          flexGrow: 2,
        }}
        className="hero lg:mt-1"
      >
        <Box
          color="primary"
          className="font-bold mb-5"
          sx={{ color: "#6b7280" }}
        >
          <Typography variant="h1">Compared</Typography>{" "}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              fontWeight: "bold",
              mt: 4,
              px: 5,
            }}
            className="text-xl subpixel-antialiased"
          >
            {/* <Box>Express your interests, ideas, and passions.</Box> */}
            <Box>Helping You Make Decisions</Box>
            <Box>Easing The Burden Of Information Overload</Box>
          </Box>
        </Box>
        {/* <h2 className="flex flex-col gap-2 text-2xl font-bold rotating-text pb-5">
            <Box>Eliminate The Noise. </Box>
            <Box>Make The Right Choice.</Box>
          </h2> */}
        <Button
          color="secondary"
          variant="contained"
          onClick={() => {
            router.push("/compare");
          }}
        >
          Start Comparing Now
        </Button>
      </Box>
    </>
  );
}

export { Hero };
