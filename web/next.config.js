const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  headers: async () => [
    {
      source: "/:all*(svg|jpg|png|woff|woff2|eot|ttf|otf|ico|webp)",
      locale: false,
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, stale-while-revalidate",
        },
      ],
    },
  ],
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: { and: [/\.(js|ts|md)x?$/] },
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            prettier: false,
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: "preset-default",
                  params: {
                    overrides: { removeViewBox: false },
                  },
                },
              ],
            },
            titleProp: true,
          },
        },
      ],
    });

    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
