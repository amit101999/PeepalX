import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { heroBuildPhrases, heroDescription, heroHeadline } from "@/data/company";
import { primaryCta } from "@/data/navigation";
import { HeroMark } from "./hero/HeroMark";
import { TypedServices } from "./hero/TypedServices";

/**
 * Home page hero: the page's one orchestrated moment.
 *
 * In order: the headline arrives word by word, the typed line starts naming
 * what we build, then the description and actions settle in while the logo
 * assembles itself beside them. Everything after that is still.
 *
 * The headline and description are server-rendered text, visible without
 * JavaScript; their entrance is CSS (`data-word`, `data-enter` in
 * globals.css). Only the typed line and the logo are client components, and
 * all of it is calmed by the reduced-motion rules.
 */
export function Hero() {
  const words = heroHeadline.split(" ");

  return (
    <section className="relative overflow-hidden">
      <Container>
        <div className="grid items-center gap-14 pt-14 pb-16 sm:pt-20 sm:pb-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-10 lg:pt-24 lg:pb-24">
          <div>
            <h1 className="text-display font-semibold text-ink">
              {words.map((word, index) => (
                <span key={`${word}-${index}`}>
                  <span data-word style={{ "--i": index } as React.CSSProperties}>
                    {word}
                  </span>
                  {index < words.length - 1 ? " " : null}
                </span>
              ))}
            </h1>

            <div data-enter style={{ "--enter-delay": "380ms" } as React.CSSProperties}>
              <TypedServices phrases={heroBuildPhrases} />
            </div>

            <p
              data-enter
              style={{ "--enter-delay": "480ms" } as React.CSSProperties}
              className="mt-5 max-w-xl text-lead text-muted"
            >
              {heroDescription}
            </p>

            <div
              data-enter
              style={{ "--enter-delay": "580ms" } as React.CSSProperties}
              className="mt-10 flex flex-col gap-3 sm:flex-row"
            >
              <Button href={primaryCta.href} size="lg">
                {primaryCta.label}
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Button>
              <Button href="/work" size="lg" variant="secondary">
                See our work
              </Button>
            </div>
          </div>

          <HeroMark />
        </div>
      </Container>
    </section>
  );
}
