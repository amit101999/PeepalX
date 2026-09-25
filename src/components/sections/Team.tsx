import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TeamMemberCard } from "@/components/ui/TeamMemberCard";
import { TextLink } from "@/components/ui/TextLink";
import { team } from "@/data/team";

/**
 * The founding team. Content lives in `src/data/team.ts`.
 *
 * `teaser` is the home page version: portraits with name and role, and a link
 * to /team for the bios. Without it, the full cards render under a visually
 * hidden h2, for pages whose own header already introduces the team.
 */
export function Team({ id = "team", teaser = false }: { id?: string; teaser?: boolean }) {
  return (
    <Section
      id={id}
      spacing="loose"
      tone={teaser ? "tint" : "canvas"}
      slant={teaser ? "both" : undefined}
    >
      {teaser ? (
        <div className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            title="The founders"
            description="Two engineers and one co-founder on the client side. You deal with us directly throughout."
          />
          <TextLink href="/team">Meet the team</TextLink>
        </div>
      ) : (
        // The page header already introduces the team, so this heading is for
        // structure only: without it the page jumps from h1 to the card h3s.
        <h2 className="sr-only">The founders</h2>
      )}

      <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {team.map((member) => (
          <li key={member.slug} data-reveal className="h-full">
            <TeamMemberCard member={member} showBio={!teaser} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
