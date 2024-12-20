/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@init/api", "@init/db", "@init/ui"],
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
