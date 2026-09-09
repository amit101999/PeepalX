import { PageHeader } from "@/components/layout/PageHeader";
import { CtaSection } from "@/components/sections/CtaSection";
import { Team } from "@/components/sections/Team";
import { JsonLd } from "@/components/ui/JsonLd";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/structured-data";

export const metadata = createMetadata({
  title: "Team",
  description:
    "The three co-founders behind the company, and how we split engineering, delivery and client work between us.",
  path: "/team",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Team", path: "/team" },
];

export default function TeamPage() {
  return (
    <>
      <PageHeader
        eyebrow="Team"
        title="Three founders, no layers in between"
        description="You work directly with the people who scope, build and support what we deliver."
        breadcrumbs={breadcrumbs}
      />

      <Team id="team-list" />

      <Section tone="elevated" bordered>
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <SectionHeading
            eyebrow="How we work together"
            title="A small team on purpose"
          />

          <div className="flex flex-col gap-5 text-[1.0625rem] leading-relaxed text-ink-soft">
            <p>
              Three people is small enough that everyone knows the whole system and no
              decision needs a meeting to explain it. It is also small enough that we take
              on fewer projects than we are asked to, which is deliberate.
            </p>
            <p>
              Every project has one of us accountable for it end to end. That person
              scopes the work, writes a good part of it, and is still the person you talk
              to after launch.
            </p>
            <p>
              When a project needs a skill outside the three of us, we say so rather than
              improvising with it on your budget.
            </p>
          </div>
        </div>
      </Section>

      <CtaSection
        title="Want to talk to us directly?"
        description="Send a short description of what you need. You will get a reply from one of the three of us, not a sales team."
      />

      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </>
  );
}
