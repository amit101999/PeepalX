import { Check } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { TechnologyBadge } from "@/components/ui/Badge";
import { Frame } from "@/components/ui/Frame";
import { Section } from "@/components/ui/Section";
import { services } from "@/data/services";
import { ServiceDiagram } from "./ServiceDiagram";

/** The scroll timeline each service chapter publishes for the sticky stage. */
function timelineName(slug: string) {
  return `--service-${slug}`;
}

/**
 * Timeline variables for one diagram on the sticky stage (see globals.css).
 * It fades on its chapter's timeline. The first diagram is already showing
 * before its chapter reaches the reading line, so it builds on its own view as
 * the plate scrolls in; the rest build on their chapter's timeline.
 */
function stageItemStyle(slug: string, isFirst: boolean): CSSProperties {
  const variables: Record<string, string> = isFirst
    ? { "--tl": timelineName(slug), "--trace-range": "entry 10% entry 100%" }
    : {
        "--tl": timelineName(slug),
        "--trace-tl": timelineName(slug),
        "--trace-range": "cover 0% cover 45%",
      };

  return variables as CSSProperties;
}

/** The drafting sheet a diagram is drawn on: a chamfered tint plate with the grid. */
function DiagramPlate({ children }: { children: ReactNode }) {
  return (
    <Frame cut="lg" innerClassName="aspect-square bg-tint">
      <div
        aria-hidden="true"
        className="absolute inset-0 blueprint [mask-image:radial-gradient(circle_at_50%_50%,#000_30%,transparent_80%)] opacity-70"
      />
      {children}
    </Frame>
  );
}

/**
 * The six services in full, each with a diagram of how that kind of system
 * fits together. Each chapter keeps the anchor id the index, the home page and
 * the footer link to (/services#ai-systems and friends).
 *
 * Two layouts, chosen in CSS by the `stage:` variant (globals.css):
 *  - Stage, on wide screens in browsers with scroll-driven animation: the
 *    diagrams share one sticky plate beside the text, and each fades in and
 *    builds while its chapter crosses the reading line. A rail beside the
 *    plate fills as each chapter is read.
 *  - Inline, everywhere else (small screens, Firefox, reduced motion, print):
 *    each chapter shows its own diagram, which draws in as it scrolls into view.
 * Both are rendered; the unused one is `display: none`, so it is skipped by
 * assistive technology, and the diagrams are decorative either way.
 */
export function ServiceChapters() {
  const scope = services.map((service) => timelineName(service.slug)).join(", ");

  return (
    <Section spacing="loose" bordered>
      <div
        className="stage:grid stage:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] stage:gap-20"
        style={{ timelineScope: scope } as CSSProperties}
      >
        <div aria-hidden="true" className="hidden stage:block">
          <div className="sticky top-28 flex gap-5">
            <div className="flex w-0.5 shrink-0 flex-col gap-1.5">
              {services.map((service) => (
                <div key={service.slug} className="flex-1 overflow-clip bg-line">
                  <div
                    data-rail
                    className="size-full bg-accent"
                    style={{ "--tl": timelineName(service.slug) } as CSSProperties}
                  />
                </div>
              ))}
            </div>

            <div className="min-w-0 flex-1">
              <DiagramPlate>
                {services.map((service, index) => (
                  <div
                    key={service.slug}
                    data-stage-item
                    data-stage-order={
                      index === 0
                        ? "first"
                        : index === services.length - 1
                          ? "last"
                          : undefined
                    }
                    className="absolute inset-0 p-[6%]"
                    style={stageItemStyle(service.slug, index === 0)}
                  >
                    <ServiceDiagram slug={service.slug} icon={service.icon} />
                  </div>
                ))}
              </DiagramPlate>
            </div>
          </div>
        </div>

        <ul className="flex flex-col">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <li
                key={service.slug}
                id={service.slug}
                tabIndex={-1}
                data-service-chapter
                style={{ viewTimelineName: timelineName(service.slug) } as CSSProperties}
                className="grid gap-10 border-t border-line py-16 first:border-t-0 first:pt-0 last:pb-0 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 stage:block stage:py-24"
              >
                <div
                  aria-hidden="true"
                  className="mx-auto w-full max-w-sm lg:max-w-none stage:hidden"
                >
                  <DiagramPlate>
                    <div className="absolute inset-0 p-[6%]">
                      <ServiceDiagram slug={service.slug} icon={service.icon} />
                    </div>
                  </DiagramPlate>
                </div>

                <div data-reveal className="lg:self-center">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex size-11 shrink-0 items-center justify-center bg-accent text-surface chamfer cut-sm">
                      <Icon aria-hidden="true" strokeWidth={1.75} className="size-5" />
                    </span>
                    <h2 className="text-h2 font-semibold text-ink">{service.title}</h2>
                  </div>

                  <p className="mt-6 max-w-[62ch] text-lead text-muted">
                    {service.description}
                  </p>

                  <h3 className="mt-10 font-sans text-sm font-semibold text-ink">
                    Includes
                  </h3>
                  <ul className="mt-4 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
                    {service.capabilities.map((capability) => (
                      <li
                        key={capability}
                        className="flex items-start gap-3 text-[0.9375rem] leading-snug text-ink-soft"
                      >
                        <span className="mt-px inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-soft">
                          <Check
                            aria-hidden="true"
                            strokeWidth={2.5}
                            className="size-3 text-accent"
                          />
                        </span>
                        {capability}
                      </li>
                    ))}
                  </ul>

                  <h3 className="mt-10 font-sans text-sm font-semibold text-ink">
                    Built with
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {service.technologies.map((technology) => (
                      <TechnologyBadge key={technology}>{technology}</TechnologyBadge>
                    ))}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
