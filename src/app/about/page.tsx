import { MarkAssembly } from "@/components/about/MarkAssembly";
import { PageHeader } from "@/components/layout/PageHeader";
import { About } from "@/components/sections/About";
import { CtaSection } from "@/components/sections/CtaSection";
import { VisionMission } from "@/components/sections/VisionMission";
import { createMetadata } from "@/lib/seo/metadata";
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
 * About page: the story, how we work, and where the company is heading.
 *
 * The header carries the logo assembling itself in 3D (desktop only); the
 * story, values and mission sections below say everything it implies in text.
 *
 * It deliberately does not repeat sections that live elsewhere (why us and
 * team on the home page, process on /services); the header and footer link to
 * those instead.
 */
export default function AboutPage() {
  return (
    <>
      <PageHeader
        title={
          <>
            A small team that <span className="text-accent">builds what it scopes</span>
          </>
        }
        description="Three co-founders, a focused set of services, and a habit of saying what a project will really take."
        breadcrumbs={breadcrumbs}
        aside={<MarkAssembly className="absolute inset-0" />}
      />

      <About />
      <VisionMission />

      <CtaSection secondary={{ label: "See our work", href: "/work" }} />
    </>
  );
}
