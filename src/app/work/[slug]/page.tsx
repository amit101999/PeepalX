import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { CaseStudy, ProjectCover } from "@/components/projects/CaseStudy";
import { ProjectFacts } from "@/components/projects/ProjectFacts";
import { CtaSection } from "@/components/sections/CtaSection";
import { JsonLd } from "@/components/ui/JsonLd";
import { Section } from "@/components/ui/Section";
import { getProjectBySlug, projects } from "@/data/projects";
import { createMetadata } from "@/lib/seo/metadata";
import { caseStudySchema } from "@/lib/seo/structured-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Pre-renders one static page per project at build time. Adding a project to
 * `src/data/projects.ts` is all that is needed for its page to exist.
 */
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return createMetadata({
      title: "Project not found",
      description: "This project does not exist.",
      path: `/work/${slug}`,
      noIndex: true,
    });
  }

  // A share card cannot show a caption, so a project whose cover shows demo
  // figures supplies a separate, figure-free `socialImage`.
  const social = project.socialImage ?? {
    src: project.image,
    alt: project.imageAlt,
    width: project.imageWidth,
    height: project.imageHeight,
  };

  return createMetadata({
    title: project.title,
    description: project.description,
    path: `/work/${project.slug}`,
    image: {
      url: social.src,
      alt: social.alt,
      width: social.width,
      height: social.height,
    },
  });
}

/**
 * Project detail / case study page.
 *
 * Every part below the header is optional and renders only when the project
 * has that content, so a project can be published before its write-up is
 * finished. A case study with `stages` and `stack` shows how the system works
 * stage by stage; one without them falls back to plain feature and
 * architecture lists.
 */
export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const index = projects.findIndex((entry) => entry.slug === project.slug);
  const nextProject = projects[(index + 1) % projects.length];
  const hasNextProject = nextProject !== undefined && nextProject.slug !== project.slug;

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Work", path: "/work" },
    { name: project.title, path: `/work/${project.slug}` },
  ];

  return (
    <>
      <PageHeader
        eyebrow={project.category}
        title={project.title}
        description={project.description}
        breadcrumbs={breadcrumbs}
      />

      <Section spacing="tight">
        <ProjectCover project={project} />
        <ProjectFacts project={project} className="mt-10" />
      </Section>

      {project.caseStudy ? <CaseStudy caseStudy={project.caseStudy} /> : null}

      <Section bordered spacing="tight">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            All projects
          </Link>

          {hasNextProject ? (
            <Link
              href={`/work/${nextProject.slug}`}
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
            >
              Next: {nextProject.title}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          ) : null}
        </div>
      </Section>

      <CtaSection
        title="Building something similar?"
        description="Tell us about the problem and we will come back with how we would approach it."
        secondary={{ label: "See our services", href: "/services" }}
      />

      <JsonLd data={caseStudySchema(project)} />
    </>
  );
}
