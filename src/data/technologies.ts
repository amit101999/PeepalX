import type { TechnologyGroup } from "@/types";

/**
 * Technologies grouped by area, rendered as text rather than a wall of logos.
 * Only list technologies the team actually works with.
 */
export const technologyGroups: TechnologyGroup[] = [
  {
    name: "Frontend",
    items: ["React", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS"],
  },
  {
    name: "Backend",
    items: ["Node.js", "Python", "REST APIs", "PostgreSQL", "Authentication"],
  },
  {
    name: "Mobile",
    items: ["Android", "Kotlin", "iOS", "Swift", "SwiftUI", "React Native"],
  },
  {
    name: "AI",
    items: ["LLM APIs", "RAG", "AI agents", "Vector databases", "AI workflows"],
  },
  {
    name: "Automation",
    items: ["Webhooks", "REST APIs", "Workflow engines", "Scheduled jobs"],
  },
  {
    name: "Business Platforms",
    items: ["Zoho CRM", "Zoho Creator", "Zoho Flow", "Zoho Books"],
  },
];
