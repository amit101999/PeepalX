import { Bot, Building2, Code2, Database, Smartphone, Workflow } from "lucide-react";
import type { Service } from "@/types";

/**
 * Services shown on the home page and the /services page.
 * Add a new service by appending an entry here — no component changes needed.
 */
export const services: Service[] = [
  {
    slug: "web-development",
    title: "Web Development",
    summary:
      "Web applications and company platforms built to stay fast and maintainable as they grow.",
    description:
      "We build web applications end to end: interface, API, database and deployment. Our default is server-rendered React with TypeScript throughout, which keeps pages fast for users and keeps the codebase readable for whoever maintains it next.",
    capabilities: [
      "Web applications and dashboards",
      "REST APIs and backend services",
      "Database design and integration",
      "Authentication and access control",
      "Cloud deployment and CI",
      "Performance and Core Web Vitals work",
    ],
    technologies: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL"],
    icon: Code2,
  },
  {
    slug: "mobile-development",
    title: "Mobile Development",
    summary:
      "Native Android and iOS applications, with the backend and integrations they depend on.",
    description:
      "We build mobile applications on the platforms your users are actually on — native Kotlin for Android, Swift and SwiftUI for iOS — and the API layer behind them. That includes the parts teams usually underestimate: authentication, payments, notifications and store submission.",
    capabilities: [
      "Native Android applications (Kotlin)",
      "Native iOS applications (Swift, SwiftUI)",
      "API and backend integration",
      "Authentication and secure storage",
      "Push notifications and payments",
      "App Store and Play Store deployment",
    ],
    technologies: ["Kotlin", "Swift", "SwiftUI", "Firebase", "REST APIs"],
    icon: Smartphone,
  },
  {
    slug: "ai-systems",
    title: "AI & Intelligent Systems",
    summary:
      "AI agents, retrieval systems and assistants wired into the software a business already runs.",
    description:
      "Most useful AI work is integration work. We build agents, retrieval pipelines and assistants that read your real documents and act on your real systems — with the retrieval quality, evaluation and guardrails that decide whether the result is trustworthy or a demo.",
    capabilities: [
      "AI agents and multi-step workflows",
      "RAG and document retrieval systems",
      "LLM API integration",
      "Intelligent document processing",
      "AI features inside existing products",
      "Internal AI tools for operations teams",
    ],
    technologies: ["Python", "LLM APIs", "RAG", "Vector databases", "Node.js"],
    icon: Bot,
  },
  {
    slug: "automation-integrations",
    title: "Automation & Integrations",
    summary:
      "Connecting the systems a business runs on so work stops moving between them by hand.",
    description:
      "We connect the tools you already pay for. Orders, leads, invoices and support tickets move between systems on their own, with retries and alerting so a failed sync is something you are told about rather than something you discover a week later.",
    capabilities: [
      "Third-party and CRM integrations",
      "Webhook and event pipelines",
      "Scheduled and triggered automation",
      "Data synchronisation between systems",
      "Notification and alerting workflows",
      "Internal tooling for operations",
    ],
    technologies: ["Node.js", "Python", "Webhooks", "REST APIs", "Queues"],
    icon: Workflow,
  },
  {
    slug: "data-scripting",
    title: "Data & Scripting",
    summary:
      "Python tooling that turns manual, repeated data work into something that runs on a schedule.",
    description:
      "Reporting that costs a person two days a month is usually a script. We build data collection, transformation and reporting tooling in Python, including public-source data collection carried out within the terms of the source.",
    capabilities: [
      "Python scripting and data processing",
      "Data extraction and transformation",
      "Permitted, terms-compliant data collection",
      "Reporting and export automation",
      "Scheduled jobs and pipelines",
      "Internal tools and admin utilities",
    ],
    technologies: ["Python", "Pandas", "PostgreSQL", "Cron", "REST APIs"],
    icon: Database,
  },
  {
    slug: "zoho-solutions",
    title: "Zoho Solutions",
    summary:
      "Custom Zoho builds and integrations for teams running their business on the platform.",
    description:
      "For teams already on Zoho, we handle the work the platform does not cover out of the box: CRM customisation, Creator applications, Flow automation, and integrations between Zoho and the rest of your stack.",
    capabilities: [
      "Zoho CRM customisation",
      "Zoho Creator applications",
      "Zoho Flow automation",
      "Zoho Books integration",
      "Zoho to third-party integrations",
      "Migration and data cleanup",
    ],
    technologies: ["Zoho CRM", "Zoho Creator", "Zoho Flow", "Deluge", "REST APIs"],
    icon: Building2,
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}
