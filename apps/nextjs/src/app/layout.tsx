import type { Metadata, Viewport } from "next";
import { GlobalAlertDialog } from "@kyh/ui/alert-dialog";
import { GlobalToaster } from "@kyh/ui/toast";
import { TooltipProvider } from "@kyh/ui/tooltip";

import { siteConfig } from "@/lib/site-config";
import { TRPCReactProvider } from "@/trpc/react";

import "./styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    locale: "en-US",
    type: "website",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/og.jpg`,
        width: 1920,
        height: 1080,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: `${siteConfig.url}/og.jpg`,
        width: 1920,
        height: 1080,
      },
    ],
    creator: siteConfig.twitter,
  },
  icons: [
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: `${siteConfig.url}/favicon/apple-touch-icon.png`,
    },
    {
      rel: "icon",
      sizes: "32x32",
      url: `${siteConfig.url}/favicon/favicon-32x32.png`,
    },
    {
      rel: "icon",
      sizes: "16x16",
      url: `${siteConfig.url}/favicon/favicon-16x16.png`,
    },
    {
      rel: "mask-icon",
      color: "#000000",
      url: `${siteConfig.url}/favicon/safari-pinned-tab.svg`,
    },
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

type LayoutProps = {
  children: React.ReactNode;
};

const RootLayout = (props: LayoutProps) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground bg-[url('/home/bg.png')] bg-[size:10px] font-sans antialiased">
        <TooltipProvider>
          <TRPCReactProvider>{props.children}</TRPCReactProvider>
          <GlobalToaster />
          <GlobalAlertDialog />
        </TooltipProvider>
      </body>
    </html>
  );
};

export default RootLayout;
