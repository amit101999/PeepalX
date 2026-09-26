import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Frame } from "@/components/ui/Frame";
import { Section } from "@/components/ui/Section";
import { site } from "@/config/site";

export interface LegalSection {
  heading: string;
  paragraphs: string[];
  /** Optional link shown after the paragraphs, e.g. to the contact form. */
  link?: { label: string; href: string };
}

/**
 * Shared layout for the three legal pages.
 *
 * While `site.legalCopyReviewed` is false every one of them renders a
 * prominent notice first: the text is structural placeholder content, not
 * reviewed legal copy, and publishing invented legal terms would be worse than
 * publishing nothing. The same switch keeps these pages out of search results.
 *
 * Every policy ends with the same "Contact" section, so it is built here from
 * `site.email` rather than repeated in each page. `contactSubject` fills the
 * sentence: "Questions about {this policy} can be sent to ...".
 */
export function LegalDocument({
  lastUpdated,
  sections,
  contactSubject,
}: {
  lastUpdated: string;
  sections: LegalSection[];
  contactSubject: string;
}) {
  const allSections = [...sections, contactSection(contactSubject)];

  return (
    <Section containerWidth="narrow">
      {site.legalCopyReviewed ? null : (
        <Frame cut="md" innerClassName="bg-elevated">
          <p className="flex items-start gap-3 px-4 py-3.5 text-sm text-muted">
            <AlertTriangle
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-accent"
            />
            <span>
              <span className="font-medium text-ink">Placeholder document.</span> This
              page sets out the structure of the policy only. Replace it with copy
              reviewed by a qualified adviser before relying on it.
            </span>
          </p>
        </Frame>
      )}

      <p className="mt-8 text-sm text-faint">Last updated: {lastUpdated}</p>

      <div className="mt-10 flex flex-col gap-10">
        {allSections.map((section, index) => (
          <section key={`${index}-${section.heading}`}>
            <h2 className="text-h3 font-semibold text-ink">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-3 leading-relaxed text-ink-soft">
                {paragraph}
              </p>
            ))}
            {section.link ? (
              <p className="mt-3">
                <Link
                  href={section.link.href}
                  className="font-medium text-accent underline underline-offset-4"
                >
                  {section.link.label}
                </Link>
              </p>
            ) : null}
          </section>
        ))}
      </div>
    </Section>
  );
}

/** The closing section every legal page shares. */
function contactSection(subject: string): LegalSection {
  if (site.email) {
    return {
      heading: "Contact",
      paragraphs: [`Questions about ${subject} can be sent to ${site.email}.`],
    };
  }

  return {
    heading: "Contact",
    paragraphs: [`Questions about ${subject} can be sent through our contact form.`],
    link: { label: "Go to the contact form", href: "/contact" },
  };
}
