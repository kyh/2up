import Head from "next/head";

export const SEO = ({
  title = "",
  siteTitle = "Playhouse",
  description = "Create your own trivia quiz game and play with friends",
}) => {
  return (
    <Head>
      <title>{title ? `${title} | ${siteTitle}` : siteTitle}</title>
      <meta name="description" content={description} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={siteTitle} />

      <meta property="twitter:card" content="summary" />
      <meta property="twitter:creator" content="@kaiyuhsu" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
    </Head>
  );
};
