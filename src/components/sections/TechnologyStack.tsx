import { TechnologyBadge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { technologyGroups } from "@/data/technologies";

/**
 * Technology section, used on /services.
 *
 * Set as grouped text rather than a logo wall: logos need permission, add
 * image weight, and say less than a grouped list does.
 */
export function TechnologyStack() {
  return (
    <Section id="technology" bordered>
      <SectionHeading
        title="What we build with"
        description="Tools we know well, chosen per project rather than applied by default."
      />

      <dl className="mt-12 grid gap-x-12 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {technologyGroups.map((group) => (
          <div key={group.name} data-reveal>
            <dt className="text-sm font-semibold text-ink">{group.name}</dt>
            <dd className="mt-3 flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <TechnologyBadge key={item}>{item}</TechnologyBadge>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
