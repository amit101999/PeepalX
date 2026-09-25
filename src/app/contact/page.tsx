import { FileText, Mail, MessageSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContactForm } from "@/components/forms/ContactForm";
import { Faq } from "@/components/sections/Faq";
import { JsonLd } from "@/components/ui/JsonLd";
import { Section } from "@/components/ui/Section";
import { site } from "@/config/site";
import { faqs } from "@/data/faq";
import { createMetadata } from "@/lib/seo/metadata";
import { faqSchema } from "@/lib/seo/structured-data";

export const metadata = createMetadata({
  title: "Contact",
  description:
    "Tell us what you are building or what problem you need solved. We reply with our reading of it and a suggested first step.",
  path: "/contact",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

/*
 * These steps describe only what is already true of the process (see "How do
 * we start?" in src/data/faq.ts). Add a response-time promise here only once
 * the team has agreed to keep it.
 */
const nextSteps: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Mail,
    title: "A founder reads it",
    description: "Every message is read by one of the three of us, not a sales team.",
  },
  {
    icon: FileText,
    title: "We reply with a first reading",
    description:
      "Our understanding of the problem, what we would need to know next, and a suggested first step.",
  },
  {
    icon: MessageSquare,
    title: "A call if it looks like a fit",
    description:
      "A conversation about the problem before anyone talks about scope or cost.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Start a project"
        description="Describe the problem, rough detail is fine. We reply with our reading of it and a suggested first step."
        breadcrumbs={breadcrumbs}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-20">
          <div>
            <h2 className="sr-only">Project enquiry form</h2>
            <ContactForm />
          </div>

          {/* Set as plain text beside the form: boxes here would compete with
              it for attention without adding any hierarchy. */}
          <aside
            aria-labelledby="what-happens-next"
            className="flex flex-col gap-10 lg:pt-2"
          >
            <div>
              <h2 id="what-happens-next" className="text-h3 font-semibold text-ink">
                What happens next
              </h2>

              <ol className="mt-6 flex flex-col gap-6">
                {nextSteps.map((step) => (
                  <NextStep key={step.title} {...step} />
                ))}
              </ol>
            </div>

            {site.email ? (
              <div className="border-t border-line pt-6">
                <h2 className="text-h3 font-semibold text-ink">Prefer email?</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Write to us directly and we will pick it up the same way.
                </p>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-accent underline underline-offset-4"
                >
                  {site.email}
                </a>
              </div>
            ) : null}
          </aside>
        </div>
      </Section>

      <Faq />

      {/* FAQ structured data, generated from the same content the page shows. */}
      <JsonLd data={faqSchema(faqs)} />
    </>
  );
}

function NextStep({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <li className="flex items-start gap-3.5">
      <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center bg-accent-soft text-accent chamfer cut-sm">
        <Icon aria-hidden className="size-4" />
      </span>
      <div>
        <h3 className="font-sans text-sm font-semibold text-ink">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">{description}</p>
      </div>
    </li>
  );
}
