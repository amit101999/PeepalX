import Link from "next/link";
import { useId } from "react";
import { site } from "@/config/site";
import { cn } from "@/lib/utils/cn";

/**
 * The brand mark and wordmark.
 *
 * The mark is the supplied PeepalX logo (a ribbon "P" crossed by an X stroke),
 * redrawn as inline SVG rather than shipped as the original JPEG: it stays
 * sharp at any size, costs no extra request, and its navy parts can switch to
 * a light colour so the same component sits on both the light header and the
 * dark footer. `public/brand/logo.svg` and `src/app/icon.svg` carry the same
 * shape for structured data and the favicon.
 *
 * The wordmark text comes from `site.name` — change the company name in
 * `src/config/site.ts` and it updates everywhere.
 */
export function Logo({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label={`${site.name}, home`}
      className={cn(
        "group inline-flex items-center gap-2 rounded-sm font-display text-[1.1875rem] font-semibold tracking-[-0.02em]",
        onDark ? "text-on-dark" : "text-ink",
        className,
      )}
    >
      <BrandMark onDark={onDark} className="h-6 w-auto shrink-0" />
      <span translate="no">{site.name}</span>
    </Link>
  );
}

export function BrandMark({
  onDark = false,
  className,
}: {
  onDark?: boolean;
  className?: string;
}) {
  // Gradient ids must be unique per page: the header and footer both render a mark.
  const id = useId();
  const bowlId = `${id}-bowl`;
  const strokeId = `${id}-stroke`;
  // On the dark footer the navy parts would disappear, so they turn light.
  const base = onDark ? "var(--color-on-dark)" : BRAND_COLORS.navy;

  return (
    <svg viewBox={BRAND_MARK_VIEWBOX} aria-hidden="true" className={className}>
      <defs>
        <BrandGradients bowlId={bowlId} strokeId={strokeId} base={base} />
      </defs>
      <path d={BRAND_MARK_PATHS.stem} style={{ fill: base }} />
      <path d={BRAND_MARK_PATHS.leg} style={{ fill: base }} />
      <path d={BRAND_MARK_PATHS.fold} style={{ fill: base }} />
      <path d={BRAND_MARK_PATHS.back} style={{ fill: base }} />
      <path d={BRAND_MARK_PATHS.stroke} fill={`url(#${strokeId})`} />
      <path d={BRAND_MARK_PATHS.bowl} fill={`url(#${bowlId})`} />
    </svg>
  );
}

/** Gradient definitions for the mark. `src/app/opengraph-image.tsx` keeps an inlined copy. */
export function BrandGradients({
  bowlId,
  strokeId,
  base,
}: {
  bowlId: string;
  strokeId: string;
  base: string;
}) {
  return (
    <>
      <linearGradient
        id={bowlId}
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
      <linearGradient
        id={strokeId}
        x1="15"
        y1="166"
        x2="497"
        y2="496"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" style={{ stopColor: base }} />
        <stop offset="0.35" stopColor={BRAND_COLORS.blueDeep} />
        <stop offset="0.7" stopColor={BRAND_COLORS.blue} />
        <stop offset="1" stopColor={BRAND_COLORS.cyan} />
      </linearGradient>
    </>
  );
}

/** Colours sampled from the supplied logo file. */
export const BRAND_COLORS = {
  navy: "#0B1B3E",
  blueDeep: "#0A3FD0",
  blue: "#0A6BFF",
  cyan: "#12EAF4",
} as const;

export const BRAND_MARK_VIEWBOX = "0 0 514 556";

/**
 * Mark shapes, back to front: navy stem, lower leg and bowl fold, the
 * ribbon's reverse side, then the X stroke and the bowl.
 *
 * Measured from the supplied logo file on a uniform grid (1 source pixel = 2
 * units, origin at the mark's top-left), so the proportions match it exactly.
 * The bowl's outer edge is one ellipse (centre 330,189; radii 168 x 181). The
 * blue-to-cyan front of the ribbon ends at a twist on that edge (472,285);
 * past it the ribbon shows its reverse (`back`) down to where it meets the X
 * stroke, with the fold inside. Both are the same navy as the stem and leg
 * (the site owner chose one navy over a separate deep-blue reverse side), and
 * the fold's outer edge runs hidden under the bowl, so no seam shows.
 */
export const BRAND_MARK_PATHS = {
  stem: "M15 166H139V364L15 500Z",
  leg: "M15 548L263 300L341 360L153 548Z",
  fold: "M326 112H440L490 190L472 285L369 365L364 369L287 292C330 262 373 230 373 184C373 150 358 124 326 112Z",
  back: "M472 285A168 181 0 0 1 369 365C370 345 380 318 405 298Q435 287 472 285Z",
  stroke: "M15 166H167L497 496H337L15 174Z",
  bowl: "M15 8H330A168 181 0 0 1 472 285C463 273 459 258 459 240C459 190 408 155 355 124Q340 113 326 112H119Z",
} as const;
