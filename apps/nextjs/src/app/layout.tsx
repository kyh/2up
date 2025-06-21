import type { Metadata, Viewport } from "next";
import { GlobalAlertDialog } from "@repo/ui/alert-dialog";
import { GlobalToaster } from "@repo/ui/toast";
import { TooltipProvider } from "@repo/ui/tooltip";

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
      rel: "icon",
      type: "image/png",
      sizes: "96x96",
      url: `${siteConfig.url}/favicon/favicon-96x96.png`,
    },
    {
      rel: "icon",
      type: "image/svg+xml",
      url: `${siteConfig.url}/favicon/favicon.svg`,
    },
    {
      rel: "shortcut icon",
      url: `${siteConfig.url}/favicon/favicon.ico`,
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: `${siteConfig.url}/favicon/apple-touch-icon.png`,
    },
    {
      rel: "manifest",
      url: `${siteConfig.url}/favicon/site.webmanifest`,
    },
  ],
  other: {
    "apple-mobile-web-app-title": "VibedGames",
  },
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
