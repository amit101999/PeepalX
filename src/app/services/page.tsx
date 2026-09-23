import { Check } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CtaSection } from "@/components/sections/CtaSection";
import { Process } from "@/components/sections/Process";
import { TechnologyStack } from "@/components/sections/TechnologyStack";
import { TechnologyBadge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/ui/JsonLd";
import { Section } from "@/components/ui/Section";
import { services } from "@/data/services";
import { createMetadata } from "@/lib/seo/metadata";
import { servicesSchema } from "@/lib/seo/structured-data";

export const metadata = createMetadata({
  title: "Services",
  description:
    "Web and mobile development, AI systems, automation and integrations, data tooling and custom Zoho solutions: what each service covers and what we build with.",
  path: "/services",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
];

/**
 * Services page.
 *
 * Each service is a full-width row with its own anchor id, so the index at the
 * top of this page, the home page service list and the footer links
 * (/services#ai-systems and friends) all land on the right one. After the services: how a project runs
 * (/services#process), then the technology we build with.
 */
export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="Software, AI and automation services"
        description="Six areas of work. Most projects draw on two or three of them, which is why they sit under one team."
        breadcrumbs={breadcrumbs}
      />

      {/* The six anchors, so a long page can be navigated from the top. */}
      <Section spacing="tight">
        <nav aria-label="Services on this page">
          <ul className="flex flex-wrap gap-x-7 gap-y-2">
            {services.map((service) => (
              <li key={service.slug}>
                <a
                  href={`#${service.slug}`}
                  className="inline-flex min-h-11 items-center text-sm font-medium text-muted underline decoration-transparent underline-offset-4 transition-colors hover:text-ink hover:decoration-line-strong"
                >
                  {service.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Section>

      <Section spacing="loose" bordered>
        <ul className="flex flex-col">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <li
                key={service.slug}
                id={service.slug}
                tabIndex={-1}
                data-reveal
                className="grid gap-8 border-t border-line py-14 first:border-t-0 first:pt-0 last:pb-0 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16"
              >
                <div>
                  <Icon
                    aria-hidden="true"
                    strokeWidth={1.75}
                    className="size-7 text-accent"
                  />

                  <h2 className="mt-5 text-h2 font-semibold text-ink">{service.title}</h2>

                  <p className="mt-4 leading-relaxed text-muted">{service.description}</p>

                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {service.technologies.map((technology) => (
                      <TechnologyBadge key={technology}>{technology}</TechnologyBadge>
                    ))}
                  </div>
                </div>

                <div className="self-start">
                  <h3 className="font-sans text-sm font-semibold text-ink">Includes</h3>

                  <ul className="mt-4 grid gap-x-10 sm:grid-cols-2">
                    {service.capabilities.map((capability) => (
                      <li
                        key={capability}
                        className="flex items-start gap-2.5 border-t border-line py-3 text-sm leading-snug text-ink-soft"
                      >
                        <Check
                          aria-hidden="true"
                          className="mt-0.5 size-4 shrink-0 text-accent"
                        />
                        {capability}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </Section>

      <Process />

      <TechnologyStack />

      <CtaSection
        title="Not sure which of these you need?"
        description="Describe the problem rather than the solution. We will tell you what it would take, and whether we are the right people for it."
        secondary={{ label: "See our work", href: "/work" }}
      />

      <JsonLd data={servicesSchema()} />
    </>
  );
}
