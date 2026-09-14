import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { company } from "@/data/company";
import { companyValues } from "@/data/values";
import { site } from "@/config/site";

/**
 * About and core values.
 *
 * The story copy lives in `src/data/company.ts`. It avoids the standard agency
 * vocabulary — no "passionate about innovation", no "cutting-edge" — and says
 * nothing that cannot be substantiated.
 */
export function About() {
  return (
    <Section id="about" bordered>
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <SectionHeading eyebrow="About" title={`Who ${site.name} is`} />

        <div className="flex flex-col gap-5 text-[1.0625rem] leading-relaxed text-ink-soft">
          {company.story.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
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
