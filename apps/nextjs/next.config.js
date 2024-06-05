import { recmaPlugins } from "@2up/mdx/plugins/recma.mjs";
import { rehypePlugins } from "@2up/mdx/plugins/rehype.mjs";
import { remarkPlugins } from "@2up/mdx/plugins/remark.mjs";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  options: {
    remarkPlugins,
    rehypePlugins,
    recmaPlugins,
  },
});

/** @type {import("next").NextConfig} */
const config = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@2up/api", "@2up/db", "@2up/ui"],
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default withMDX(config);
