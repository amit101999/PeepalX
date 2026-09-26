import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { company } from "@/data/company";

/**
 * Mission, then vision: where the company is now and where it is heading,
 * joined by a line that draws itself as the band scrolls into view.
 *
 * The line uses the site's `data-grow` scroll timeline (CSS only), which grows
 * downwards below `xl` and rightwards from `xl`; the layout turns from stacked
 * to side by side at the same breakpoint so the line always runs from one
 * statement to the other. Browsers without scroll timelines, and visitors who
 * prefer reduced motion, see it fully drawn.
 */
export function VisionMission() {
  return (
    <Section tone="tint" slant="both" spacing="loose">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_7rem_minmax(0,1fr)] xl:gap-10">
        <Statement label="Mission" text={company.mission} />

        <div
          aria-hidden="true"
          className="flex w-5 flex-col items-center gap-1 text-accent xl:w-full xl:flex-row xl:self-center"
        >
          <span className="block h-16 w-px bg-accent xl:h-px xl:w-full" data-grow />
          <ArrowRight
            className="size-5 shrink-0 rotate-90 xl:rotate-0"
            strokeWidth={1.75}
          />
        </div>

        <Statement label="Vision" text={company.vision} />
      </div>
    </Section>
  );
}

function Statement({ label, text }: { label: string; text: string }) {
  return (
    <div data-reveal>
      <h2 className="font-sans text-label font-medium text-accent">{label}</h2>
      <p className="mt-4 font-display text-h3 font-medium text-balance text-ink lg:text-h2">
        {text}
      </p>
    </div>
  );
}
