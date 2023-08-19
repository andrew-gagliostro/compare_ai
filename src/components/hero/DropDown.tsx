import Link from "next/link";

import { Auth, Hub } from "aws-amplify";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@aws-amplify/ui-react";
import { useUser } from "@/context/AuthContext";

function DropDown() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const { user, setUser } = useUser();
  const [links, setLinks] = useState(<div></div>);

  useEffect(() => {
    const updateUser = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setUser(user);
        console.log(user);
        setLinks(
          <a className="flex flex-col text-center min-w-fit text-gray-600">
            <div
              className="rounded-lg border border-gray-600 dark:hover:bg-gray-300 min-w-fit"
              onClick={async () => {
                "/account" != router.pathname
                  ? router.replace("/account")
                  : router.reload();
              }}
            >
              Account Info
            </div>
            <div
              className="rounded-lg border border-gray-600 dark:hover:bg-gray-300 min-w-fit"
              onClick={async () => {
                await Auth.signOut();
                router.reload();
                setUser(null);
              }}
            >
              <a>Sign Out</a>
            </div>
          </a>
        );
      } catch {
        setUser(null);
        setLinks(
          <div
            className="text-center text-gray-600 rounded-lg border border-gray-600 dark:hover:bg-gray-300 min-w-fit"
            onClick={async () => {
              router.push("/sisu");
            }}
          >
            Sign In/Sign Up
          </div>
        );
      }
    };
    console.log(router.pathname);
    Hub.listen("auth", updateUser); // listen for login/signup events
    updateUser();

    // we are not using async to wait for updateUser, so there will be a flash of page where the user is assumed not to be logged in. If we use a flag
    // check manually the first time because we won't get a Hub event // cleanup
  }, []);

  return (
    <div className="relative flex w-full">
      <button
        className="object-center min-w-fit text-black px-auto pt-3 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="object-center">
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </button>
      {isOpen && (
        <div className="absolute right-0 top-10 mt-2 w-48 rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {links}
          </div>
        </div>
      )}
    </div>
  );
}

export { DropDown };
