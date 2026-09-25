import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Magnetic } from "@/components/ui/Magnetic";
import { heroBuildPhrases, heroDescription, heroHeadline } from "@/data/company";
import { primaryCta } from "@/data/navigation";
import { HeroMark } from "./hero/HeroMark";
import { TypedServices } from "./hero/TypedServices";

/** How many of the headline's final words are set in the accent colour. */
const HEADLINE_ACCENT_WORDS = 2;

/**
 * Home page hero: the page's one orchestrated moment.
 *
 * In order: the headline arrives word by word, the typed line starts naming
 * what we build, then the description and actions settle in while the logo
 * assembles itself beside them. Everything after that is still.
 *
 * The headline and description are server-rendered text, visible without
 * JavaScript; their entrance is CSS (`data-word`, `data-enter` in
 * globals.css). The logo is a Server Component animated
 * by CSS; the client pieces are the typed line and the magnetic pull on the
 * primary action (`Magnetic`). All of it is calmed by the reduced-motion rules.
 */
export function Hero() {
  const words = heroHeadline.split(" ");
  // The headline's last words carry the accent: a two-tone headline puts the
  // promise ("run on") in the brand colour without a second typeface.
  const accentFrom = words.length - HEADLINE_ACCENT_WORDS;

  return (
    <section className="relative isolate overflow-hidden">
      {/* The drafting grid the mark is drawn on, fading out from behind it. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 blueprint [mask-image:radial-gradient(ellipse_60%_55%_at_50%_78%,#000_20%,transparent_75%)] lg:[mask-image:radial-gradient(ellipse_45%_70%_at_76%_50%,#000_25%,transparent_80%)]"
      />
      <Container>
        <div className="grid items-center gap-14 pt-14 pb-16 sm:pt-20 sm:pb-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10 lg:pt-24 lg:pb-24">
          <div>
            <h1 className="text-display font-semibold text-ink">
              {words.map((word, index) => (
                <span key={`${word}-${index}`}>
                  <span
                    data-word
                    style={{ "--i": index } as React.CSSProperties}
                    className={index >= accentFrom ? "text-accent" : undefined}
                  >
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
              <Magnetic>
                <Button href={primaryCta.href} size="lg" arrow>
                  {primaryCta.label}
                </Button>
              </Magnetic>
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
