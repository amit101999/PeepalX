import { PageHeader } from "@/components/layout/PageHeader";
import { CtaSection } from "@/components/sections/CtaSection";
import { Process } from "@/components/sections/Process";
import { TechnologyStack } from "@/components/sections/TechnologyStack";
import { ServiceChapters } from "@/components/services/ServiceChapters";
import { ServiceMap } from "@/components/services/ServiceMap";
import { JsonLd } from "@/components/ui/JsonLd";
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
 * Opens on a map of the six services (an index beside a diagram of them
 * around one team), then a chapter per service, each with a diagram of how
 * that kind of system fits together. Every chapter keeps its anchor id, so the
 * index, the home page service list and the footer links
 * (/services#ai-systems and friends) all land on the right one. After the
 * services: how a project runs (/services#process), then the technology we
 * build with.
 */
export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="Software, AI and automation services"
        description="Six areas of work. Most projects draw on two or three of them, which is why they sit under one team."
        breadcrumbs={breadcrumbs}
      />

      <ServiceMap />

      <ServiceChapters />

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
