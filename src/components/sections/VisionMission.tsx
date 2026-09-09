import { Section } from "@/components/ui/Section";

/** Vision and mission, set as two columns on a quiet background. */
export function VisionMission() {
  return (
    <Section tone="elevated" bordered>
      <div className="grid gap-12 sm:grid-cols-2 sm:gap-16">
        <div>
          <h2 className="text-label font-medium text-accent uppercase">Vision</h2>
          <p className="mt-5 text-h3 leading-snug font-medium text-balance text-ink">
            To build a technology company known for the quality of what it ships —
            software, intelligent systems and products that hold up under real use.
          </p>
        </div>

        <div>
          <h2 className="text-label font-medium text-accent uppercase">Mission</h2>
          <p className="mt-5 text-h3 leading-snug font-medium text-balance text-ink">
            To help businesses use software, AI and automation to solve problems they
            actually have, improve how they operate, and open work that was not practical
            before.
          </p>
        </div>
      </div>
    </Section>
  );
}
