/**
 * Central site configuration.
 *
 * This is the single source of truth for the company name, contact details,
 * social links and default SEO copy. Nothing else in the codebase should
 * hard-code these values.
 */

/**
 * The company name. This one value drives the logo wordmark, page titles,
 * structured data, the footer and the copyright line.
 */
const COMPANY_NAME = "PeepalX";

/**
 * The canonical origin of the deployed site, without a trailing slash.
 * Falls back to localhost so local development works with no env file;
 * `next.config.ts` stops a Vercel production deploy that relies on it.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const site = {
  name: COMPANY_NAME,
  /** Short descriptor used after the name in page titles. */
  tagline: "Software, AI and automation engineering",
  description:
    "We design and build web and mobile apps, AI agents, automation and Zoho systems for businesses, and keep them running after launch.",
  url: siteUrl,
  locale: "en",
  /**
   * TODO(content): the real contact address. While empty, every email link on
   * the site (footer, contact page, closing block, structured data) is hidden
   * and the legal pages point to the contact form instead.
   */
  email: "" as string,
  /**
   * The public Google Form for new project enquiries ("PeepalX - Start a
   * project"; responses also land in a linked Google Sheet). Every "Start a
   * project" button opens it in a new tab. Set to "" to fall back to the
   * on-site contact page.
   */
  projectFormUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLScnSBm-hpQOBKYu6Ad6O7MFGvgRQ5bgsL9QahRXjKEC6gFGIw/viewform" as string,
  phone: "",
  /** Free-text location. Leave empty to hide it in the footer. */
  location: "",
  founded: "2025",
  /**
   * TODO(content): set to true once the privacy, terms and cookie pages hold
   * copy reviewed by a qualified adviser. Until then those pages show a
   * placeholder notice, are marked noindex and are left out of sitemap.xml, so
   * search engines never index unreviewed legal text.
   */
  legalCopyReviewed: false as boolean,
} as const;

/**
 * Social profiles.
 *
 * Only entries with a non-empty URL are rendered anywhere on the site, so an
 * account that does not exist yet can simply be left as an empty string.
 */
export const socialLinks = {
  linkedin: "",
  github: "",
  twitter: "",
  instagram: "",
  youtube: "",
} as const;

export type SocialPlatform = keyof typeof socialLinks;

/** The social entries that are actually configured, in display order. */
export const activeSocialLinks = (
  Object.entries(socialLinks) as [SocialPlatform, string][]
)
  .filter(([, url]) => url.trim().length > 0)
  .map(([platform, url]) => ({ platform, url }));
