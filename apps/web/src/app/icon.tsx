import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

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
          background: "#0F1419",
          color: "#FFFFFF",
          fontFamily: "Georgia, serif",
          fontSize: 48,
          fontWeight: 500,
          letterSpacing: "-0.04em",
          borderRadius: 12,
          lineHeight: 1,
          paddingBottom: 4,
        }}
      >
        G
      </div>
    ),
    { ...size },
  );
}
