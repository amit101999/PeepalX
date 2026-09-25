import type { CSSProperties } from "react";
import {
  BRAND_COLORS,
  BRAND_MARK_PATHS,
  BRAND_MARK_VIEWBOX,
  BrandGradients,
} from "@/components/layout/Logo";
import { heroBuildPhrases } from "@/data/company";
import { HERO_MARK_ID } from "./hero-mark-id";

type PieceName = keyof typeof BRAND_MARK_PATHS;

/**
 * The order the mark assembles in, back to front, and where each piece
 * arrives from. Offsets are in viewBox units (the mark is 520 x 580), chosen
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
 * Construction lines, in the mark's own coordinates, as on a technical
 * drawing: the X stroke's centre line carried past both ends, the baseline
 * and the stem's edge. They draw in first, then the pieces land on them.
 */
const GUIDES = [
  "M-120 -36L585 667", // the X stroke's centre line, at the mark's 45°
  "M-60 570H590", // baseline, under the leg and the stroke
  "M15 -50V630", // the stem's outer edge
];

/* Registration marks at the corners of the mark's bounding box. */
const CORNERS = [
  [15, 8],
  [498, 8],
  [15, 570],
  [498, 570],
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
/** Average advance of one character of the display face, as a share of its size. */
const CHAR_WIDTH = 0.56;

const RIBBONS = [
  {
    name: "stroke",
    text: RIBBON_TEXT,
    fontSize: 40,
    // The X stroke's centre line, from its top edge to its bottom edge.
    path: "M81 165L417 500",
    // White on the navy and blue end of the stroke, navy where it turns cyan.
    fill: { x1: 15, y1: 165, x2: 480, y2: 500, switchAt: 0.74 },
  },
  {
    name: "bowl",
    text: BOWL_TEXT,
    fontSize: 30,
    // The bowl's centre line: along the top, round the curve, into the fold.
    path: "M70 58H356C440 58 475 120 475 188C475 270 425 330 346 351",
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
 * on a drafting sheet: hairline construction lines and registration marks
 * trace the geometry the site's chamfers and slants are taken from.
 *
 * In order:
 *  1. the guides draw (`data-draw`);
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
      className="relative mx-auto aspect-[520/580] w-full max-w-[280px] sm:max-w-[360px] lg:mr-0 lg:max-w-[460px]"
    >
      <svg
        id={HERO_MARK_ID}
        viewBox={BRAND_MARK_VIEWBOX}
        className="relative size-full overflow-visible"
      >
        <g fill="none" strokeWidth={1} className="stroke-line-strong">
          {GUIDES.map((d, index) => (
            <path
              key={d}
              d={d}
              pathLength={1}
              vectorEffect="non-scaling-stroke"
              data-draw
              style={{ "--i": index } as CSSProperties}
            />
          ))}
          {CORNERS.map(([x, y], index) => (
            <path
              key={`${x}-${y}`}
              d={`M${x - 12} ${y}H${x + 12}M${x} ${y - 12}V${y + 12}`}
              pathLength={1}
              vectorEffect="non-scaling-stroke"
              data-draw
              className="stroke-control"
              style={{ "--i": GUIDES.length + index } as CSSProperties}
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
                <path d={BRAND_MARK_PATHS[name]} />
              </clipPath>
              <linearGradient
                id={`hero-ribbon-fill-${name}`}
                x1={fill.x1}
                y1={fill.y1}
                x2={fill.x2}
                y2={fill.y2}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset={fill.switchAt - 0.04} stopColor="#ffffff" />
                <stop offset={fill.switchAt + 0.04} stopColor={BRAND_COLORS.navy} />
              </linearGradient>
            </g>
          ))}
        </defs>

        {PIECES.map(({ name, from }, index) => (
          <path
            key={name}
            d={BRAND_MARK_PATHS[name]}
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

        <g data-logo-text className="font-display font-semibold">
          {RIBBONS.map(({ name, text, fontSize }) => {
            const copyLength = Math.round(text.length * fontSize * CHAR_WIDTH);

            return (
              <text
                key={name}
                clipPath={`url(#hero-ribbon-clip-${name})`}
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
            );
          })}
        </g>
      </svg>
    </div>
  );
}
