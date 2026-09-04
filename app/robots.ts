import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

// /robots.txt — everything crawlable except the dynamic booking endpoint.
// The sitemap URL is anchored to the one domain constant (data/business.siteUrl).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
