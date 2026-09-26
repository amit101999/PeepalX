import { StoryScroll } from "@/components/about/StoryScroll";
import { SpotlightTile } from "@/components/sections/SpotlightTile";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { company } from "@/data/company";
import { companyValues } from "@/data/values";
import { cn } from "@/lib/utils/cn";

/**
 * How each value tile is drawn, by position. The six commitments sit in an
 * uneven grid (wide + narrow, narrow + wide, then two halves) so the section
 * reads as a composed set rather than six identical cards, and the tones vary
 * so the grid has depth without images. Every text colour here is checked
 * against its lit tile in `tokens.test.ts`.
 *
 * Below `md` the tiles stack; from `md` to `lg` the first and last span both
 * columns so no row is left half empty.
 */
const TILES = [
  {
    span: "md:col-span-2 lg:col-span-4",
    tone: "bg-green-200",
    title: "text-ink",
    text: "text-ink-soft",
    glow: "dark",
    large: true,
    decor: "grid",
  },
  {
    span: "lg:col-span-2",
    tone: "bg-surface",
    title: "text-ink",
    text: "text-muted",
    glow: "dark",
  },
  {
    span: "lg:col-span-2",
    tone: "bg-surface",
    title: "text-ink",
    text: "text-muted",
    glow: "dark",
  },
  {
    span: "lg:col-span-4",
    tone: "bg-accent-soft",
    title: "text-ink",
    text: "text-muted",
    glow: "dark",
    large: true,
    decor: "hatch",
  },
  {
    span: "lg:col-span-3",
    tone: "bg-surface",
    title: "text-ink",
    text: "text-muted",
    glow: "dark",
  },
  {
    span: "md:col-span-2 lg:col-span-3",
    tone: "bg-accent",
    title: "text-canvas",
    text: "text-accent-soft",
    glow: "light",
    decor: "stroke",
  },
] as const satisfies {
  span: string;
  tone: string;
  title: string;
  text: string;
  glow: "light" | "dark";
  large?: boolean;
  decor?: "grid" | "hatch" | "stroke";
}[];

/** Decorative fills, all drawn from the logo's grid and 45° cut. */
const DECOR = {
  // The hero's drafting grid, fading out towards the text.
  grid: "blueprint [mask-image:radial-gradient(ellipse_70%_80%_at_100%_0%,#000_20%,transparent_70%)]",
  // Fine 45° hatching in one corner, like a section cut on a drawing.
  hatch:
    "bg-[repeating-linear-gradient(135deg,var(--color-line-strong)_0_1px,transparent_1px_10px)] [mask-image:linear-gradient(225deg,#000_10%,transparent_45%)]",
  // A single wide band at the X stroke's angle.
  stroke:
    "bg-[linear-gradient(135deg,transparent_58%,rgb(255_255_255/0.08)_58%,rgb(255_255_255/0.08)_74%,transparent_74%)]",
} as const;

/**
 * The About page body: the company story, then how we work.
 *
 * The story copy lives in `src/data/company.ts`. It avoids the standard agency
 * vocabulary (no "passionate about innovation", no "cutting-edge") and says
 * nothing that cannot be substantiated.
 */
export function About() {
  const [opening, ...rest] = company.story;

  return (
    <>
      <Section id="about">
        <StoryScroll
          heading={<h2 className="text-h2 font-semibold text-ink">Our story</h2>}
          opening={opening}
          paragraphs={rest}
        />
      </Section>

      <Section id="values" bordered>
        <SectionHeading
          title="How we work"
          description="Six commitments, each one something you can hold us to."
        />

        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {companyValues.map((value, index) => {
            const tile = TILES[index % TILES.length]!;
            const large = "large" in tile && tile.large;
            const decor = "decor" in tile ? tile.decor : undefined;

            return (
              <SpotlightTile
                key={value.title}
                glow={tile.glow}
                className={cn(
                  "p-7 chamfer cut-lg sm:p-9",
                  large ? "min-h-64 lg:min-h-80" : "min-h-56",
                  tile.span,
                  tile.tone,
                )}
              >
                {decor ? (
                  <span
                    aria-hidden="true"
                    className={cn("pointer-events-none absolute -inset-9", DECOR[decor])}
                  />
                ) : null}
                <div className="relative mt-auto">
                  <h3
                    className={cn(
                      "font-semibold text-balance",
                      large ? "text-h2 lg:max-w-[16ch]" : "text-h3",
                      tile.title,
                    )}
                  >
                    {value.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-3 max-w-[48ch] leading-relaxed",
                      large && "text-lead",
                      tile.text,
                    )}
                  >
                    {value.description}
                  </p>
                </div>
              </SpotlightTile>
            );
          })}
        </ul>
      </Section>
    </>
  );
}
