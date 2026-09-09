import { Clock, Mail, MessageSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContactForm } from "@/components/forms/ContactForm";
import { Accordion } from "@/components/ui/Accordion";
import { JsonLd } from "@/components/ui/JsonLd";
import { Section } from "@/components/ui/Section";
import { site } from "@/config/site";
import { faqs } from "@/data/faq";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/structured-data";

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

/** The three questions people ask before sending an enquiry. */
const contactFaqs = faqs.slice(-3);

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Have a project in mind?"
        description="Tell us what you are building, what problem you are solving, or where you need help. We will get back to you with the next steps."
        breadcrumbs={breadcrumbs}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div>
            <h2 className="sr-only">Project enquiry form</h2>
            <ContactForm />
          </div>

          <aside className="flex flex-col gap-8">
            <div className="rounded-xl border border-line bg-elevated p-6">
              <h2 className="font-semibold text-ink">What happens next</h2>

              <ul className="mt-5 flex flex-col gap-5">
                <NextStep
                  icon={Mail}
                  title="We read it properly"
                  description="One of the three of us reads your message, not a form router."
                />
                <NextStep
                  icon={Clock}
                  title="You hear back within a business day"
                  description="Usually sooner. If we need more detail to answer well, we will ask."
                />
                <NextStep
                  icon={MessageSquare}
                  title="A short call if it looks like a fit"
                  description="Thirty minutes to understand the problem before anyone talks about scope or cost."
                />
              </ul>
            </div>

            {site.email ? (
              <div className="rounded-xl border border-line p-6">
                <h2 className="font-semibold text-ink">Prefer email?</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Write to us directly and we will pick it up the same way.
                </p>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-4 inline-block text-sm font-medium text-accent underline underline-offset-4"
                >
                  {site.email}
                </a>
              </div>
            ) : null}

            <div>
              <h2 className="text-label font-medium text-faint uppercase">
                Before you write
              </h2>
              <div className="mt-4">
                <Accordion items={contactFaqs} />
              </div>
            </div>
          </aside>
        </div>
      </Section>

      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
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
      <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-accent">
        <Icon aria-hidden className="size-4" />
      </span>
      <div>
        <h3 className="text-sm font-medium text-ink">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">{description}</p>
      </div>
    </li>
  );
}
