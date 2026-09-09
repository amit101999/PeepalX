import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * "Why work with us".
 *
 * Every point here is a claim about how we work, not a metric. No satisfaction
 * percentages, delivery statistics or client counts appear anywhere on this
 * site, because there is no data behind them yet.
 */
const reasons = [
  {
    title: "You talk to the people building it",
    description:
      "There is no account layer between you and the engineers. The person who answers your question is the person writing the code.",
  },
  {
    title: "Software, AI and automation in one team",
    description:
      "Most projects need an application, some integrations and increasingly some intelligence. Splitting that across vendors is where the cost usually goes.",
  },
  {
    title: "Architecture sized to the problem",
    description:
      "We pick the simplest design that meets the requirement, and say so when a feature is not worth what it costs to build.",
  },
  {
    title: "Clear scope and honest trade-offs",
    description:
      "You get the constraints and the risks in writing before work starts, including the parts we are uncertain about.",
  },
  {
    title: "Built to be handed over",
    description:
      "Readable code, written-down decisions and real documentation, so you are never locked in to us by confusion.",
  },
  {
    title: "Support after launch",
    description:
      "Launch is the start of the system's life. We stay available for the maintenance and changes that follow.",
  },
];

export function WhyUs() {
  return (
    <Section tone="elevated" bordered>
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <SectionHeading
          eyebrow="Why us"
          title="What you actually get working with a small engineering team"
          description="Three engineers, direct communication and full ownership of what we deliver."
        />

        <ul className="grid gap-x-10 gap-y-px sm:grid-cols-2">
          {reasons.map((reason, index) => (
            <Reveal
              as="li"
              key={reason.title}
              delay={(index % 2) * 70}
              className="border-t border-line py-6"
            >
              <h3 className="font-medium text-ink">{reason.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {reason.description}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
