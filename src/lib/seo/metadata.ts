import type { Metadata } from "next";
import { site, siteUrl } from "@/config/site";

interface PageMetadataOptions {
  title: string;
  description: string;
  /** Route path beginning with "/", used for the canonical URL. */
  path: string;
  /** Set for routes that should not appear in search results. */
  noIndex?: boolean;
}

/**
 * Builds page metadata with a canonical URL and social card fields.
 *
 * Every page uses this instead of hand-writing a `metadata` object, so titles,
 * canonicals and social cards stay consistent.
 *
 * Social card images are not set here on purpose: `src/app/opengraph-image.tsx`
 * generates one image for the whole site through Next's file convention, and
 * Next attaches it to every route automatically. To give a single page its own
 * image, add an `opengraph-image` file inside that route's folder.
 */
export function createMetadata({
  title,
  description,
  path,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const url = `${siteUrl}${path === "/" ? "" : path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: `${title} — ${site.name}`,
      description,
      url,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${site.name}`,
      description,
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}
