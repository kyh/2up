import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@init/ui/theme";
import { Toaster } from "@init/ui/toast";
import { cn } from "@init/ui/utils";

import { TRPCReactProvider } from "@/trpc/react";

import "./styles.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_ENV === "production"
      ? "https://init.kyh.io"
      : "http://localhost:3000",
  ),
  title: "Init",
  description:
    "A comprehensive boilerplate to build, launch, and scale your next project",
  openGraph: {
    title: "Init",
    description:
      "A comprehensive boilerplate to build, launch, and scale your next project",
    url: "https://github.com/kyh/init",
    siteName: "Init",
  },
  twitter: {
    card: "summary_large_image",
    site: "@kaiyuhsu",
    creator: "@kaiyuhsu",
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

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background font-sans text-foreground antialiased",
          fontSans.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default Layout;
