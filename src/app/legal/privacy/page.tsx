import { LegalDocument } from "@/components/layout/LegalDocument";
import { PageHeader } from "@/components/layout/PageHeader";
import { site } from "@/config/site";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description: `How ${site.name} handles the personal information submitted through this website.`,
  path: "/legal/privacy",
  // Placeholder legal copy stays out of search results until it is reviewed.
  noIndex: !site.legalCopyReviewed,
});

/**
 * Privacy policy — placeholder structure only.
 *
 * The one section that reflects the site's actual behaviour is "Information we
 * collect": the contact form really does collect those fields, and the site
 * really does load no analytics by default.
 */
const sections = [
  {
    heading: "Information we collect",
    paragraphs: [
      "When you submit the contact form on this website we collect the name, email address, and project description you provide, along with any optional company, phone, budget and timeline details you choose to include.",
      "This website loads no analytics or advertising scripts by default and sets no tracking cookies.",
    ],
  },
  {
    heading: "How we use it",
    paragraphs: [
      "We use the details you submit only to respond to your enquiry and to discuss potential work. We do not sell or rent personal information.",
    ],
  },
  {
    heading: "How long we keep it",
    paragraphs: [
      "Placeholder: state the retention period for enquiry records and how they are disposed of afterwards.",
    ],
  },
  {
    heading: "Who we share it with",
    paragraphs: [
      "Placeholder: list the processors that handle enquiry data, for example the email delivery provider configured for this site, and the jurisdiction each operates in.",
    ],
  },
  {
    heading: "Your rights",
    paragraphs: [
      "Placeholder: set out access, correction, deletion and objection rights under the legislation that applies to your business and your customers.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader
        title="Privacy Policy"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/legal/privacy" },
        ]}
      />
      <LegalDocument
        lastUpdated="Not yet published"
        sections={sections}
        contactSubject="this policy"
      />
    </>
  );
}
