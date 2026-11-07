import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          background: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "Arial, sans-serif",
            fontWeight: 900,
            fontSize: 220,
            lineHeight: 1,
            letterSpacing: -8,
            display: "flex",
          }}
        >
          <span style={{ color: "#ffffff" }}>N</span>
          <span style={{ color: "#ffd600" }}>T</span>
        </span>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
