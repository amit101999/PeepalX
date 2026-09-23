import type { CSSProperties } from "react";
import { BRAND_MARK_PATHS, BRAND_MARK_VIEWBOX } from "@/components/layout/Logo";

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

const FILLS: Record<PieceName, string> = {
  stem: "var(--color-green-800)",
  leg: "var(--color-green-700)",
  fold: "var(--color-green-900)",
  stroke: `url(#${STROKE_GRADIENT})`,
  bowl: `url(#${BOWL_GRADIENT})`,
};

/**
 * The hero's logo, assembling itself once on load.
 *
 * It is the PeepalX mark drawn in shades of the site's green scale rather
 * than the original blue: the small logo in the header and footer keeps the
 * brand colours; this larger one is a graphic that ties the mark to the
 * palette.
 *
 * Each piece springs in from its own direction, 90ms apart. The spring is a
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
      className="relative mx-auto aspect-[520/580] w-full max-w-[260px] sm:max-w-[320px] lg:max-w-[420px]"
    >
      {/* A soft pale-green field behind the mark, so it sits in the palette. */}
      <div className="absolute inset-[-12%] rounded-full bg-[radial-gradient(closest-side,var(--color-green-100),transparent)]" />

      <svg viewBox={BRAND_MARK_VIEWBOX} className="relative size-full overflow-visible">
        <defs>
          <linearGradient
            id={STROKE_GRADIENT}
            x1="15"
            y1="165"
            x2="480"
            y2="500"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" style={{ stopColor: "var(--color-green-800)" }} />
            <stop offset="0.45" style={{ stopColor: "var(--color-green-500)" }} />
            <stop offset="1" style={{ stopColor: "var(--color-green-300)" }} />
          </linearGradient>
          <linearGradient
            id={BOWL_GRADIENT}
            x1="15"
            y1="0"
            x2="500"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" style={{ stopColor: "var(--color-green-600)" }} />
            <stop offset="1" style={{ stopColor: "var(--color-green-400)" }} />
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
