import localFont from "next/font/local";
import { SupabaseProvider } from "~/components/providers/supabase-provider";
import { ThemeProvider } from "~/components/providers/theme-provider";
import "../styles/globals.css";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <meta name="referrer" content="origin" />
        <meta name="application-name" content="2UP" />
        <meta name="robots" content="index, follow" />
        <meta property="fb:app_id" content="{FB_ID}" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#7247C4"
        />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#7247C4" />
        <meta
          name="msapplication-config"
          content="/favicon/browserconfig.xml"
        />
        <meta name="theme-color" content="#1A202C" />
      </head>
      <body
        className={`bg-white text-black dark:bg-black dark:text-white ${carbonBoldFont.className}`}
      >
        <ThemeProvider>
          <SupabaseProvider>{children}</SupabaseProvider>
        </ThemeProvider>
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "de66e4012fd9462a94e1ad0fbc4ace00"}'
        />
      </body>
    </html>
  );
}
