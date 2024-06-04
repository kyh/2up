import { recmaPlugins } from "@init/mdx/plugins/recma.mjs";
import { rehypePlugins } from "@init/mdx/plugins/rehype.mjs";
import { remarkPlugins } from "@init/mdx/plugins/remark.mjs";
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
  transpilePackages: ["@init/api", "@init/db", "@init/ui"],
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default withMDX(config);
