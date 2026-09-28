import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#efeae2",
          color: "#2a1f18",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#6e6258" }}>
          Tuléar, Madagascar
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 88, fontWeight: 700, letterSpacing: -3 }}>
            art lanto design
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#4a3d33", maxWidth: 900 }}>
            Vannerie haut de gamme, plantes et hospitalité à Tuléar
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
