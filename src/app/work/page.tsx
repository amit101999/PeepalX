import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectFeature } from "@/components/projects/ProjectFeature";
import { CtaSection } from "@/components/sections/CtaSection";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { site } from "@/config/site";
import { primaryCta } from "@/data/navigation";
import { projects } from "@/data/projects";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Work",
  description: `Case studies of systems ${site.name} has built for clients: the business problem, how each system works, and what changed as a result.`,
  path: "/work",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Work", path: "/work" },
];

/**
 * All projects: the newest as a wide feature, the rest in a two-column grid,
 * so a growing list never turns into a long left-right zigzag.
 */
export default function WorkPage() {
  const [lead, ...rest] = projects;

  return (
    <>
      <PageHeader
        title="Projects and case studies"
        description="Systems we have designed and built for clients, written up in full: the problem, how the system works, and what changed as a result."
        breadcrumbs={breadcrumbs}
      />

      <Section>
        <h2 className="sr-only">Case studies</h2>

        {lead ? (
          <>
            <ProjectFeature project={lead} priority />

            {rest.length > 0 ? (
              <ul className="mt-28 grid gap-x-10 gap-y-24 md:grid-cols-2">
                {rest.map((project) => (
                  <li key={project.slug} data-reveal>
                    <ProjectCard project={project} />
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        ) : (
          <div className="max-w-md border-t border-line pt-8">
            <h2 className="text-h3 font-semibold text-ink">
              Case studies are on the way
            </h2>
            <p className="mt-3 leading-relaxed text-muted">
              We are writing up recent projects. Ask us about the work closest to yours.
            </p>
            <Button href={primaryCta.href} className="mt-8">
              {primaryCta.label}
            </Button>
          </div>
        )}
      </Section>

      <CtaSection
        title="Want something like this built?"
        description="Tell us what you are working on. We will come back with how we would approach it and what it would involve."
        secondary={{ label: "See our services", href: "/services" }}
      />
    </>
  );
}
