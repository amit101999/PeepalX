import type { LucideIcon } from "lucide-react";

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
}

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  /** Only rendered when a non-empty URL is provided. */
  links: {
    linkedin?: string;
    github?: string;
    twitter?: string;
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
