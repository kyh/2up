import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site.config";

const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: "*",
    allow: "/",
  },
  sitemap: `${siteConfig.url}/sitemap.xml`,
});

export default robots;
