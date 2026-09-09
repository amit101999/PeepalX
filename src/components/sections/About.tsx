import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { companyValues } from "@/data/values";
import { site } from "@/config/site";

/**
 * About and core values.
 *
 * Copy avoids the standard agency vocabulary — no "passionate about
 * innovation", no "cutting-edge". It says what the company is and what it
 * intends to become, and nothing that cannot be substantiated.
 */
export function About() {
  return (
    <Section id="about" bordered>
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <SectionHeading eyebrow="About" title={`Who ${site.name} is`} />

        <div className="flex flex-col gap-5 text-[1.0625rem] leading-relaxed text-ink-soft">
          <p>
            {site.name} is a technology company started by three people who spent their
            careers building software and wanted to do it on their own terms: fewer
            projects, taken seriously, with the people who scoped the work also delivering
            it.
          </p>
          <p>
            We work across web and mobile applications, AI systems, automation and
            business platforms. In practice most of what we are asked for sits between
            those categories — an application that needs to talk to three existing
            systems, or a manual process that should have been software two years ago.
          </p>
          <p>
            We are direct about scope. If a project is larger than its budget, or a
            requirement will cost more than it returns, we say so before the work starts.
            We would rather lose an engagement at the proposal stage than deliver
            something that disappoints at the end of it.
          </p>
          <p>
            Services are where we start, not where we intend to finish. The longer-term
            direction is our own software: products and platforms built on what we learn
            solving these problems for other companies.
          </p>
        </div>
      </div>

      <div className="mt-20 lg:mt-28">
        <h3 className="text-label font-medium text-faint uppercase">Core values</h3>

        <ul className="mt-8 grid gap-x-10 gap-y-px sm:grid-cols-2 lg:grid-cols-3">
          {companyValues.map((value, index) => {
            const Icon = value.icon;

            return (
              <Reveal
                as="li"
                key={value.title}
                delay={(index % 3) * 60}
                className="border-t border-line py-6"
              >
                <Icon aria-hidden="true" className="size-5 text-accent" />
                <h4 className="mt-4 font-medium text-ink">{value.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {value.description}
                </p>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
