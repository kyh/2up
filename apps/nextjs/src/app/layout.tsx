import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/styles/globals.css";

import { headers } from "next/headers";

import { ThemeProvider } from "@/components/theme-provider";
import { TRPCReactProvider } from "@/components/trpc-provider";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

/**
 * Since we're passing `headers()` to the `TRPCReactProvider` we need to
 * make the entire app dynamic. You can move the `TRPCReactProvider` further
 * down the tree (e.g. /dashboard and onwards) to make part of the app statically rendered.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "2UP",
  description: "Simple monorepo with shared backend for web & mobile apps",
  openGraph: {
    title: "2UP",
    description: "Simple monorepo with shared backend for web & mobile apps",
    url: "https://2uphq.com",
    siteName: "2UP",
  },
  twitter: {
    card: "summary_large_image",
    site: "@kaiyuhsu",
    creator: "@kaiyuhsu",
  },
};

const Layout = (props: { children: React.ReactNode }) => (
  <html lang="en">
    <body className={["font-sans", fontSans.variable].join(" ")}>
      <ThemeProvider>
        <TRPCReactProvider headers={headers()}>
          {props.children}
        </TRPCReactProvider>
      </ThemeProvider>
    </body>
  </html>
);

export default Layout;
