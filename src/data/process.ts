import type { ProcessStep } from "@/types";

/** The six stages of a typical engagement, shown on the home page. */
export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Understand",
    description:
      "We start with the business problem rather than the feature list: who it affects, what it currently costs, and what a good outcome looks like.",
  },
  {
    number: "02",
    title: "Plan",
    description:
      "Scope, architecture and technology decisions written down, with the trade-offs made explicit before any code is committed.",
  },
  {
    number: "03",
    title: "Design",
    description:
      "Interfaces and flows designed around the real task, reviewed with you before they are built.",
  },
  {
    number: "04",
    title: "Build",
    description:
      "Delivery in reviewable increments, so you see working software throughout rather than only at the end.",
  },
  {
    number: "05",
    title: "Test",
    description:
      "Functionality, security, accessibility and performance checked against the requirements we agreed on.",
  },
  {
    number: "06",
    title: "Launch",
    description:
      "Deployment, handover and documentation, followed by ongoing support on whatever terms suit you.",
  },
];
