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
      <path d={BRAND_MARK_PATHS.stroke} fill={`url(#${strokeId})`} />
      <path d={BRAND_MARK_PATHS.bowl} fill={`url(#${bowlId})`} />
    </svg>
  );
}

/** Gradient definitions for the mark. `src/app/opengraph-image.tsx` keeps an inlined copy. */
function BrandGradients({
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
        y1="165"
        x2="480"
        y2="500"
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

export const BRAND_MARK_VIEWBOX = "0 0 520 580";

/** Mark shapes, back to front: navy stem, lower leg and bowl fold, then the X stroke and the bowl. */
export const BRAND_MARK_PATHS = {
  stem: "M15 165H142V315L148 352L15 485Z",
  leg: "M15 570L270 315L330 375L135 570Z",
  fold: "M310 108H370C418 108 452 140 452 195C452 265 400 320 330 336L288 294C342 280 370 242 370 202C370 160 350 128 310 108Z",
  stroke: "M15 165H148L482 500H352Z",
  bowl: "M15 8H342C435 8 498 80 498 180C498 280 440 352 362 366L330 336C400 320 452 265 452 195C452 140 418 108 370 108H120Z",
} as const;
