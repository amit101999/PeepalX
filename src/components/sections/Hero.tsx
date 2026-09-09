import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/**
 * Home page hero.
 *
 * The entrance animation is CSS only (`data-enter` + `--enter-delay`, defined
 * in globals.css) so the section costs no JavaScript and is neutralised
 * automatically under `prefers-reduced-motion`.
 */

const capabilities = [
  "Web applications",
  "Mobile apps",
  "AI systems",
  "Automation",
  "Integrations",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <BackgroundGrid />

      <Container>
        <div className="relative grid items-center gap-14 py-20 sm:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-32">
          <div>
            <p data-enter className="text-label font-medium text-accent uppercase">
              Software · AI · Automation
            </p>

            <h1
              data-enter
              style={{ "--enter-delay": "80ms" } as React.CSSProperties}
              className="mt-5 text-display font-semibold"
            >
              We build software that moves businesses forward.
            </h1>

            <p
              data-enter
              style={{ "--enter-delay": "160ms" } as React.CSSProperties}
              className="mt-6 max-w-xl text-lead text-muted"
            >
              From web and mobile applications to AI agents, automation and business
              platforms — we design and build technology that solves a real problem and
              keeps working after launch.
            </p>

            <div
              data-enter
              style={{ "--enter-delay": "240ms" } as React.CSSProperties}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <Button href="/contact" size="lg">
                Start a Project
                <ArrowRight aria-hidden="true" className="size-4" />
              </Button>
              <Button href="/work" size="lg" variant="secondary">
                Explore Our Work
              </Button>
            </div>

            <ul
              data-enter
              style={{ "--enter-delay": "320ms" } as React.CSSProperties}
              className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted"
            >
              {capabilities.map((capability) => (
                <li key={capability} className="flex items-center gap-2">
                  <span aria-hidden="true" className="size-1 rounded-full bg-accent/60" />
                  {capability}
                </li>
              ))}
            </ul>
          </div>

          <div
            data-enter
            style={{ "--enter-delay": "200ms" } as React.CSSProperties}
            className="hidden lg:block"
          >
            <SystemDiagram />
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * A faint engineering grid behind the hero, masked so it fades out before it
 * reaches the section edges. Two CSS gradients — no image request.
 */
function BackgroundGrid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-[0.55]"
      style={{
        backgroundImage:
          "linear-gradient(to right, var(--color-line) 1px, transparent 1px)," +
          "linear-gradient(to bottom, var(--color-line) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
        maskImage:
          "radial-gradient(ellipse 80% 60% at 50% 35%, black 20%, transparent 75%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 80% 60% at 50% 35%, black 20%, transparent 75%)",
      }}
    />
  );
}

/**
 * Abstract system diagram used as the hero visual.
 *
 * Inline SVG rather than stock imagery: it is a few hundred bytes, scales
 * perfectly, never becomes a layout-shifting image load, and says something
 * about what we build rather than decorating the page.
 */
function SystemDiagram() {
  const layers = [
    { label: "Interface", detail: "Web · Mobile" },
    { label: "Services", detail: "APIs · Auth · Jobs" },
    { label: "Intelligence", detail: "Agents · Retrieval" },
    { label: "Data", detail: "Storage · Integrations" },
  ];

  return (
    <div className="rounded-xl border border-line bg-surface/70 p-6 shadow-card backdrop-blur-sm">
      <ul className="flex flex-col gap-3">
        {layers.map((layer, index) => (
          <li
            key={layer.label}
            data-enter
            style={{ "--enter-delay": `${360 + index * 90}ms` } as React.CSSProperties}
            className="flex items-center justify-between rounded-lg border border-line bg-canvas px-4 py-3.5"
          >
            <span className="text-sm font-medium text-ink">{layer.label}</span>
            <span className="font-mono text-xs text-faint">{layer.detail}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <span className="text-label text-faint uppercase">Built end to end</span>
        <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
      </div>
    </div>
  );
}
