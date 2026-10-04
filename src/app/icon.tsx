import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Initials in the blueprint frame: light ground, hairline border, steel accent.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f2f2f3",
          border: "3px solid #416180",
          color: "#416180",
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: -1,
        }}
      >
        OH
      </div>
    ),
    size
  );
}
