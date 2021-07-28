import { Fragment } from "react";
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import { ServerStyleSheet } from "styled-components";

const NAME = "Playhouse";
const TITLE = "Playhouse";
const DESCRIPTION = "Create your own trivia quiz game and play with friends";
const URL = "https://playhouse.gg";

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    // Render app and page and get the context of the page with collected side effects.
    const styledComponentsSheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            styledComponentsSheet.collectStyles(<App {...props} />),
        });
      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <Fragment>
            {initialProps.styles}
            {styledComponentsSheet.getStyleElement()}
          </Fragment>
        ),
      };
    } finally {
      styledComponentsSheet.seal();
    }
  }

  render() {
    return (
      <Html lang="en" dir="ltr">
        <Head>
          <meta name="referrer" content="origin" />
          <meta name="application-name" content={NAME} />
          <meta name="theme-color" content="#1F2937" />
          <meta name="title" content={TITLE} />
          <meta name="robots" content="index, follow" />
          <meta name="description" content={DESCRIPTION} />

          <meta property="fb:app_id" content="{FB_ID}" />
          <meta property="og:url" content={URL} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={TITLE} />
          <meta property="og:image" content="/featured.png" />
          <meta property="og:description" content={DESCRIPTION} />
          <meta property="og:site_name" content={NAME} />
          <meta property="og:locale" content="en_US" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@kaiyuhsu" />
          <meta name="twitter:creator" content="@kaiyuhsu" />
          <meta name="twitter:url" content="" />
          <meta name="twitter:title" content={TITLE} />
          <meta name="twitter:description" content={DESCRIPTION} />
          <meta name="twitter:image" content="/featured.png" />

          <link rel="manifest" href="/manifest.json" />
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
          <link
            rel="preload"
            href="/fonts/ChalkboardSE-Regular.woff2"
            as="font"
            type="font/woff2"
          />
          <style jsx global>
            {`
              @font-face {
                font-family: "Chalkboard SE";
                src: url("/fonts/ChalkboardSE-Regular.woff2") format("woff2"),
                  url("/fonts/ChalkboardSE-Regular.woff") format("woff");
                font-weight: normal;
                font-style: normal;
                font-display: fallback;
              }
            `}
          </style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
