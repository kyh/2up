import { recmaPlugins } from "@init/mdx/plugins/recma.mjs";
import { rehypePlugins } from "@init/mdx/plugins/rehype.mjs";
import { remarkPlugins } from "@init/mdx/plugins/remark.mjs";
import createMDX from "@next/mdx";

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ENABLE_REACT_COMPILER = process.env.ENABLE_REACT_COMPILER === "true";

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
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@init/api", "@init/db", "@init/ui"],
  images: {
    remotePatterns: getRemotePatterns(),
  },
  experimental: {
    mdxRs: true,
    reactCompiler: ENABLE_REACT_COMPILER,
  },
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

const withMDX = createMDX({
  options: {
    remarkPlugins,
    rehypePlugins,
    recmaPlugins,
  },
});

export default withMDX(config);
