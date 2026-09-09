import { ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/Button";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { hasPlaceholderProjects, projects } from "@/data/projects";

/** Project showcase on the home page. Shows the first three projects. */
export function SelectedWork() {
  const featured = projects.slice(0, 3);

  return (
    <Section id="work" spacing="loose">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Selected work"
          title="What we build"
          description="Representative systems across AI, web, mobile and automation — each written up as a full case study covering the problem, the architecture and the trade-offs."
        />

        <Button href="/work" variant="secondary" className="shrink-0">
          All projects
          <ArrowRight aria-hidden="true" className="size-4" />
        </Button>
      </div>

      {hasPlaceholderProjects ? <PlaceholderNotice /> : null}

      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((project, index) => (
          <Reveal as="li" key={project.slug} delay={index * 70} className="h-full">
            <ProjectCard project={project} priority={index === 0} />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
