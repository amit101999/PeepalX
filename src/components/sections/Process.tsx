import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps } from "@/data/process";

/**
 * "How a project runs": the six engagement stages as a timeline, on /services.
 *
 * The stages are a real sequence, so they are an ordered list joined by one
 * line: vertical on small screens, horizontal from `xl` up. Where the browser
 * supports scroll-driven animation the line grows as the section scrolls into
 * view (`data-grow` in globals.css); everywhere else it is simply drawn.
 */
export function Process() {
  return (
    <Section id="process" spacing="loose" bordered>
      <SectionHeading
        title="How a project runs"
        description="Six stages, with working software to review along the way rather than only at the end."
      />

      <div className="relative mt-16">
        <div
          aria-hidden="true"
          className="absolute top-3 bottom-3 left-[11px] w-0.5 overflow-clip rounded-full bg-line xl:top-[11px] xl:right-0 xl:bottom-auto xl:left-0 xl:h-0.5 xl:w-auto"
        >
          <div data-grow className="size-full bg-accent" />
        </div>

        <ol className="relative grid gap-10 xl:grid-cols-6 xl:gap-8">
          {processSteps.map((step) => (
            <li key={step.number} className="relative pl-12 xl:pt-12 xl:pl-0">
              <span
                aria-hidden="true"
                className="absolute top-0 left-0 inline-flex size-6 items-center justify-center rounded-full border-2 border-accent bg-canvas text-[0.6875rem] font-semibold text-accent tabular-nums"
              >
                {Number(step.number)}
              </span>
              <h3 className="text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
