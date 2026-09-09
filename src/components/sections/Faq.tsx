import { Accordion } from "@/components/ui/Accordion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqs } from "@/data/faq";

/**
 * FAQ section.
 *
 * The same `faqs` array also produces the FAQPage structured data on the home
 * page, which keeps the markup and the schema in agreement by construction.
 */
export function Faq() {
  return (
    <Section id="faq" tone="elevated" bordered>
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions we are asked"
          description="If your question is not here, send it through the contact form and we will answer it directly."
        />

        <Accordion items={faqs} />
      </div>
    </Section>
  );
}
