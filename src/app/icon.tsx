import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Same initials badge as the navbar logo.
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
          backgroundColor: "#15171c",
          border: "3px solid #2b2e37",
          borderRadius: 10,
          color: "#e0bb4f",
          fontSize: 30,
          fontWeight: 700,
        }}
      >
        PA
      </div>
    ),
    size
  );
}
