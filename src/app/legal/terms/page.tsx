import { LegalDocument } from "@/components/layout/LegalDocument";
import { PageHeader } from "@/components/layout/PageHeader";
import { site } from "@/config/site";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Terms & Conditions",
  description: `The terms that apply to use of the ${site.name} website.`,
  path: "/legal/terms",
});

/** Terms and conditions — placeholder structure only. */
const sections = [
  {
    heading: "Use of this website",
    paragraphs: ["Placeholder: describe acceptable use of the website and its content."],
  },
  {
    heading: "Intellectual property",
    paragraphs: [
      "Placeholder: state ownership of the site content, branding and code, and what visitors may do with it.",
    ],
  },
  {
    heading: "Enquiries and proposals",
    paragraphs: [
      "Placeholder: clarify that information on this site is not an offer, and that engagements are governed by a separate signed agreement.",
    ],
  },
  {
    heading: "Limitation of liability",
    paragraphs: [
      "Placeholder: set out the limitation of liability for use of the website, drafted for the jurisdiction the company operates in.",
    ],
  },
  {
    heading: "Governing law",
    paragraphs: ["Placeholder: name the governing law and jurisdiction."],
  },
  {
    heading: "Contact",
    paragraphs: [`Questions about these terms can be sent to ${site.email}.`],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms & Conditions"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Terms & Conditions", path: "/legal/terms" },
        ]}
      />
      <LegalDocument lastUpdated="Not yet published" sections={sections} />
    </>
  );
}
