import type { CSSProperties } from "react";
import { BRAND_COLORS, BRAND_MARK_PATHS, BrandGradients } from "@/components/layout/Logo";
import { heroBuildPhrases } from "@/data/company";
import { HERO_MARK_ID } from "./hero-mark-id";

type PieceName = keyof typeof BRAND_MARK_PATHS;

/*
 * The hero draws the X stroke longer than the brand mark does: it runs on
 * down to the baseline, so it ends level with the navy leg on the left. The
 * header logo keeps the original shape.
 */
const MARK_PATHS: Record<PieceName, string> = {
  ...BRAND_MARK_PATHS,
  stroke: "M15 165H148L552 570H422Z",
};

/* Wide enough for the longer stroke, with the same 15-unit margin each side. */
const MARK_VIEWBOX = "0 0 567 580";

/**
 * The order the mark assembles in, back to front, and where each piece
 * arrives from. Offsets are in viewBox units (the mark is 567 x 580), chosen
 * so every piece travels along its own direction in the drawing: the stem
 * from the left, the leg from below, the bowl from above, the X stroke along
 * its diagonal.
 */
const PIECES: { name: PieceName; from: { x: number; y: number; rotate: number } }[] = [
  { name: "stem", from: { x: -70, y: 0, rotate: -6 } },
  { name: "leg", from: { x: -40, y: 70, rotate: 6 } },
  { name: "fold", from: { x: 60, y: 20, rotate: 6 } },
  { name: "stroke", from: { x: 80, y: 80, rotate: -6 } },
  { name: "bowl", from: { x: 40, y: -70, rotate: 6 } },
];

// The hero renders once per page, so fixed gradient ids cannot collide.
const STROKE_GRADIENT = "hero-mark-stroke";
const BOWL_GRADIENT = "hero-mark-bowl";

/*
 * Registration marks at the corners of the mark's bounding box, as on a
 * technical drawing. They draw in first, then the pieces land inside them.
 */
const CORNERS = [
  [15, 8],
  [552, 8],
  [15, 570],
  [552, 570],
] as const;

/*
 * Words inside the mark: what we build, running along the X stroke and
 * around the bowl of the P like print on a ribbon. Each line runs along the
 * piece's centre line and is clipped to the piece's shape.
 *
 * The text is written out twice and `textLength` pins each copy to a known
 * length, so sliding `startOffset` by exactly one copy loops seamlessly.
 */
const RIBBON_TEXT = heroBuildPhrases.join(" / ") + " / ";
/* The bowl starts three phrases in, so the two ribbons never read in step. */
const BOWL_TEXT =
  [...heroBuildPhrases.slice(3), ...heroBuildPhrases.slice(0, 3)].join(" / ") + " / ";

/** Scroll speed, in viewBox units per second. Slow enough to read. */
const RIBBON_SPEED = 45;
/**
 * Average advance of one character of the display face (Schibsted Grotesk,
 * semibold), as a share of its size. Retune it if `font-display` changes: a
 * wider face at this value would squeeze letters together.
 */
const CHAR_WIDTH = 0.56;

const RIBBONS = [
  {
    name: "stroke",
    text: RIBBON_TEXT,
    fontSize: 40,
    // The X stroke's centre line, from its top edge down to the baseline.
    path: "M81 165L487 570",
    // White on the navy and blue end of the stroke, navy where it turns cyan.
    fill: { x1: 15, y1: 165, x2: 480, y2: 500, switchAt: 0.74 },
  },
  {
    name: "bowl",
    text: BOWL_TEXT,
    fontSize: 30,
    // The bowl's centre line: along the top and round the curve. It stops
    // before the curve turns back left, where letters would turn upside down.
    path: "M70 58H356C440 58 475 120 475 188C475 240 455 285 415 318",
    fill: { x1: 15, y1: 0, x2: 500, y2: 0, switchAt: 0.5 },
  },
] as const;

const FILLS: Record<PieceName, string> = {
  stem: BRAND_COLORS.navy,
  leg: BRAND_COLORS.navy,
  fold: BRAND_COLORS.navy,
  stroke: `url(#${STROKE_GRADIENT})`,
  bowl: `url(#${BOWL_GRADIENT})`,
};

/**
 * The hero's logo, assembling itself once on load.
 *
 * It is the PeepalX mark in its original brand colours (navy, blue, cyan,
 * from `BRAND_COLORS`), the same as the header logo, only larger, drawn as if
 * on a drafting sheet framed by hairline registration marks. Its X stroke runs
 * down to the baseline, level with the navy leg (see `MARK_PATHS`).
 *
 * In order:
 *  1. the registration marks draw (`data-draw`);
 *  2. each piece springs in from its own direction, 90ms apart, on a damped
 *     spring baked into a CSS `linear()` easing (`--ease-spring`);
 *  3. the words inside the mark blur in (`data-logo-text`, the animate-text
 *     "soft blur" timing) and start to scroll along the ribbons.
 *
 * Steps 1 to 3's entrances are CSS, so they play from the first paint with no
 * script and are removed by the reduced-motion rules. The scroll is SVG's own
 * animation (SMIL on `startOffset`), which CSS cannot pause, so it never
 * starts by itself: `TypedServices` starts and pauses it together with the
 * typed line, giving the hero a single pause button. Under reduced motion or
 * without JavaScript the words simply sit still. The frame has a fixed aspect
 * ratio, so nothing shifts.
 */
export function HeroMark() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto aspect-[567/580] w-full max-w-[280px] sm:max-w-[360px] lg:mr-0 lg:max-w-[460px]"
    >
      <svg
        id={HERO_MARK_ID}
        viewBox={MARK_VIEWBOX}
        className="relative size-full overflow-visible"
      >
        <g fill="none" strokeWidth={1} className="stroke-line-strong">
          {CORNERS.map(([x, y], index) => (
            <path
              key={`${x}-${y}`}
              d={`M${x - 12} ${y}H${x + 12}M${x} ${y - 12}V${y + 12}`}
              pathLength={1}
              vectorEffect="non-scaling-stroke"
              data-draw
              className="stroke-control"
              style={{ "--i": index } as CSSProperties}
            />
          ))}
        </g>

        <defs>
          <BrandGradients
            bowlId={BOWL_GRADIENT}
            strokeId={STROKE_GRADIENT}
            base={BRAND_COLORS.navy}
          />
          {RIBBONS.map(({ name, path, fill }) => (
            <g key={name}>
              <path id={`hero-ribbon-${name}`} d={path} />
              <clipPath id={`hero-ribbon-clip-${name}`}>
                <path d={MARK_PATHS[name]} />
              </clipPath>
              <linearGradient
                id={`hero-ribbon-fill-${name}`}
                x1={fill.x1}
                y1={fill.y1}
                x2={fill.x2}
                y2={fill.y2}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset={fill.switchAt - 0.015} stopColor="#ffffff" />
                <stop offset={fill.switchAt + 0.015} stopColor={BRAND_COLORS.navy} />
              </linearGradient>
            </g>
          ))}
        </defs>

        {PIECES.map(({ name, from }, index) => (
          <path
            key={name}
            d={MARK_PATHS[name]}
            fill={FILLS[name]}
            data-piece
            style={
              {
                "--i": index,
                "--from-x": `${from.x}px`,
                "--from-y": `${from.y}px`,
                "--from-r": `${from.rotate}deg`,
              } as CSSProperties
            }
          />
        ))}

        {/* The clip sits on a still outer group, so the entrance's rise and blur
            (on the inner group) are cut to the piece and never spill past it. */}
        {RIBBONS.map(({ name, text, fontSize }) => {
          const copyLength = Math.round(text.length * fontSize * CHAR_WIDTH);

          return (
            <g key={name} clipPath={`url(#hero-ribbon-clip-${name})`}>
              <g data-logo-text className="font-display font-semibold">
                <text
                  fill={`url(#hero-ribbon-fill-${name})`}
                  fontSize={fontSize}
                  dominantBaseline="central"
                >
                  <textPath
                    href={`#hero-ribbon-${name}`}
                    startOffset={0}
                    textLength={copyLength * 2}
                    lengthAdjust="spacing"
                  >
                    {text + text}
                    <animate
                      data-marquee
                      attributeName="startOffset"
                      from={-copyLength}
                      to={0}
                      dur={`${copyLength / RIBBON_SPEED}s`}
                      begin="indefinite"
                      repeatCount="indefinite"
                    />
                  </textPath>
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
