import { PageHeader } from "@/components/layout/PageHeader";
import { CtaSection } from "@/components/sections/CtaSection";
import { Team } from "@/components/sections/Team";
import { ReadingRail } from "@/components/team/ReadingRail";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { createMetadata } from "@/lib/seo/metadata";

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

const smallTeamPoints = [
  "Three people is small enough that everyone knows the whole system and no decision needs a meeting to explain it. It is also small enough that we take on fewer projects than we are asked to, which is deliberate.",
  "Every project has one of us accountable for it end to end. That person scopes the work, stays close to the build, and is still the person you talk to after launch.",
  "When a project needs a skill outside the three of us, we say so rather than improvising with it on your budget.",
];

export default function TeamPage() {
  return (
    <>
      <PageHeader
        title="Three founders, no layers in between"
        description="You work directly with the people who scope, build and support what we deliver."
        breadcrumbs={breadcrumbs}
      />

      <Team id="team-list" />

      <Section tone="tint" slant="both">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading title="A small team on purpose" />
          </div>

          <ReadingRail>
            <div className="flex max-w-[62ch] flex-col gap-8 text-lg leading-relaxed text-ink-soft">
              {smallTeamPoints.map((point) => (
                <p key={point.slice(0, 24)} data-reveal>
                  {point}
                </p>
              ))}
            </div>
          </ReadingRail>
        </div>
      </Section>

      <CtaSection
        title="Want to talk to us directly?"
        description="Send a short description of what you need. A founder reads every message."
      />
    </>
  );
}
