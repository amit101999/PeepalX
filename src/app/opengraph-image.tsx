import { ImageResponse } from "next/og";
import { site } from "@/config/site";

/**
 * The social sharing card for the whole site.
 *
 * Generated at build time by Next's file convention, so there is no binary
 * asset to keep in the repo and it always matches the current company name.
 * Next attaches it to every route automatically; to override it for one page,
 * add an `opengraph-image` file in that route's folder.
 */
export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#FBFAF9",
        padding: "80px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div
          style={{
            width: "16px",
            height: "16px",
            borderRadius: "999px",
            backgroundColor: "#B4552B",
          }}
        />
        <div style={{ fontSize: 30, fontWeight: 600, color: "#17161A" }}>{site.name}</div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <div
          style={{
            fontSize: 68,
            fontWeight: 600,
            color: "#17161A",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            maxWidth: "900px",
          }}
        >
          We build software that moves businesses forward.
        </div>

        <div style={{ fontSize: 28, color: "#6B6A70" }}>{site.tagline}</div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "28px",
          fontSize: 22,
          color: "#93919A",
          borderTop: "1px solid #E6E2DF",
          paddingTop: "28px",
        }}
      >
        <span>Web</span>
        <span>Mobile</span>
        <span>AI</span>
        <span>Automation</span>
        <span>Integrations</span>
      </div>
    </div>,
    size,
  );
}
