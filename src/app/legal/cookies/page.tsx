import { LegalDocument } from "@/components/layout/LegalDocument";
import { PageHeader } from "@/components/layout/PageHeader";
import { site } from "@/config/site";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Cookie Policy",
  description: `How ${site.name} uses cookies and similar technologies on this website.`,
  path: "/legal/cookies",
});

/**
 * Cookie policy — placeholder structure, with one accurate statement.
 *
 * As shipped, this site sets no cookies and loads no third-party scripts. That
 * stops being true the moment analytics is enabled in `src/lib/analytics.ts`,
 * which is why the note below says so explicitly.
 */
const sections = [
  {
    heading: "Cookies this website sets",
    paragraphs: [
      "As currently configured, this website sets no cookies and loads no third-party analytics or advertising scripts.",
      "If analytics is enabled later, this page must be updated to list each cookie, its purpose and its lifetime, and a consent mechanism may be required depending on your jurisdiction.",
    ],
  },
  {
    heading: "Managing cookies",
    paragraphs: [
      "Placeholder: explain how visitors can control cookies through their browser, once any are in use.",
    ],
  },
  {
    heading: "Changes to this policy",
    paragraphs: [
      "Placeholder: describe how changes to this policy will be communicated.",
    ],
  },
  {
    heading: "Contact",
    paragraphs: [`Questions about this policy can be sent to ${site.email}.`],
  },
];

export default function CookiePolicyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Cookie Policy"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Cookie Policy", path: "/legal/cookies" },
        ]}
      />
      <LegalDocument lastUpdated="Not yet published" sections={sections} />
    </>
  );
}
