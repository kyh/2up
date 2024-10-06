/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@2up/api", "@2up/db", "@2up/ui"],
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
