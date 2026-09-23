import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { CaseStudyStage } from "@/types";
import { CaseStudyFlow } from "./CaseStudyFlow";
import { stageId } from "@/lib/utils/stage-id";
import { ScreenshotFigure } from "./ScreenshotFigure";
import { StageRail } from "./StageRail";

/**
 * How a system works, stage by stage.
 *
 * The numbering is deliberate: stages are a real sequence (the order data or
 * work moves through the system), not a decorative list. On large screens a
 * sticky rail lists the stages as jump links and marks the one you are
 * reading; on small screens the same links collapse into a disclosure, because
 * a case study is long and scrolling back to the top to move on is tedious.
 */
export function CaseStudyJourney({ stages }: { stages: CaseStudyStage[] }) {
  // One array: the id, the title and the stage travel together, so a link can
  // never end up pointing at a different stage than the one it renders.
  const entries = stages.map((stage) => ({
    stage,
    id: stageId(stage.title),
    title: stage.title,
  }));

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
      <StageRail stages={entries} />

      <div>
        <nav aria-label="Stages" className="lg:hidden">
          <details data-accordion className="group border-y border-line">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-medium text-ink [&::-webkit-details-marker]:hidden">
              Stages in this case study
              <ChevronDown
                aria-hidden="true"
                className="size-4 shrink-0 text-muted transition-transform duration-300 ease-[var(--ease-out-soft)] group-open:rotate-180"
              />
            </summary>

            <ol className="flex flex-col pb-3">
              {entries.map((entry, index) => (
                <li key={entry.id}>
                  <a
                    href={`#${entry.id}`}
                    className="flex min-h-11 items-center gap-3 text-sm text-muted transition-colors hover:text-ink"
                  >
                    <span className="text-xs text-faint tabular-nums">{index + 1}</span>
                    {entry.title}
                  </a>
                </li>
              ))}
            </ol>
          </details>
        </nav>

        <ol className="mt-12 flex flex-col gap-20 lg:mt-0">
          {entries.map(({ stage, id }, index) => (
            <li key={id} id={id}>
              <div className="flex items-start gap-4 sm:gap-5">
                <span
                  aria-hidden="true"
                  className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-canvas tabular-nums"
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
    </div>
  );
}
