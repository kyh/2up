import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/styles/globals.css";

import { cache } from "react";
import { headers } from "next/headers";
import { Toaster } from "sonner";

import { TRPCReactProvider } from "@/trpc/react";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_ENV === "production"
      ? "https://turbo.t3.gg"
      : "http://localhost:3000",
  ),
  title: "Create T3 Turbo",
  description: "Simple monorepo with shared backend for web & mobile apps",
  openGraph: {
    title: "T3 Template",
    description: "Simple monorepo with shared backend for web & mobile apps",
    url: "https://github.com/kyh/t3-template",
    siteName: "T3 Template",
  },
  twitter: {
    card: "summary_large_image",
    site: "@kyh",
    creator: "@kyh",
  },
};

const getHeaders = cache(() => Promise.resolve(headers()));

const Layout = (props: { children: React.ReactNode }) => (
  <html lang="en">
    <body className={["font-sans", fontSans.variable].join(" ")}>
      <TRPCReactProvider headersPromise={getHeaders()}>
        {props.children}
      </TRPCReactProvider>
      <Toaster />
    </body>
  </html>
);

export default Layout;
