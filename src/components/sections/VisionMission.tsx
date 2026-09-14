import { Section } from "@/components/ui/Section";
import { company } from "@/data/company";

/** Vision and mission, set as two columns on a quiet background. */
export function VisionMission() {
  return (
    <Section tone="elevated" bordered>
      <div className="grid gap-12 sm:grid-cols-2 sm:gap-16">
        <div>
          <h2 className="text-label font-medium text-accent uppercase">Vision</h2>
          <p className="mt-5 text-h3 leading-snug font-medium text-balance text-ink">
            {company.vision}
          </p>
        </div>

        <div>
          <h2 className="text-label font-medium text-accent uppercase">Mission</h2>
          <p className="mt-5 text-h3 leading-snug font-medium text-balance text-ink">
            {company.mission}
          </p>
        </div>
      </div>
    </Section>
  );
}
