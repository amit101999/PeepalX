import type { LucideIcon } from "lucide-react";

/** A local image under /public, with the alt text it must always carry. */
export interface ImageAsset {
  /** Path beginning with "/", relative to /public. */
  src: string;
  alt: string;
  /**
   * Intrinsic pixel size. When set, the image renders at no more than this
   * width (never upscaled) and reserves its space before loading.
   */
  width?: number;
  height?: number;
  /** Visible caption. Unlike `alt`, this is read by everyone. */
  caption?: string;
}

/** A service the company offers. Rendered on the home page and /services. */
export interface Service {
  slug: string;
  title: string;
  /** Reserved for compact labels. Unused today; capped at 14 characters by a test. */
  shortTitle: string;
  /** One-sentence summary used on the home page and in structured data. */
  summary: string;
  /** Longer description used on the services page. */
  description: string;
  /** Concrete things we build within this service. */
  capabilities: string[];
  /** Short technology labels shown as badges. Keep to 4-5 per service. */
  technologies: string[];
  icon: LucideIcon;
}

/** Whether a piece of work is live, or planned as follow-on work. */
export type DeliveryStatus = "delivered" | "next-phase";

/** One thing a delivered system does. */
export interface CaseStudyCapability {
  title: string;
  description: string;
  /** Defaults to "delivered". Next-phase items are labelled on the page. */
  status?: DeliveryStatus;
}

/**
 * One stage of how a system works, in the order data or work moves through it.
 * Rendered as a numbered sequence, so stages must genuinely happen in order.
 */
export interface CaseStudyStage {
  title: string;
  summary: string;
  capabilities: CaseStudyCapability[];
  /**
   * The steps work passes through inside this stage, in order, e.g. a
   * production route. Rendered as a connected sequence; at least two steps.
   */
  flow?: string[];
  /** Screens from the system that show this stage. */
  images?: ImageAsset[];
}

/** A product or platform a project runs on, and the job it does there. */
export interface ProjectTool {
  name: string;
  purpose: string;
  status?: DeliveryStatus;
}

/** The written case study for a project. */
export interface ProjectCaseStudy {
  /** Where the client was before the work started. */
  context: string;
  problem: string;
  /** What the client set out to achieve. */
  goal?: string;
  /** A short summary of what we built. */
  solution: string;
  /** How the system works, stage by stage. Replaces `features` when present. */
  stages?: CaseStudyStage[];
  /** What the system runs on. Replaces `architecture` when present. */
  stack?: ProjectTool[];
  architecture?: string[];
  features?: string[];
  challenges: string[];
  results: string[];
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  /** Card-level summary. Also the page's meta description, so ≤ 155 characters. */
  description: string;
  technologies: string[];
  /** Path to the cover image under /public. */
  image: string;
  /** Alt text for the cover image. */
  imageAlt: string;
  /** Intrinsic size of the cover image. Screenshots should always set these. */
  imageWidth?: number;
  imageHeight?: number;
  /**
   * Visible caption for the cover, shown on the case study and in listings.
   * Required in practice when the cover shows demo figures ("sample data").
   */
  imageCaption?: string;
  /**
   * Image for social sharing cards, when the cover is unsuitable there (a
   * card cannot carry a caption, so avoid covers that show figures).
   * Defaults to the cover.
   */
  socialImage?: ImageAsset;
  /** Year or period the work represents. */
  year: string;
  caseStudy?: ProjectCaseStudy;

  /* Optional details. Each one is only rendered when it is filled in. */

  /** Client name, or an anonymous description. Only name a client with permission. */
  client?: string;
  /** How long the engagement ran, e.g. "4 months". */
  duration?: string;
  /** What we were responsible for. */
  role?: string;
  /** Public URL of the delivered product. Must be https. */
  liveUrl?: string;
  /** Additional screenshots not tied to a case study stage. */
  gallery?: ImageAsset[];
  /**
   * Date the project page last changed meaningfully, as YYYY-MM-DD. Used as
   * the sitemap `lastModified` and the case study's `dateModified`.
   */
  updatedAt?: string;
}

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  /** Short bio, one or two sentences, used on cards and teasers. */
  bio: string;
  /** Full biography for the team page. Not rendered yet (redesign phase). */
  longBio?: string;
  /** Areas of expertise. Not rendered yet (redesign phase). */
  expertise?: string[];
  /** A short first-person statement. Not rendered yet (redesign phase). */
  quote?: string;
  image: string;
  /** Describes the photo. Not rendered yet; the card uses "Portrait of <name>". */
  imageAlt?: string;
  /** Only rendered when a non-empty URL is provided. */
  links: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    /** Not rendered yet (redesign phase). */
    website?: string;
  };
}

export interface Testimonial {
  /** Slug of the project the review is about. Omit for a general review. */
  project?: string;
  quote: string;
  /** Reviewer's name. Only with their permission; omit for an anonymous review. */
  name?: string;
  /** Reviewer's role. Omit for an anonymous review. */
  role?: string;
  /** Company name, or the anonymous description used for the project. */
  company: string;
  /**
   * True only once the client has approved the wording and attribution.
   * Unapproved entries are drafts and are never rendered.
   */
  approved: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface TechnologyGroup {
  name: string;
  items: string[];
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface CompanyValue {
  title: string;
  description: string;
}

/** A dated moment in the company's history, shown on the About page. */
export interface Milestone {
  /** YYYY or YYYY-MM. */
  date: string;
  title: string;
  description: string;
}

/** Postal address. Only published, and only used in structured data, when set. */
export interface PostalAddress {
  streetAddress?: string;
  locality: string;
  region?: string;
  postalCode?: string;
  /** ISO 3166-1 alpha-2 country code, e.g. "IN". */
  country: string;
}

/** Company profile content for the About page and Organization structured data. */
export interface CompanyProfile {
  /** Registered legal name, if it differs from the brand name. */
  legalName?: string;
  /** Paragraphs telling how and why the company started. */
  story: string[];
  mission: string;
  vision: string;
  milestones: Milestone[];
  address?: PostalAddress;
}
