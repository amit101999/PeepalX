import { BookOpen, FileText, Layers, MessagesSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils/cn";
import { StackList } from "./home/StackList";
import { SpotlightTile } from "./SpotlightTile";

/**
 * "Why teams work with us".
 *
 * Every point here is a claim about how we work, not a metric. No satisfaction
 * percentages, delivery statistics or client counts appear anywhere on this
 * site, because there is no data behind them yet.
 */
const reasons: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "You talk to the founders",
    description:
      "No account layer in between. The people who scope your project are the people you speak to throughout.",
    icon: MessagesSquare,
  },
  {
    title: "One team, not three vendors",
    description:
      "Most projects need an application, some integrations and some AI. Keeping them together avoids the gaps in between.",
    icon: Layers,
  },
  {
    title: "Trade-offs in writing",
    description:
      "Constraints, risks and the parts we are unsure about, written down before work starts.",
    icon: FileText,
  },
  {
    title: "Built to be handed over",
    description:
      "Readable code and documented decisions, so you are never locked in by confusion.",
    icon: BookOpen,
  },
];

/**
 * Tile treatments, in order: four stops of the green scale, from the brand
 * green through two pale tints to forest. Each pairs its text colours with its
 * background (all contrast-tested in tokens.test.ts), and `glow` picks the
 * spotlight that reads on it.
 */
const tileStyles = [
  {
    tile: "bg-accent",
    title: "text-canvas",
    body: "text-accent-soft",
    icon: "text-accent-soft",
    glow: "light",
  },
  {
    tile: "bg-green-100",
    title: "text-ink",
    body: "text-muted",
    icon: "text-accent",
    glow: "dark",
  },
  {
    tile: "bg-green-200",
    title: "text-ink",
    body: "text-ink-soft",
    icon: "text-accent",
    glow: "dark",
  },
  {
    tile: "bg-forest",
    title: "text-on-dark",
    body: "text-on-dark-muted",
    icon: "text-on-dark-accent",
    glow: "light",
  },
] as const;

export function WhyUs() {
  const cards = reasons.map((reason, index) => {
    const style = tileStyles[index % tileStyles.length]!;
    const Icon = reason.icon;

    return (
      <SpotlightTile
        key={reason.title}
        as="div"
        reveal={false}
        glow={style.glow}
        className={cn("min-h-72 p-7 chamfer cut-lg sm:min-h-80 sm:p-10", style.tile)}
      >
        {/* A large, cropped copy of the icon: the card's one visual, so four
            same-shaped cards still read as different at a glance. */}
        <Icon
          aria-hidden="true"
          strokeWidth={1}
          className={cn(
            "pointer-events-none absolute -right-8 -bottom-10 size-56 opacity-15 sm:size-64",
            style.icon,
          )}
        />
        <Icon
          aria-hidden="true"
          strokeWidth={1.75}
          className={cn("size-7", style.icon)}
        />
        <h3 className={cn("mt-auto max-w-md pt-16 text-h2 font-semibold", style.title)}>
          {reason.title}
        </h3>
        <p className={cn("mt-4 max-w-md text-lead", style.body)}>{reason.description}</p>
      </SpotlightTile>
    );
  });

  return (
    <Section spacing="loose">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            title="Why teams work with us"
            description="A small team that scopes, builds and supports the work itself."
          />
        </div>

        <StackList items={cards} />
      </div>
    </Section>
  );
}
