import { Section } from "@/components/ui/Section";
import { company } from "@/data/company";

/** Mission and vision, set as two large statements on a quiet background. */
export function VisionMission() {
  const statements = [
    { label: "Mission", text: company.mission },
    { label: "Vision", text: company.vision },
  ];

  return (
    <Section tone="elevated">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        {statements.map((statement) => (
          <div key={statement.label}>
            <h2 className="font-sans text-label font-medium text-accent">
              {statement.label}
            </h2>
            <p className="mt-4 font-display text-h3 font-medium text-balance text-ink lg:text-h2">
              {statement.text}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
