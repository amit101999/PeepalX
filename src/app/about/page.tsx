import { PageHeader } from "@/components/layout/PageHeader";
import { About } from "@/components/sections/About";
import { CtaSection } from "@/components/sections/CtaSection";
import { Process } from "@/components/sections/Process";
import { Team } from "@/components/sections/Team";
import { VisionMission } from "@/components/sections/VisionMission";
import { WhyUs } from "@/components/sections/WhyUs";
import { JsonLd } from "@/components/ui/JsonLd";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/structured-data";
import { site } from "@/config/site";

export const metadata = createMetadata({
  title: "About",
  description: `Who ${site.name} is, how we work with clients, what we value, and where the company is heading.`,
  path: "/about",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
];

/**
 * About page.
 *
 * Composed from the same section components the home page uses, so the copy
 * lives in exactly one place and cannot drift between the two pages.
 */
export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A small engineering team building software that has to work"
        description="Three co-founders, a deliberately narrow stack, and a preference for saying what a project will really take."
        breadcrumbs={breadcrumbs}
      />

      <About />
      <VisionMission />
      <Process />
      <WhyUs />
      <Team id="team-about" />

      <CtaSection secondary={{ label: "See our work", href: "/work" }} />

      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </>
  );
}
