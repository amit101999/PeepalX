import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps } from "@/data/process";

/**
 * "How We Work" — the six engagement stages.
 *
 * Rendered as an ordered list on a dark section. The dark tone is one of the
 * few background changes on the page, which is what stops a long homepage from
 * reading as one continuous block.
 */
export function Process() {
  return (
    <Section id="process" tone="ink" spacing="loose">
      <SectionHeading
        eyebrow="How we work"
        title="A process built to remove uncertainty"
        description="You should know what happens next at every point in a project, and what it will cost you if something changes. These are the six stages we run."
        onDark
      />

      <ol className="mt-14 grid gap-x-10 gap-y-px sm:grid-cols-2 lg:grid-cols-3">
        {processSteps.map((step, index) => (
          <Reveal
            as="li"
            key={step.number}
            delay={(index % 3) * 70}
            className="border-t border-canvas/15 py-7"
          >
            <span className="font-mono text-sm text-accent">{step.number}</span>
            <h3 className="mt-3 text-[1.0625rem] font-medium text-canvas">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-canvas/60">
              {step.description}
            </p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
