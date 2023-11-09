import localFont from "next/font/local";
import { headers } from "next/headers";
import { TRPCReactProvider } from "@/lib/trpc/react";
import { SupabaseProvider } from "@/components/providers/supabase-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

import "../styles/globals.css";

const chalkboradSEFont = localFont({
  src: [
    {
      path: "../../public/fonts/chalkboard-se-regular.woff2",
    },
    {
      path: "../../public/fonts/chalkboard-se-regular.woff",
    },
  ],
  style: "normal",
  weight: "normal",
  display: "fallback",
  variable: "--font-chalkboard-se",
});

const Layout = ({ children }: { children: React.ReactNode }) => (
  <html dir="ltr" lang="en" suppressHydrationWarning>
    <head>
      <meta content="origin" name="referrer" />
      <meta content="2UP" name="application-name" />
      <meta content="index, follow" name="robots" />
      <meta content="{FB_ID}" property="fb:app_id" />

      <link
        href="/favicon/apple-touch-icon.png"
        rel="apple-touch-icon"
        sizes="180x180"
      />
      <link
        href="/favicon/favicon-32x32.png"
        rel="icon"
        sizes="32x32"
        type="image/png"
      />
      <link
        href="/favicon/favicon-16x16.png"
        rel="icon"
        sizes="16x16"
        type="image/png"
      />
      <link href="/favicon/site.webmanifest" rel="manifest" />
      <link
        color="#7247C4"
        href="/favicon/safari-pinned-tab.svg"
        rel="mask-icon"
      />
      <link href="/favicon/favicon.ico" rel="shortcut icon" />
      <meta content="#7247C4" name="msapplication-TileColor" />
      <meta content="/favicon/browserconfig.xml" name="msapplication-config" />
      <meta content="#1A202C" name="theme-color" />
    </head>
    <body
      className={`bg-white text-black dark:bg-black dark:text-white ${chalkboradSEFont.className}`}
    >
      <ThemeProvider>
        <SupabaseProvider>
          <TRPCReactProvider headers={headers()}>{children}</TRPCReactProvider>
        </SupabaseProvider>
      </ThemeProvider>
      <script
        data-cf-beacon='{"token": "de66e4012fd9462a94e1ad0fbc4ace00"}'
        defer
        src="https://static.cloudflareinsights.com/beacon.min.js"
      />
    </body>
  </html>
);

export default Layout;
