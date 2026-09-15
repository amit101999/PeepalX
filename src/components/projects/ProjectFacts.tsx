import type { ReactNode } from "react";
import { TechnologyBadge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";
import type { Project } from "@/types";

interface Fact {
  label: string;
  value: ReactNode;
}

/**
 * The at-a-glance facts for a project. Only fields that are filled in are
 * shown, so an anonymous client or an unknown duration leaves no empty row.
 */
export function ProjectFacts({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const facts: Fact[] = [];

  if (project.client) facts.push({ label: "Client", value: project.client });
  if (project.role) facts.push({ label: "Our role", value: project.role });
  facts.push({ label: "Year", value: project.year });
  if (project.duration) facts.push({ label: "Duration", value: project.duration });
  facts.push({ label: "Category", value: project.category });

  if (project.liveUrl) {
    facts.push({
      label: "Live site",
      value: (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-line-strong underline-offset-4 hover:decoration-ink"
        >
          {new URL(project.liveUrl).hostname}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ),
    });
  }

  // When the case study lists its stack in full, the badges would repeat it.
  if (!project.caseStudy?.stack?.length) {
    facts.push({
      label: "Technologies",
      value: (
        <span className="flex flex-wrap gap-1.5">
          {project.technologies.map((technology) => (
            <TechnologyBadge key={technology}>{technology}</TechnologyBadge>
          ))}
        </span>
      ),
    });
  }

  return (
    <dl
      className={cn(
        "grid gap-x-10 gap-y-6 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {facts.map((fact) => (
        <div key={fact.label}>
          <dt className="text-sm text-faint">{fact.label}</dt>
          <dd className="mt-1.5 text-sm font-medium text-ink">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
