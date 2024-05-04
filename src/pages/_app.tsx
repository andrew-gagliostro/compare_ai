import React, { Component, useEffect } from "react";
import Head from "next/head";
import { ThemeProvider } from "@mui/material";
import { CssBaseline } from "@mui/material";
import theme from "@/theme";
import type { AppProps } from "next/app";
import { Amplify } from "aws-amplify";
import AuthContext from "@/context/AuthContext";
import "../styles/globals.css";
import "@aws-amplify/ui-react/styles.css";
import { NextPage } from "next";
import { SessionProvider } from "next-auth/react";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <React.Fragment>
      <Head>
        <title>Compared</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <SessionProvider session={pageProps.session}>
        <AuthContext>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            {getLayout(<Component {...pageProps} />)}
          </ThemeProvider>
        </AuthContext>
      </SessionProvider>
    </React.Fragment>
  );
}

export default MyApp;
