import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";

/**
 * robots.txt.
 *
 * `/api/` is disallowed because those routes exist to receive form posts, not
 * to be crawled.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
