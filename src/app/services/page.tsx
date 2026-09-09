import { PageHeader } from "@/components/layout/PageHeader";
import { CtaSection } from "@/components/sections/CtaSection";
import { TechnologyStack } from "@/components/sections/TechnologyStack";
import { TechnologyBadge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { services } from "@/data/services";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, servicesSchema } from "@/lib/seo/structured-data";

export const metadata = createMetadata({
  title: "Services",
  description:
    "Web and mobile development, AI systems, automation and integrations, data tooling and custom Zoho solutions — what each service covers and what we build with.",
  path: "/services",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
];

/**
 * Services page.
 *
 * Each service is rendered as a full-width row with its own anchor id, so the
 * footer links (/services#ai-systems and friends) land on the right one.
 */
export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="What we build, and what that includes"
        description="Six areas of work. Most projects draw on two or three of them at once, which is the reason we keep them under one team."
        breadcrumbs={breadcrumbs}
      />

      <Section>
        <div className="flex flex-col">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <Reveal
                key={service.slug}
                delay={index === 0 ? 0 : 40}
                className="scroll-mt-24 border-b border-line py-14 first:pt-0 last:border-b-0"
              >
                <div
                  id={service.slug}
                  className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16"
                >
                  <div>
                    <span className="inline-flex size-11 items-center justify-center rounded-lg bg-accent-soft text-accent">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>

                    <h2 className="mt-6 text-h2 font-semibold text-ink">
                      {service.title}
                    </h2>

                    <p className="mt-4 leading-relaxed text-muted">
                      {service.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-1.5">
                      {service.technologies.map((technology) => (
                        <TechnologyBadge key={technology}>{technology}</TechnologyBadge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-label font-medium text-faint uppercase">
                      What that covers
                    </h3>

                    <ul className="mt-5 grid gap-x-8 gap-y-px sm:grid-cols-2">
                      {service.capabilities.map((capability) => (
                        <li
                          key={capability}
                          className="border-t border-line py-3.5 text-sm text-ink-soft"
                        >
                          {capability}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <TechnologyStack />

      <CtaSection
        title="Not sure which of these you need?"
        description="Describe the problem rather than the solution. We will tell you what it would take to solve, and whether we are the right people for it."
        secondary={{ label: "See our work", href: "/work" }}
      />

      <JsonLd data={[...servicesSchema(), breadcrumbSchema(breadcrumbs)]} />
    </>
  );
}
