import { ImageResponse } from "next/og";
import {
  BRAND_MARK_PATHS,
  BRAND_MARK_VIEWBOX,
  BRAND_COLORS,
} from "@/components/layout/Logo";
import { site } from "@/config/site";
import { heroHeadline } from "@/data/company";

/**
 * The social sharing card for the whole site.
 *
 * Generated at build time by Next's file convention, so there is no binary
 * asset to keep in the repo and it always matches the current company name and
 * hero headline. Next attaches it to every route automatically; to override it
 * for one page, add an `opengraph-image` file in that route's folder.
 *
 * `ImageResponse` cannot read CSS variables, so the colours below are copies of
 * the tokens in `src/styles/globals.css`. Keep them in step.
 */
export const alt = `${site.name}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const colors = {
  canvas: "#F7F8F4",
  ink: "#13251E",
  muted: "#55655C",
  line: "#DDE3DA",
  accent: "#146B45",
};

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: colors.canvas,
        padding: "80px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <svg width="40" height="44" viewBox={BRAND_MARK_VIEWBOX}>
          {/* Gradients are written out here: ImageResponse does not expand components inside <svg>. */}
          <defs>
            <linearGradient
              id="bowl"
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
              id="stroke"
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
          </defs>
          <path d={BRAND_MARK_PATHS.stem} fill={BRAND_COLORS.navy} />
          <path d={BRAND_MARK_PATHS.leg} fill={BRAND_COLORS.navy} />
          <path d={BRAND_MARK_PATHS.fold} fill={BRAND_COLORS.navy} />
          <path d={BRAND_MARK_PATHS.stroke} fill="url(#stroke)" />
          <path d={BRAND_MARK_PATHS.bowl} fill="url(#bowl)" />
        </svg>
        <div style={{ fontSize: 34, fontWeight: 600, color: colors.ink }}>
          {site.name}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div
          style={{
            fontSize: 76,
            fontWeight: 600,
            color: colors.ink,
            letterSpacing: "-0.035em",
            lineHeight: 1.05,
            maxWidth: "940px",
          }}
        >
          {heroHeadline}
        </div>

        <div style={{ fontSize: 30, color: colors.muted }}>{site.tagline}</div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "32px",
          fontSize: 24,
          color: colors.muted,
          borderTop: `2px solid ${colors.line}`,
          paddingTop: "28px",
        }}
      >
        <span>Web</span>
        <span>Mobile</span>
        <span>AI</span>
        <span>Automation</span>
        <span>Zoho</span>
      </div>
    </div>,
    size,
  );
}
