import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/styles/globals.css";

import { cache } from "react";
import { headers } from "next/headers";

import { ThemeProvider } from "@/components/theme-provider";
import { TRPCReactProvider } from "@/lib/trpc/react";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

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

// Lazy load headers
const getHeaders = cache(async () => {
  return headers();
});

const Layout = (props: { children: React.ReactNode }) => (
  <html lang="en">
    <body className={["font-sans", fontSans.variable].join(" ")}>
      <ThemeProvider>
        <TRPCReactProvider headersPromise={getHeaders()}>
          {props.children}
        </TRPCReactProvider>
      </ThemeProvider>
    </body>
  </html>
);

export default Layout;
