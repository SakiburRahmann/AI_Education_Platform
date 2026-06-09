import { ImageResponse } from "next/og";

export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #6C3CE1 0%, #4A28A8 50%, #0099FF 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}
        >
          Ulul Albab
        </div>
        <div
          style={{
            fontSize: 36,
            opacity: 0.9,
            fontWeight: 400,
          }}
        >
          Learn with Understanding
        </div>
        <div
          style={{
            fontSize: 20,
            opacity: 0.7,
            marginTop: 40,
          }}
        >
          AI-Powered Learning Platform
        </div>
      </div>
    ),
    { ...size },
  );
}
