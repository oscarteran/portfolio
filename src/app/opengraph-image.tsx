import { ImageResponse } from "next/og";
import { getSite } from "@/data/site";
import { buildTrace, TRACE_HEIGHT, TRACE_WIDTH } from "@/lib/seismogram";

const site = getSite("es");

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Mirrors the page: light paper, steel kicker, the name, and the career seismogram below.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 88px 56px",
          backgroundColor: "#f2f2f3",
          color: "#1d1f20",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, fontWeight: 600, color: "#416180" }}>
            {`${site.role.toUpperCase()} · GOOGLE CLOUD · AGENTIC AI`}
          </div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 96, fontWeight: 700, lineHeight: 1, letterSpacing: -2 }}>
            {site.name.toUpperCase()}
          </div>
        </div>
        <div style={{ display: "flex", borderTop: "2px solid #c9c9cb", borderBottom: "2px solid #c9c9cb" }}>
          <svg width="1024" height="220" viewBox={`0 0 ${TRACE_WIDTH} ${TRACE_HEIGHT}`} preserveAspectRatio="none">
            <path d={buildTrace()} fill="none" stroke="#416180" strokeWidth="2" />
          </svg>
        </div>
      </div>
    ),
    size
  );
}
