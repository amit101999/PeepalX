import { About } from "@/components/sections/About";
import { CtaSection } from "@/components/sections/CtaSection";
import { Domains } from "@/components/sections/Domains";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { Process } from "@/components/sections/Process";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Services } from "@/components/sections/Services";
import { Team } from "@/components/sections/Team";
import { TechnologyStack } from "@/components/sections/TechnologyStack";
import { Testimonials } from "@/components/sections/Testimonials";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { VisionMission } from "@/components/sections/VisionMission";
import { WhyUs } from "@/components/sections/WhyUs";
import { JsonLd } from "@/components/ui/JsonLd";
import { faqs } from "@/data/faq";
import { faqSchema } from "@/lib/seo/structured-data";

/**
 * Home page.
 *
 * The section order is the narrative: what we do, who it is for, proof, how we
 * work, what we build with, why us, who we are, then the ask. Each section is
 * its own component in `src/components/sections`, so reordering the page is
 * reordering these lines.
 *
 * This page is a Server Component and ships no JavaScript of its own — only
 * the header and the scroll-reveal wrapper are client components.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <Services />
      <Domains />
      <SelectedWork />
      <Process />
      <TechnologyStack />
      <WhyUs />
      <Team />
      <About />
      <VisionMission />
      <Testimonials />
      <Faq />
      <CtaSection secondary={{ label: "View our work", href: "/work" }} />

      {/* FAQ structured data, generated from the same content the page shows. */}
      <JsonLd data={faqSchema(faqs)} />
    </>
  );
}
