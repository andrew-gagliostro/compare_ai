/* eslint-disable react/no-unknown-property */
import { ReactNode } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Logo } from "../hero/Logo";

type INavbarProps = {
  logo: ReactNode;
  children: ReactNode;
};

export function NavbarTwoColumns(props: INavbarProps) {
  const router = useRouter();

  return (
    <h1 className="flex flex-full w-full justify-between dark:invert">
      <div onClick={() => router.push("/")}>
        <Logo></Logo>
      </div>
      <div className="flex items-center justify-center opacity-60">
        {props.children}
      </div>
    </h1>
  );
}
