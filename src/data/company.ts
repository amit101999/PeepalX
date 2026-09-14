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
export const company: CompanyProfile = {
  legalName: undefined,

  story: [
    `${site.name} is a technology company started by three people who spent their careers building software and wanted to do it on their own terms: fewer projects, taken seriously, with the people who scoped the work also delivering it.`,
    "We work across web and mobile applications, AI systems, automation and business platforms. In practice most of what we are asked for sits between those categories — an application that needs to talk to three existing systems, or a manual process that should have been software two years ago.",
    "We are direct about scope. If a project is larger than its budget, or a requirement will cost more than it returns, we say so before the work starts. We would rather lose an engagement at the proposal stage than deliver something that disappoints at the end of it.",
    "Services are where we start, not where we intend to finish. The longer-term direction is our own software: products and platforms built on what we learn solving these problems for other companies.",
  ],

  mission:
    "To help businesses use software, AI and automation to solve problems they actually have, improve how they operate, and open work that was not practical before.",

  vision:
    "To build a technology company known for the quality of what it ships — software, intelligent systems and products that hold up under real use.",

  milestones: [],

  address: undefined,
};
