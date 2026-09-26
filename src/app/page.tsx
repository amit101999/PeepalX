import { CtaSection } from "@/components/sections/CtaSection";
import { Hero } from "@/components/sections/Hero";
import { Statement } from "@/components/sections/home/Statement";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Services } from "@/components/sections/Services";
import { Team } from "@/components/sections/Team";
import { Testimonials } from "@/components/sections/Testimonials";
import { WhyUs } from "@/components/sections/WhyUs";

/**
 * Home page.
 *
 * The section order is the narrative: what we build, how we work (one large
 * statement), proof, why us, who we are, what clients say, then the ask.
 * Deeper detail lives on its own page: how a project runs is on /services, and
 * the FAQ is on /contact. Each section uses a different layout (diagram,
 * index, statement, feature, card stack, portraits, quotes, dark close), so
 * the page never falls into one repeated template. Reordering the page is
 * reordering these lines.
 *
 * This page is a Server Component. Its motion is mostly CSS; the scroll-linked
 * pieces (the statement's word fill, the Why-us card stack, the magnetic hero
 * action) are small Motion client leaves, and the closing block's wave is
 * Three.js, loaded only as it nears the viewport. All of it respects
 * reduced-motion preferences.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Statement />
      <SelectedWork />
      <WhyUs />
      <Team teaser />
      <Testimonials />
      <CtaSection />
    </>
  );
}
