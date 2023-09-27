import type { AppProps } from "next/app";
import type { NextPage } from "next";
import { useEffect } from "react";
import Router from "next/router";
import localFont from "@next/font/local";
import { trpc } from "~/utils/trpc";
import { AlertProvider, ProgressBar } from "~/components";
import { AuthProvider } from "~/lib/auth/useAuth";
import { useHomeStore } from "~/lib/home/homeStore";
import "../styles/globals.css";

const chalkboradSEFont = localFont({
  src: [
    {
      path: "../assets/fonts/ChalkboardSE-Regular.woff2",
    },
    {
      path: "../assets/fonts/ChalkboardSE-Regular.woff",
    },
  ],
  style: "normal",
  weight: "normal",
  display: "fallback",
  variable: "--font-default-se",
});

const carbonBoldFont = localFont({
  src: [
    {
      path: "../assets/fonts/Carbon-Bold.woff",
    },
    {
      path: "../assets/fonts/Carbon-Bold.woff2",
    },
  ],
  style: "normal",
  weight: "normal",
  display: "fallback",
  variable: "--font-default-se",
});

const droidPixelFont = localFont({
  src: [
    {
      path: "../assets/fonts/DroidSans.woff",
    },
    {
      path: "../assets/fonts/DroidSans.woff2",
    },
  ],
  style: "normal",
  weight: "normal",
  display: "fallback",
  variable: "--font-droid",
});

const progress = new ProgressBar();

type Page<P = {}> = NextPage<P> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type Props = AppProps & {
  Component: Page;
};

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeError", progress.finish);
Router.events.on("routeChangeComplete", progress.finish);

const MyApp = ({ Component, pageProps }: Props) => {
  const getLayout = Component.getLayout || ((page) => page);

  const isDarkMode = useHomeStore((state) => state.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      globalThis.document.documentElement.classList.add("dark");
    } else {
      globalThis.document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    globalThis.document.documentElement.classList.add(
      process.env.NODE_ENV === "production"
        ? carbonBoldFont.variable
        : chalkboradSEFont.variable,
      droidPixelFont.variable
    );
  }, []);

  return (
    <AlertProvider>
      <AuthProvider>{getLayout(<Component {...pageProps} />)}</AuthProvider>
    </AlertProvider>
  );
};

export default trpc.withTRPC(MyApp);
