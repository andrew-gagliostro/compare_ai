/* eslint-disable react/no-unknown-property */
import { ReactNode } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Logo } from "../hero/Logo";
import { Box } from "@mui/material";

type INavbarProps = {
  logo: ReactNode;
  children: ReactNode;
};

export function NavbarTwoColumns(props: INavbarProps) {
  const router = useRouter();

  return (
    <Box className="flex flex-full w-full justify-between px-auto pt-5">
      <Box className="flex justify-start">{props.children}</Box>
      <Box onClick={() => router.push("/")}>
        <Logo></Logo>
      </Box>
    </Box>
  );
}
