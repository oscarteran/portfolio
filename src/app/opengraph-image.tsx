import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Mirrors the hero: dark ground, dot grid, gold eyebrow, the name as the focal point.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 88px",
          backgroundColor: "#15171c",
          backgroundImage: "radial-gradient(circle, rgba(238,240,242,0.10) 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px",
          color: "#eef0f2",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 26, letterSpacing: 6, color: "#e0bb4f" }}>
          <div style={{ width: 48, height: 2, backgroundColor: "#e0bb4f" }} />
          {site.role.toUpperCase()}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 28,
            fontSize: 104,
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: -2,
          }}
        >
          {site.name.toUpperCase()}
        </div>
        <div style={{ marginTop: 40, maxWidth: 900, fontSize: 30, lineHeight: 1.4, color: "#9ba0aa" }}>
          {site.tagline}
        </div>
      </div>
    ),
    size
  );
}
