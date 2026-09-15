import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { CaseStudyJourney } from "@/components/projects/CaseStudyJourney";
import { ProjectFacts } from "@/components/projects/ProjectFacts";
import { ProjectStack } from "@/components/projects/ProjectStack";
import { ScreenshotFigure } from "@/components/projects/ScreenshotFigure";
import { CtaSection } from "@/components/sections/CtaSection";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/ui/JsonLd";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getProjectBySlug, projects } from "@/data/projects";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, caseStudySchema } from "@/lib/seo/structured-data";
import type { Project, ProjectCaseStudy } from "@/types";

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

      <JsonLd data={[breadcrumbSchema(breadcrumbs), caseStudySchema(project)]} />
    </>
  );
}

/**
 * The cover. Screenshots with a known size render uncropped at up to their
 * real width; anything else fills a fixed-ratio frame.
 */
function ProjectCover({ project }: { project: Project }) {
  if (project.imageWidth && project.imageHeight) {
    return (
      <ScreenshotFigure
        priority
        sizes="(min-width: 1200px) 1136px, 100vw"
        image={{
          src: project.image,
          alt: project.imageAlt,
          width: project.imageWidth,
          height: project.imageHeight,
          caption: project.imageCaption,
        }}
      />
    );
  }

  return (
    <div className="relative aspect-16/9 overflow-hidden rounded-xl border border-line bg-elevated">
      <Image
        src={project.image}
        alt={project.imageAlt}
        fill
        sizes="(min-width: 1200px) 1200px, 100vw"
        priority
        className="object-cover object-top"
      />
    </div>
  );
}

/** The written case study: the story, how the system works, then outcomes. */
function CaseStudy({ caseStudy }: { caseStudy: ProjectCaseStudy }) {
  const stages = caseStudy.stages ?? [];
  const stack = caseStudy.stack ?? [];

  return (
    <>
      <Section bordered>
        <Container width="narrow" className="px-0 sm:px-0">
          <div className="flex flex-col gap-12">
            <Prose title="Where the client started" body={caseStudy.context} />
            <Prose title="The problem" body={caseStudy.problem} />
            {caseStudy.goal ? <Prose title="The goal" body={caseStudy.goal} /> : null}
            <Prose title="What we built" body={caseStudy.solution} />
          </div>
        </Container>
      </Section>

      {stages.length > 0 ? (
        <Section bordered>
          <SectionHeading
            title="How the system works"
            description="Each stage in the order the work happens, with what it does and screens from the system."
          />
          <div className="mt-14">
            <CaseStudyJourney stages={stages} />
          </div>
        </Section>
      ) : null}

      {stack.length > 0 ? (
        <Section tone="elevated" bordered>
          <SectionHeading
            title="What it runs on"
            description="The products behind the system, and the job each one does."
          />
          <div className="mt-12">
            <ProjectStack tools={stack} />
          </div>
        </Section>
      ) : null}

      <Section bordered>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {stack.length === 0 && caseStudy.architecture?.length ? (
            <DetailList title="Architecture" items={caseStudy.architecture} />
          ) : null}
          {stages.length === 0 && caseStudy.features?.length ? (
            <DetailList title="Key features" items={caseStudy.features} />
          ) : null}
          <DetailList title="Challenges" items={caseStudy.challenges} />
          <DetailList title="Results" items={caseStudy.results} accent />
        </div>
      </Section>
    </>
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
      <h2 className="text-h3 font-semibold text-ink">{title}</h2>

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
