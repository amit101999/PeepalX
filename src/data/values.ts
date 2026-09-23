import type { CompanyValue } from "@/types";

/**
 * How we work, written as behaviours rather than abstract nouns: each title is
 * something a client can check us against.
 */
export const companyValues: CompanyValue[] = [
  {
    title: "The smallest build that works",
    description:
      "We solve the business problem in front of us. If a smaller build gets you there, we will say so.",
  },
  {
    title: "Code others can maintain",
    description:
      "Code that someone else can read, extend and operate a year from now, including us.",
  },
  {
    title: "Trade-offs in writing",
    description:
      "Clear scope, timelines and trade-offs. We tell you what we do not know as readily as what we do.",
  },
  {
    title: "Still here after launch",
    description:
      "We would rather support a system for years than hand off a project and disappear.",
  },
  {
    title: "Current, not trend-driven",
    description:
      "The tooling changes constantly. We keep our practices current without chasing every trend.",
  },
  {
    title: "We own the hard parts",
    description:
      "We take responsibility for what we build, including the parts that turn out to be harder than expected.",
  },
];
