import type { CSSProperties } from "react";
import {
  BRAND_COLORS,
  BRAND_MARK_PATHS,
  BRAND_MARK_VIEWBOX,
} from "@/components/layout/Logo";

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
 * The guides draw first (`data-draw`); then each piece springs in from its own direction, 90ms apart. The spring is a
 * real damped-oscillator curve baked into a CSS `linear()` easing
 * (`--ease-spring` in globals.css), so this is a Server Component with no
 * JavaScript at all: it plays from the first paint, never flashes while a
 * script loads, and is removed by the reduced-motion rules like every other
 * entrance. The frame has a fixed aspect ratio, so nothing shifts.
 */
export function HeroMark() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto aspect-[520/580] w-full max-w-[280px] sm:max-w-[360px] lg:mr-0 lg:max-w-[460px]"
    >
      <svg viewBox={BRAND_MARK_VIEWBOX} className="relative size-full overflow-visible">
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
          <linearGradient
            id={STROKE_GRADIENT}
            x1="15"
            y1="165"
            x2="480"
            y2="500"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor={BRAND_COLORS.navy} />
            <stop offset="0.35" stopColor={BRAND_COLORS.blueDeep} />
            <stop offset="0.7" stopColor={BRAND_COLORS.blue} />
            <stop offset="1" stopColor={BRAND_COLORS.cyan} />
          </linearGradient>
          <linearGradient
            id={BOWL_GRADIENT}
            x1="15"
            y1="0"
            x2="500"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor={BRAND_COLORS.blueDeep} />
            <stop offset="0.45" stopColor={BRAND_COLORS.blue} />
            <stop offset="1" stopColor={BRAND_COLORS.cyan} />
          </linearGradient>
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
      </svg>
    </div>
  );
}
