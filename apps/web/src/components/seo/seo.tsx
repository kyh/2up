import Head from "next/head";

const url = "https://2uphq.com";
const ogImage = `${url}/favicon/featured.png`;

export const SEO = ({
  title = "",
  siteTitle = "2UP",
  description = "Create your own trivia quiz game and play with friends",
}) => {
  const finalTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  return (
    <Head>
      <title>{finalTitle}</title>
      <meta name="title" content={finalTitle} />
      <meta name="description" content={description} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="628" />
      <meta property="og:locale" content="en_US" />

      <meta property="twitter:card" content="summary" />
      <meta property="twitter:creator" content="@kaiyuhsu" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta name="twitter:site" content={siteTitle} />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:image" content={ogImage} />
    </Head>
  );
};
