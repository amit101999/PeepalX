import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { company } from "@/data/company";
import { companyValues } from "@/data/values";

/**
 * The About page body: the company story, then how we work.
 *
 * The story copy lives in `src/data/company.ts`. It avoids the standard agency
 * vocabulary (no "passionate about innovation", no "cutting-edge") and says
 * nothing that cannot be substantiated.
 */
export function About() {
  const [opening, ...rest] = company.story;

  return (
    <>
      <Section id="about">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-20">
          <h2 className="text-h2 font-semibold text-ink">Our story</h2>

          <div className="flex max-w-2xl flex-col gap-5 leading-relaxed text-ink-soft">
            {opening ? (
              <p className="font-display text-h3 font-medium text-ink">{opening}</p>
            ) : null}
            {rest.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Section>

      <Section id="values" bordered>
        <SectionHeading
          title="How we work"
          description="Six commitments, each one something you can hold us to."
        />

        {/* Two columns, not three: these are sentences to read, not cards to
            scan, and a hairline each keeps six accent rules off the page. */}
        <ul className="mt-12 grid gap-x-16 gap-y-10 sm:grid-cols-2">
          {companyValues.map((value) => (
            <li key={value.title} data-reveal className="border-t border-line pt-5">
              <h3 className="text-h3 font-semibold text-ink">{value.title}</h3>
              <p className="mt-2.5 leading-relaxed text-muted">{value.description}</p>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
