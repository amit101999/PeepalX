import { Accordion } from "@/components/ui/Accordion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqs } from "@/data/faq";

/**
 * FAQ section, set as one narrow reading column, on /contact.
 *
 * The same `faqs` array also produces the FAQPage structured data on the
 * contact page, which keeps the markup and the schema in agreement by construction.
 */
export function Faq() {
  return (
    <Section id="faq" spacing="loose" containerWidth="narrow" bordered>
      <SectionHeading
        title="Common questions"
        description="If yours is not here, ask it through the contact form and we will answer directly."
      />

      <div className="mt-12">
        <Accordion items={faqs} />
      </div>
    </Section>
  );
}
