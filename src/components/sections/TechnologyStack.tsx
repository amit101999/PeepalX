import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { technologyGroups } from "@/data/technologies";

/**
 * Technology section.
 *
 * Set as text in grouped columns rather than a logo wall: logos need
 * permission, add image weight, and say less than a grouped list does.
 */
export function TechnologyStack() {
  return (
    <Section id="technology" bordered>
      <SectionHeading
        eyebrow="Technology"
        title="What we build with"
        description="A deliberately small stack we know well, chosen per project rather than applied by default."
      />

      <div className="mt-14 grid gap-x-10 gap-y-px sm:grid-cols-2 lg:grid-cols-3">
        {technologyGroups.map((group, index) => (
          <Reveal
            key={group.name}
            delay={(index % 3) * 70}
            className="border-t border-line py-6"
          >
            <h3 className="text-label font-medium text-faint uppercase">{group.name}</h3>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
              {group.items.map((item) => (
                <li key={item} className="text-sm text-ink-soft">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
