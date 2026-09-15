import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectFeature } from "@/components/projects/ProjectFeature";
import { CtaSection } from "@/components/sections/CtaSection";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { Section } from "@/components/ui/Section";
import { site } from "@/config/site";
import { projects } from "@/data/projects";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/structured-data";

export const metadata = createMetadata({
  title: "Work",
  description: `Case studies of systems ${site.name} has built for clients: the business problem, how each system works, and what changed as a result.`,
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
        description="Systems we have designed and built for clients, written up in full: the problem, how the system works, and what changed as a result."
        breadcrumbs={breadcrumbs}
      />

      <Section>
        {projects.length > 0 ? (
          <ul className="flex flex-col gap-24">
            {projects.map((project, index) => (
              <li key={project.slug}>
                <ProjectFeature
                  project={project}
                  reverse={index % 2 === 1}
                  priority={index === 0}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-xl border border-line bg-elevated px-6 py-14 text-center">
            <h2 className="text-h3 font-semibold text-ink">
              Case studies are on the way
            </h2>
            <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted">
              We are writing up recent projects. Ask us about the work closest to yours.
            </p>
            <Button href="/contact" className="mt-8">
              Ask about our work
            </Button>
          </div>
        )}
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
