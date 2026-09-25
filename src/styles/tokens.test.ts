import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Colour contrast guard for the design tokens.
 *
 * Reads the hex values straight out of `globals.css`, so the test always checks
 * the palette the site actually ships. Each pairing below is one the components
 * really use; if a token change breaks WCAG AA for any of them, this fails.
 */

const css = readFileSync(join(process.cwd(), "src/styles/globals.css"), "utf8");

const tokens = Object.fromEntries(
  [...css.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-f]{6})/gi)].map(([, name, hex]) => [
    name,
    hex,
  ]),
) as Record<string, string>;

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((start) => {
    const value = parseInt(hex.slice(start, start + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0]! + 0.7152 * channels[1]! + 0.0722 * channels[2]!;
}

function contrast(foreground: string, background: string): number {
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/** A foreground colour at `alpha` laid over a background, as the browser paints it. */
function mix(foreground: string, background: string, alpha: number): string {
  const channel = (hex: string, start: number) =>
    parseInt(hex.slice(start, start + 2), 16);
  const channels = [1, 3, 5].map((start) =>
    Math.round(
      channel(foreground, start) * alpha + channel(background, start) * (1 - alpha),
    )
      .toString(16)
      .padStart(2, "0"),
  );
  return "#" + channels.join("");
}

/** [foreground token, background tokens] */
const bodyText: [string, string[]][] = [
  ["ink", ["canvas", "surface", "elevated", "accent-soft"]],
  ["ink-soft", ["canvas", "surface", "elevated", "accent-soft"]],
  ["muted", ["canvas", "surface", "elevated", "accent-soft"]],
  ["faint", ["canvas", "surface", "elevated"]],
  ["accent", ["canvas", "surface", "elevated", "accent-soft"]],
  ["signal", ["canvas", "surface", "elevated"]],
  ["danger", ["canvas", "surface", "elevated"]],
  ["canvas", ["accent", "accent-hover", "ink", "signal"]],
  ["accent-soft", ["accent"]],
  ["on-dark", ["ink"]],
  ["on-dark-muted", ["ink"]],
  ["on-dark-accent", ["ink"]],
  ["ink", ["on-dark", "on-dark-accent"]],
  ["ink", ["tint", "green-200"]],
  ["ink-soft", ["green-200"]],
  ["ink-soft", ["tint"]],
  ["muted", ["tint"]],
  ["faint", ["tint"]],
  ["accent", ["tint"]],
  ["signal", ["tint"]],
  ["danger", ["tint"]],
  ["on-dark", ["forest"]],
  ["on-dark-muted", ["forest"]],
  ["on-dark-accent", ["forest"]],
];

/** Borders of controls and focus rings need 3:1 against what surrounds them. */
const nonText: [string, string[]][] = [
  ["control", ["canvas", "surface"]],
  ["accent", ["canvas", "surface", "elevated"]],
  ["on-dark-accent", ["ink", "forest"]],
  ["control", ["tint"]],
  ["accent", ["tint"]],
  // WhyUs icon on the green-200 tile.
  ["accent", ["green-200"]],
];

/**
 * The Open Graph card cannot read CSS variables, so it copies a few token
 * values as literals. This keeps the two in step.
 */
const ogColors = Object.fromEntries(
  [
    ...readFileSync(join(process.cwd(), "src/app/opengraph-image.tsx"), "utf8").matchAll(
      /(\w+):\s*"(#[0-9a-fA-F]{6})"/g,
    ),
  ].map((match) => [match[1]!, match[2]!.toLowerCase()]),
) as Record<string, string>;

describe("design tokens", () => {
  it("parses every colour it checks", () => {
    const used = [...bodyText, ...nonText].flatMap(([fg, bgs]) => [fg, ...bgs]);
    for (const name of new Set(used)) {
      expect(tokens[name], `--color-${name} is missing from globals.css`).toBeDefined();
    }
  });

  it("meets WCAG AA (4.5:1) for every text pairing", () => {
    for (const [fg, backgrounds] of bodyText) {
      for (const bg of backgrounds) {
        const ratio = contrast(tokens[fg]!, tokens[bg]!);
        expect(ratio, `${fg} on ${bg} is ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(
          4.5,
        );
      }
    }
  });

  it("keeps the Open Graph card's copied colours in step with the tokens", () => {
    for (const [name, token] of [
      ["canvas", "canvas"],
      ["ink", "ink"],
      ["muted", "muted"],
      ["line", "line"],
      ["accent", "accent"],
    ] as const) {
      expect(ogColors[name], `opengraph-image is missing ${name}`).toBe(tokens[token]);
    }
  });

  it("keeps tint and forest equal to their green scale stops", () => {
    expect(tokens["tint"]).toBe(tokens["green-50"]);
    expect(tokens["forest"]).toBe(tokens["green-900"]);
    expect(tokens["accent"]).toBe(tokens["green-600"]);
    expect(tokens["accent-hover"]).toBe(tokens["green-700"]);
    expect(tokens["accent-soft"]).toBe(tokens["green-100"]);
  });

  it("keeps closing-block text at AA over the brightest point of the mesh", () => {
    // CtaSection's mesh: green-700 at 80% opacity over forest, at its peak.
    const peak = mix(tokens["green-700"]!, tokens["forest"]!, 0.8);
    for (const text of ["on-dark", "on-dark-muted", "on-dark-accent"]) {
      const ratio = contrast(tokens[text]!, peak);
      expect(
        ratio,
        `${text} on the mesh peak is ${ratio.toFixed(2)}:1`,
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("keeps WhyUs tile text at AA under the spotlight's brightest point", () => {
    // SpotlightTile: white at 7% on the dark tiles, accent at 7% on the pale ones.
    const tiles: [string, string, string[]][] = [
      ["accent", "#ffffff", ["canvas", "accent-soft"]],
      ["green-100", tokens["accent"]!, ["ink", "muted"]],
      ["green-200", tokens["accent"]!, ["ink", "ink-soft"]],
      ["forest", "#ffffff", ["on-dark", "on-dark-muted"]],
    ];
    for (const [tile, light, texts] of tiles) {
      const lit = mix(light, tokens[tile]!, 0.07);
      for (const text of texts) {
        const ratio = contrast(tokens[text]!, lit);
        expect(
          ratio,
          `${text} on lit ${tile} is ${ratio.toFixed(2)}:1`,
        ).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it("keeps faint off accent-soft, where it would fail AA", () => {
    // The token comment says so; this makes it fail the suite rather than review.
    expect(contrast(tokens["faint"]!, tokens["accent-soft"]!)).toBeLessThan(4.5);
  });

  it("meets 3:1 for control borders and focus rings", () => {
    for (const [fg, backgrounds] of nonText) {
      for (const bg of backgrounds) {
        const ratio = contrast(tokens[fg]!, tokens[bg]!);
        expect(ratio, `${fg} on ${bg} is ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(
          3,
        );
      }
    }
  });
});
