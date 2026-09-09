import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TeamMemberCard } from "@/components/ui/TeamMemberCard";
import { team } from "@/data/team";

/** The founding team. Content lives in `src/data/team.ts`. */
export function Team({ id = "team" }: { id?: string }) {
  return (
    <Section id={id} spacing="loose">
      <SectionHeading
        eyebrow="Team"
        title="The people you will be working with"
        description="Three co-founders. Between us we cover engineering, delivery and the commercial side, and you deal with us directly throughout."
      />

      <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((member, index) => (
          <Reveal as="li" key={member.slug} delay={index * 70} className="h-full">
            <TeamMemberCard member={member} />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
