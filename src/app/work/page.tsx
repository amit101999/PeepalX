import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { CtaSection } from "@/components/sections/CtaSection";
import { JsonLd } from "@/components/ui/JsonLd";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { hasPlaceholderProjects, projects } from "@/data/projects";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/structured-data";

export const metadata = createMetadata({
  title: "Work",
  description:
    "Projects across AI, web applications, mobile, automation and CRM — each with a case study covering the problem, the architecture and the trade-offs.",
  path: "/work",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Work", path: "/work" },
];

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Work"
        title="Projects and case studies"
        description="Each project below is written up in full: the problem it solved, how it was built, what was difficult, and what changed as a result."
        breadcrumbs={breadcrumbs}
      />

      <Section>
        {hasPlaceholderProjects ? <PlaceholderNotice /> : null}

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Reveal
              as="li"
              key={project.slug}
              delay={(index % 3) * 70}
              className="h-full"
            >
              <ProjectCard project={project} priority={index === 0} />
            </Reveal>
          ))}
        </ul>
      </Section>

      <CtaSection
        title="Want something like this built?"
        description="Tell us what you are working on. We will come back with how we would approach it and what it would involve."
        secondary={{ label: "See our services", href: "/services" }}
      />

      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </>
  );
}
