import { Badge } from "@/components/ui/Badge";
import type { CaseStudyStage } from "@/types";
import { CaseStudyFlow } from "./CaseStudyFlow";
import { ScreenshotFigure } from "./ScreenshotFigure";

/** Stable in-page anchor for a stage, e.g. "stage-daily-data-in-and-checks". */
function stageId(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `stage-${slug}`;
}

/**
 * How a system works, stage by stage.
 *
 * The numbering is deliberate: stages are a real sequence (the order data or
 * work moves through the system), not a decorative list. On large screens a
 * sticky rail lists the stages as jump links, joined by a single line so the
 * sequence reads at a glance; on small screens the numbered stages simply
 * stack.
 */
export function CaseStudyJourney({ stages }: { stages: CaseStudyStage[] }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
      <nav
        aria-label="Stages"
        className="hidden lg:sticky lg:top-24 lg:block lg:self-start"
      >
        <ol className="relative flex flex-col gap-1 before:absolute before:top-4 before:bottom-4 before:left-[0.9375rem] before:w-px before:bg-line-strong">
          {stages.map((stage, index) => (
            <li key={stage.title} className="relative">
              <a
                href={`#${stageId(stage.title)}`}
                className="group flex items-start gap-3 rounded-md py-2 pr-2 text-sm text-muted transition-colors hover:text-ink"
              >
                <span className="relative inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-line-strong bg-canvas text-xs font-semibold text-ink tabular-nums transition-colors group-hover:border-accent">
                  {index + 1}
                </span>
                <span className="pt-1.5 leading-snug">{stage.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <ol className="flex flex-col gap-20">
        {stages.map((stage, index) => (
          <li key={stage.title} id={stageId(stage.title)} className="scroll-mt-24">
            <div className="flex items-start gap-4 sm:gap-5">
              <span
                aria-hidden="true"
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white tabular-nums"
              >
                {index + 1}
              </span>
              <div>
                <h3 className="text-h3 font-semibold text-ink">{stage.title}</h3>
                <p className="mt-2 max-w-2xl leading-relaxed text-muted">
                  {stage.summary}
                </p>
              </div>
            </div>

            {stage.flow && stage.flow.length > 0 ? (
              <CaseStudyFlow
                steps={stage.flow}
                label={`${stage.title}: steps in order`}
                className="mt-7"
              />
            ) : null}

            <ul className="mt-8 grid gap-x-10 sm:grid-cols-2">
              {stage.capabilities.map((capability) => (
                <li key={capability.title} className="border-t border-line py-5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <h4 className="font-medium text-ink">
                      {capability.title}
                      {/* Screen reader users often skim by heading, and must not hear planned work as delivered. */}
                      {capability.status === "next-phase" ? (
                        <span className="sr-only"> (next phase)</span>
                      ) : null}
                    </h4>
                    {capability.status === "next-phase" ? (
                      <Badge tone="outline">Next phase</Badge>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {capability.description}
                  </p>
                </li>
              ))}
            </ul>

            {stage.images && stage.images.length > 0 ? (
              <div className="mt-10 flex flex-col gap-10">
                {stage.images.map((image) => (
                  <ScreenshotFigure
                    key={image.src}
                    image={image}
                    sizes="(min-width: 1200px) 830px, (min-width: 1024px) 70vw, 100vw"
                  />
                ))}
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
