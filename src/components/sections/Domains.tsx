import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { domains } from "@/data/domains";

/**
 * "Domains We Can Build For".
 *
 * The heading is phrased as capability rather than claimed specialisation on
 * purpose — see the note in `src/data/domains.ts`.
 */
export function Domains() {
  return (
    <Section tone="elevated" bordered>
      <SectionHeading
        eyebrow="Where we work"
        title="Domains we can build for"
        description="Software problems repeat across industries: a workflow to automate, records to keep in sync, an interface people have to use every day. These are the domains our current capability maps onto."
      />

      <ul className="mt-12 grid gap-x-8 gap-y-px sm:grid-cols-2 lg:grid-cols-3">
        {domains.map((domain, index) => (
          <Reveal
            as="li"
            key={domain.name}
            delay={(index % 3) * 60}
            className="border-t border-line py-5"
          >
            <h3 className="font-medium text-ink">{domain.name}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              {domain.description}
            </p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
