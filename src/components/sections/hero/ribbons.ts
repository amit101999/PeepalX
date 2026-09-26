import { heroMarkWords } from "@/data/company";

/*
 * The words inside the hero mark (`heroMarkWords`): tech, AI, automation and
 * business terms running along the X stroke and around the bowl of the P,
 * like print on a ribbon. Each line runs along a path through the piece and
 * is clipped to the piece's shape.
 *
 * The text is written out twice and `textLength` pins each copy to a known
 * length, so sliding `startOffset` by exactly one copy loops seamlessly. That
 * holds only while one copy is at least as long as its path; the content test
 * checks it, so shortening a word list cannot open a gap.
 */

export const ribbonText = (words: readonly string[]) => words.join(" / ") + " / ";

/** Scroll speed, in viewBox units per second. Slow enough to read. */
export const RIBBON_SPEED = 45;

/**
 * Average advance of one character of the display face (Schibsted Grotesk,
 * semibold), as a share of its size. Retune it if `font-display` changes: a
 * wider face at this value would squeeze letters together.
 */
export const CHAR_WIDTH = 0.56;

export const RIBBONS = [
  {
    name: "stroke",
    text: ribbonText(heroMarkWords.stroke),
    fontSize: 32,
    // The X stroke's centre line at 45°, carried past both of the stroke's
    // edges so letters slide under the clip instead of blinking in and out
    // where the path would otherwise end.
    path: "M55 134L501 580",
    // Straight line, so its length is exact. Not named `pathLength`: that is
    // a real SVG attribute and would change startOffset's units if spread on.
    measuredLength: Math.round(Math.hypot(501 - 55, 580 - 134)),
    // White on the navy and blue end of the stroke, navy where it turns cyan.
    fill: { x1: 15, y1: 166, x2: 497, y2: 496, switchAt: 0.74 },
  },
  {
    name: "bowl",
    text: ribbonText(heroMarkWords.bowl),
    fontSize: 24,
    // The bowl's centre line: along the top and round the curve, an ellipse
    // concentric with the bowl's outer edge. It stops above the twist, where
    // the ribbon narrows to a point and turns to its reverse side.
    path: "M70 60H330A136 129 0 0 1 462 220",
    // 260 straight plus a 239.5 arc (499.5), checked with getTotalLength().
    // Re-measure if `path` changes.
    measuredLength: 500,
    fill: { x1: 15, y1: 0, x2: 500, y2: 0, switchAt: 0.5 },
  },
] as const;

/** The length one copy of a ribbon's text is pinned to, in viewBox units. */
export function ribbonCopyLength(ribbon: (typeof RIBBONS)[number]): number {
  return Math.round(ribbon.text.length * ribbon.fontSize * CHAR_WIDTH);
}
