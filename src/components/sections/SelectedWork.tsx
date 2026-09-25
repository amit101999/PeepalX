import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectFeature } from "@/components/projects/ProjectFeature";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextLink } from "@/components/ui/TextLink";
import { projects } from "@/data/projects";

/** How many projects the home page features before linking to /work. */
const FEATURED_COUNT = 3;

/**
 * Delivered work on the home page: the first project as a wide feature, the
 * next ones as a pair underneath, so the section never becomes a long zigzag.
 */
export function SelectedWork() {
  const [lead, ...rest] = projects.slice(0, FEATURED_COUNT);
  if (!lead) return null;

  // Only link onward when /work actually has more to show than this section.
  const hasMore = projects.length > FEATURED_COUNT;

  return (
    <Section id="work" spacing="loose" tone="tint" slant="both">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          title={
            <>
              Selected <span className="text-accent">work</span>
            </>
          }
          description="Client systems, written up in full: the problem, the build and what changed."
        />
        {hasMore ? <TextLink href="/work">All projects</TextLink> : null}
      </div>

      <div data-reveal className="mt-14">
        <ProjectFeature project={lead} settle />
      </div>

      {rest.length > 0 ? (
        <ul className="mt-20 grid gap-14 md:grid-cols-2 md:gap-10">
          {rest.map((project) => (
            <li key={project.slug} data-reveal>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      ) : null}
    </Section>
  );
}
