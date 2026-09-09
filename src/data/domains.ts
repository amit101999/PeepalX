import type { Domain } from "@/types";

/**
 * Domains we are equipped to build for.
 *
 * Deliberately framed as capability rather than claimed specialisation — we do
 * not assert industry expertise that delivered work does not yet support.
 */
export const domains: Domain[] = [
  {
    name: "Startups & MVPs",
    description: "First versions built to be shipped, measured and changed quickly.",
  },
  {
    name: "SaaS Products",
    description: "Multi-tenant applications, billing, onboarding and admin tooling.",
  },
  {
    name: "E-commerce",
    description:
      "Storefronts, catalogue and order flows, payment and fulfilment integration.",
  },
  {
    name: "Healthcare",
    description:
      "Patient-facing and internal tools built around access control and audit trails.",
  },
  {
    name: "Education",
    description: "Learning platforms, content delivery and administrative systems.",
  },
  {
    name: "Professional Services",
    description: "Client portals, document workflows and engagement tracking.",
  },
  {
    name: "Small & Medium Business",
    description: "Practical systems that replace spreadsheets and manual handoffs.",
  },
  {
    name: "Internal Tools",
    description: "Operations dashboards, admin panels and back-office automation.",
  },
  {
    name: "Customer Support",
    description: "Assisted and automated support, knowledge retrieval and routing.",
  },
  {
    name: "Sales & CRM",
    description: "Pipeline automation, lead handling and CRM integration.",
  },
];
