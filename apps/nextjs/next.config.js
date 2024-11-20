import createMDX from "@next/mdx";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

const getRemotePatterns = () => {
  /** @type {import('next').NextConfig['remotePatterns']} */
  const remotePatterns = [];

  if (SUPABASE_URL) {
    const hostname = new URL(SUPABASE_URL).hostname;

    remotePatterns.push({
      protocol: "https",
      hostname,
    });
  }

  return IS_PRODUCTION
    ? remotePatterns
    : [
        {
          protocol: "http",
          hostname: "127.0.0.1",
        },
        {
          protocol: "http",
          hostname: "localhost",
        },
      ];
};

/** @type {import("next").NextConfig} */
const config = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  transpilePackages: ["@init/api", "@init/db", "@init/ui", "@init/mdx"],
  images: {
    remotePatterns: getRemotePatterns(),
  },
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: {
            dark: "github-dark",
            light: "github-light",
          },
          defaultLang: "tsx",
        },
      ],
    ],
  },
});

export default withMDX(config);
