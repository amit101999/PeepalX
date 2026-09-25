import { site } from "@/config/site";
import type { CompanyProfile } from "@/types";

/**
 * Company profile: the About page story, mission, vision and history.
 *
 * TODO(content): replace with the final About copy. Guidance:
 *  - `story`: a few short paragraphs, one idea each.
 *  - `milestones`: only real, dated events (founding, first client, launches).
 *    An empty list hides the timeline rather than showing invented history.
 *  - `legalName` and `address`: fill in once registered. The address is used
 *    in structured data, so it must match what appears on the site.
 */
/** Home page hero. Also the headline on the site-wide social sharing card. */
export const heroHeadline = "Software your business can run on.";

/**
 * What the hero's typed line cycles through: "We build ⟨phrase⟩". Plural
 * nouns, one per service, short enough to type in well under a second.
 */
export const heroBuildPhrases = [
  "web apps",
  "mobile apps",
  "AI agents",
  "automations",
  "data pipelines",
  "Zoho systems",
] as const;

/**
 * The words that scroll inside the hero logo, one list per ribbon: the X
 * stroke and the bowl of the P. Short tech, AI, automation and business
 * terms, not claims, so they need no evidence behind them. Decorative: the
 * logo is hidden from screen readers.
 */
export const heroMarkWords = {
  stroke: [
    "full stack",
    "AI agents",
    "automation",
    "Zoho",
    "APIs",
    "cloud",
    "Python",
    "Next.js",
  ],
  bowl: [
    "business systems",
    "workflows",
    "LLMs",
    "integrations",
    "Zoho CRM",
    "data",
    "dashboards",
    "mobile",
  ],
} as const;

/** Hero supporting line. Keep it to 20 words or fewer. */
export const heroDescription =
  "One team to design, build and connect web and mobile apps, AI agents and Zoho systems, then keep them running.";

export const company: CompanyProfile = {
  legalName: undefined,

  story: [
    `${site.name} is a technology company started by three co-founders to build software on their own terms: fewer projects, delivered by the people who scoped them.`,
    "We work across web and mobile applications, AI systems, automation and business platforms. In practice most of what we are asked for sits between those categories: an application that needs to talk to three existing systems, or a manual process that should have been software two years ago.",
    "We are direct about scope. If a project is larger than its budget, or a requirement will cost more than it returns, we say so before the work starts. We would rather lose an engagement at the proposal stage than deliver something that disappoints at the end of it.",
    "Services are where we start, not where we intend to finish. The longer-term direction is our own software: products and platforms built on what we learn solving these problems for other companies.",
  ],

  mission:
    "To help businesses use software, AI and automation to solve real problems and run their operations with less manual work.",

  vision:
    "To build a technology company known for the quality of what it ships: software, intelligent systems and products that hold up under real use.",

  milestones: [],

  address: undefined,
};
