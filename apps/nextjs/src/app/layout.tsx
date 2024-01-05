import type { Metadata, Viewport } from "next";
import { cache } from "react";
import { Inter } from "next/font/google";
import { headers } from "next/headers";

import { cn } from "@acme/ui";
import { ThemeProvider } from "@acme/ui/theme";
import { Toaster } from "@acme/ui/toast";

import { TRPCReactProvider } from "@/trpc/react";

import "@/app/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_ENV === "production"
      ? "https://kyh.io"
      : "http://localhost:3000",
  ),
  title: "Template",
  description: "Simple monorepo with shared backend for web & mobile apps",
  openGraph: {
    title: "Template",
    description: "Simple monorepo with shared backend for web & mobile apps",
    url: "https://github.com/kyh/template",
    siteName: "Template",
  },
  twitter: {
    card: "summary_large_image",
    site: "@kyh",
    creator: "@kyh",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const getHeaders = cache(async () => headers());

const RootLayout = (props: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background font-sans text-foreground antialiased",
          fontSans.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TRPCReactProvider headersPromise={getHeaders()}>
            {props.children}
          </TRPCReactProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
