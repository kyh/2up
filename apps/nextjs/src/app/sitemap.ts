import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/config";

const sitemap = (): MetadataRoute.Sitemap => {
  const routes = siteConfig.routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes];
};

export default sitemap;
