import { ArrowRight } from "lucide-react";
import { ProjectFeature } from "@/components/projects/ProjectFeature";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects } from "@/data/projects";

/** How many projects the home page features before linking to /work. */
const FEATURED_COUNT = 3;

/** Delivered work on the home page, as alternating feature rows. */
export function SelectedWork() {
  const featured = projects.slice(0, FEATURED_COUNT);
  if (featured.length === 0) return null;

  // Only link onward when /work actually has more to show than this section.
  const hasMore = projects.length > featured.length;

  return (
    <Section id="work" spacing="loose">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Selected work"
          title="What we have built"
          description="Systems we have delivered for clients, each written up in full: the problem, how the system works, and what changed."
        />

        {hasMore ? (
          <Button href="/work" variant="secondary" className="shrink-0">
            All projects
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        ) : null}
      </div>

      <ul className="mt-14 flex flex-col gap-20">
        {featured.map((project, index) => (
          <li key={project.slug}>
            <ProjectFeature project={project} reverse={index % 2 === 1} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
