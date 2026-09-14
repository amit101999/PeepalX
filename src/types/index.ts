import type { LucideIcon } from "lucide-react";

/** A local image under /public, with the alt text it must always carry. */
export interface ImageAsset {
  /** Path beginning with "/", relative to /public. */
  src: string;
  alt: string;
}

/** A service the company offers. Rendered on the home page and /services. */
export interface Service {
  slug: string;
  title: string;
  /** One-sentence summary used on cards. */
  summary: string;
  /** Longer description used on the services page. */
  description: string;
  /** Concrete things we build within this service. */
  capabilities: string[];
  /** Short technology labels shown as badges. Keep to 4-5 per service. */
  technologies: string[];
  icon: LucideIcon;
}

/** A case study section. Every project can optionally carry the full set. */
export interface ProjectCaseStudy {
  problem: string;
  context: string;
  solution: string;
  architecture: string[];
  challenges: string[];
  results: string[];
  features: string[];
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  /** Card-level summary. */
  description: string;
  technologies: string[];
  /** Path to a local image under /public. */
  image: string;
  /** Alt text for the project image. */
  imageAlt: string;
  /** Year or period the work represents. */
  year: string;
  /**
   * Placeholder projects are illustrative examples of the kind of work we
   * build, not delivered client engagements. The UI labels them as such so the
   * site never implies a client relationship that does not exist.
   */
  isPlaceholder: boolean;
  caseStudy?: ProjectCaseStudy;

  /* Optional details. Each one is only rendered when it is filled in. */

  /** Client name. Only publish it with the client's permission. */
  client?: string;
  /** How long the engagement ran, e.g. "4 months". */
  duration?: string;
  /** What we were responsible for, e.g. "Design, build and hosting". */
  role?: string;
  /** Public URL of the delivered product. Must be https. */
  liveUrl?: string;
  /** Additional screenshots shown on the case study page. */
  gallery?: ImageAsset[];
  /** A quote from the client about this specific project. */
  testimonial?: Omit<Testimonial, "isPlaceholder">;
  /**
   * Date the project page last changed meaningfully, as YYYY-MM-DD. Used as
   * the sitemap `lastModified`, so search engines see real update dates.
   */
  updatedAt?: string;
}

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  /** Short bio, one or two sentences, used on cards and teasers. */
  bio: string;
  /** Full biography for the team page. Paragraphs separated by blank lines. */
  longBio?: string;
  /** Areas of expertise, shown as short labels. */
  expertise?: string[];
  /** A short first-person statement, shown with the profile. */
  quote?: string;
  image: string;
  /** Describes the photo. Defaults to "Portrait of <name>". */
  imageAlt?: string;
  /** Only rendered when a non-empty URL is provided. */
  links: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  /** Placeholder testimonials are rendered with an explicit disclosure. */
  isPlaceholder: boolean;
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
  icon: LucideIcon;
}

export interface Domain {
  name: string;
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
