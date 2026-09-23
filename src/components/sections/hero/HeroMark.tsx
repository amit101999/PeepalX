import type { CSSProperties } from "react";
import {
  BRAND_COLORS,
  BRAND_MARK_PATHS,
  BRAND_MARK_VIEWBOX,
  BrandGradients,
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
 * It is the PeepalX mark in its brand colours (navy, blue and cyan), the
 * same as the small logo in the header, and it reuses that logo's gradients
 * so the two never drift apart.
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
      {/* A soft pale-blue field behind the mark, tinted from the brand blue. */}
      <div
        className="absolute inset-[-12%] rounded-full"
        style={{
          background: `radial-gradient(closest-side, color-mix(in oklab, ${BRAND_COLORS.blue} 14%, transparent), transparent)`,
        }}
      />

      <svg viewBox={BRAND_MARK_VIEWBOX} className="relative size-full overflow-visible">
        <defs>
          <BrandGradients
            bowlId={BOWL_GRADIENT}
            strokeId={STROKE_GRADIENT}
            base={BRAND_COLORS.navy}
          />
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
