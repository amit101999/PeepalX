import Image from "next/image";
import { CaseStudyJourney } from "@/components/projects/CaseStudyJourney";
import { ProjectStack } from "@/components/projects/ProjectStack";
import { ScreenshotFigure } from "@/components/projects/ScreenshotFigure";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Project, ProjectCaseStudy } from "@/types";

/**
 * The cover. Screenshots with a known size render uncropped at up to their
 * real width; anything else fills a fixed-ratio frame.
 */
export function ProjectCover({ project }: { project: Project }) {
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
export function CaseStudy({ caseStudy }: { caseStudy: ProjectCaseStudy }) {
  const stages = caseStudy.stages ?? [];
  const stack = caseStudy.stack ?? [];

  return (
    <>
      <Section bordered>
        <div className="flex flex-col gap-14">
          <Prose title="Where the client started" body={caseStudy.context} />
          <Prose title="The problem" body={caseStudy.problem} />
          {caseStudy.goal ? <Prose title="The goal" body={caseStudy.goal} /> : null}
          <Prose title="What we built" body={caseStudy.solution} />
        </div>
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
        <Section tone="elevated">
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

/**
 * One part of the story: its question on the left, the answer on the right.
 * The split keeps four stacked paragraphs from reading as one long document.
 */
function Prose({ title, body }: { title: string; body: string }) {
  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,1.55fr)] lg:gap-16">
      <h2 className="text-h3 font-semibold text-ink lg:sticky lg:top-24 lg:self-start">
        {title}
      </h2>
      <p className="max-w-2xl leading-relaxed text-ink-soft">{body}</p>
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
  // Results are what the reader came for, so they carry the accent rule and the
  // darker text; challenges sit quietly beside them.
  return (
    <div className={accent ? "border-l-2 border-accent pl-6" : undefined}>
      <h2 className="text-h3 font-semibold text-ink">{title}</h2>

      <ul className="mt-5 flex flex-col">
        {items.map((item) => (
          <li
            key={item}
            className={
              accent
                ? "border-t border-line py-3.5 leading-relaxed text-ink first:border-t-0 first:pt-0"
                : "flex items-start gap-3 border-t border-line py-3.5 text-sm leading-relaxed text-ink-soft"
            }
          >
            {accent ? null : (
              <span
                aria-hidden="true"
                className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-line-strong"
              />
            )}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
