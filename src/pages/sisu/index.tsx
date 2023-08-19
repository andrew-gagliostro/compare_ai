/* eslint-disable */
import { Authenticator, withAuthenticator } from "@aws-amplify/ui-react";
import { Auth } from "aws-amplify";
import { createUser } from "../../graphql/mutations";

import { API, graphqlOperation } from "aws-amplify";
import React from "react";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";

function Index() {
  const router = useRouter();

  useEffect(() => {
    router.push("/");
  }, []);

  return <div />;
}

export default withAuthenticator(Index);
