import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "NoorPath — Learn Quran Online with Alma E Deen";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)",
          color: "#FFFFFF",
          fontFamily: "serif",
          padding: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#D4AF37",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              color: "#1B4332",
              fontWeight: 700,
            }}
          >
            ن
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: -0.5 }}>
            NoorPath
          </div>
        </div>

        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: -1,
            marginBottom: 24,
          }}
        >
          Learn Quran Online
        </div>

        <div
          style={{
            fontSize: 36,
            color: "#D4AF37",
            fontWeight: 600,
            marginBottom: 24,
          }}
        >
          with Alma E Deen
        </div>

        <div
          style={{
            fontSize: 26,
            color: "rgba(255,255,255,0.85)",
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          Personalized one-on-one classes — Nazra · Hifz · Tajweed · Translation
        </div>
      </div>
    ),
    { ...size },
  );
}
