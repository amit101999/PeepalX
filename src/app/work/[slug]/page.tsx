import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { CtaSection } from "@/components/sections/CtaSection";
import { Badge, TechnologyBadge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/ui/JsonLd";
import { Section } from "@/components/ui/Section";
import { getProjectBySlug, projects } from "@/data/projects";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/structured-data";
import type { Project } from "@/types";

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

  return createMetadata({
    title: project.title,
    description: project.description,
    path: `/work/${project.slug}`,
  });
}

/**
 * Project detail / case study page.
 *
 * The `caseStudy` block on a project is optional: when it is missing the page
 * still renders the summary, image and technologies, so a project can be
 * published before its write-up is finished.
 */
export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const index = projects.findIndex((entry) => entry.slug === project.slug);
  const nextProject = projects[(index + 1) % projects.length];

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
        {project.isPlaceholder ? (
          <p className="mb-8 rounded-lg border border-line bg-elevated px-4 py-3 text-sm text-muted">
            <span className="font-medium text-ink">Example project:</span> this is an
            illustrative case study showing the kind of system we build and how we
            document it. It does not describe a delivered client engagement.
          </p>
        ) : null}

        <div className="relative aspect-16/9 overflow-hidden rounded-xl border border-line bg-elevated">
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            sizes="(min-width: 1200px) 1200px, 100vw"
            priority
            className="object-cover"
          />
        </div>

        <dl className="mt-10 grid gap-x-10 gap-y-6 border-t border-line pt-8 sm:grid-cols-3">
          <div>
            <dt className="text-label font-medium text-faint uppercase">Category</dt>
            <dd className="mt-2">
              <Badge tone="accent">{project.category}</Badge>
            </dd>
          </div>

          <div>
            <dt className="text-label font-medium text-faint uppercase">Year</dt>
            <dd className="mt-2 text-sm text-ink">{project.year}</dd>
          </div>

          <div>
            <dt className="text-label font-medium text-faint uppercase">Technologies</dt>
            <dd className="mt-2 flex flex-wrap gap-1.5">
              {project.technologies.map((technology) => (
                <TechnologyBadge key={technology}>{technology}</TechnologyBadge>
              ))}
            </dd>
          </div>
        </dl>
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

          {nextProject && nextProject.slug !== project.slug ? (
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

      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </>
  );
}

/** The written case study: narrative first, then the supporting lists. */
function CaseStudy({ caseStudy }: { caseStudy: NonNullable<Project["caseStudy"]> }) {
  return (
    <Section bordered>
      <Container width="narrow" className="px-0 sm:px-0">
        <div className="flex flex-col gap-12">
          <Prose title="The problem" body={caseStudy.problem} />
          <Prose title="Context" body={caseStudy.context} />
          <Prose title="What we built" body={caseStudy.solution} />
        </div>
      </Container>

      <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <DetailList title="Architecture" items={caseStudy.architecture} />
        <DetailList title="Key features" items={caseStudy.features} />
        <DetailList title="Challenges" items={caseStudy.challenges} />
        <DetailList title="Results" items={caseStudy.results} accent />
      </div>
    </Section>
  );
}

function Prose({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h2 className="text-h3 font-semibold text-ink">{title}</h2>
      <p className="mt-3 text-[1.0625rem] leading-relaxed text-ink-soft">{body}</p>
    </div>
  );
}

function DetailList({
  title,
  items,
  accent = false,
}: {
  title: string;
  items: string[];
  accent?: boolean;
}) {
  return (
    <div>
      <h2 className="text-label font-medium text-faint uppercase">{title}</h2>

      <ul className="mt-5 flex flex-col">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 border-t border-line py-3.5 text-sm leading-relaxed text-ink-soft"
          >
            <span
              aria-hidden="true"
              className={
                accent
                  ? "mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-accent"
                  : "mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-line-strong"
              }
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
