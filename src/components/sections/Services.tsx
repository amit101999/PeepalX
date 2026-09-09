import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { services } from "@/data/services";

/** "What We Do" — the six service areas, sourced from `src/data/services.ts`. */
export function Services() {
  return (
    <Section id="services" spacing="loose">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="What we do"
          title="Engineering, AI and automation in one team"
          description="We build the software, connect it to the systems around it, and add intelligence where it genuinely helps — rather than handing three vendors one problem."
        />

        <Button href="/services" variant="secondary" className="shrink-0">
          All services
          <ArrowRight aria-hidden="true" className="size-4" />
        </Button>
      </div>

      <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <Reveal
            as="li"
            key={service.slug}
            // Stagger across the row, then restart — a long cascade down a
            // six-card grid reads as slow rather than considered.
            delay={(index % 3) * 70}
            className="h-full"
          >
            <ServiceCard service={service} />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
