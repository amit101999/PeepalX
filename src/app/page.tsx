import { CtaSection } from "@/components/sections/CtaSection";
import { Hero } from "@/components/sections/Hero";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Services } from "@/components/sections/Services";
import { Team } from "@/components/sections/Team";
import { Testimonials } from "@/components/sections/Testimonials";
import { WhyUs } from "@/components/sections/WhyUs";

/**
 * Home page.
 *
 * The section order is the narrative: what we build, proof, why us, who we
 * are, what clients say, then the ask. Deeper detail lives on its own page:
 * how a project runs is on /services, and the FAQ is on /contact. Each section
 * uses a different layout (diagram, index, tiles, portraits, quotes, dark
 * close), so the page never falls into one repeated template. Reordering the
 * page is reordering these lines.
 *
 * This page is a Server Component and ships no JavaScript of its own; all of
 * its motion is CSS. Only the header is a client component.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <SelectedWork />
      <WhyUs />
      <Team teaser />
      <Testimonials />
      <CtaSection />
    </>
  );
}
