import { AlertTriangle } from "lucide-react";
import { Section } from "@/components/ui/Section";

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

/**
 * Shared layout for the three legal pages.
 *
 * Every one of them renders a prominent notice first: the text on these pages
 * is structural placeholder content, not reviewed legal copy. Publishing
 * invented legal terms would be worse than publishing nothing, so the notice
 * stays until a real policy replaces the content.
 */
export function LegalDocument({
  lastUpdated,
  sections,
}: {
  lastUpdated: string;
  sections: LegalSection[];
}) {
  return (
    <Section containerWidth="narrow">
      <p className="flex items-start gap-3 rounded-lg border border-line bg-elevated px-4 py-3.5 text-sm text-muted">
        <AlertTriangle
          aria-hidden="true"
          className="mt-0.5 size-4 shrink-0 text-accent"
        />
        <span>
          <span className="font-medium text-ink">Placeholder document.</span> This page
          sets out the structure of the policy only. Replace it with copy reviewed by a
          qualified adviser before relying on it.
        </span>
      </p>

      <p className="mt-8 text-sm text-faint">Last updated: {lastUpdated}</p>

      <div className="mt-10 flex flex-col gap-10">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-h3 font-semibold text-ink">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-3 leading-relaxed text-ink-soft">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </Section>
  );
}
