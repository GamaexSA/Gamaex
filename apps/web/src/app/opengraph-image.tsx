import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Gamaex Chile — Casa de cambio en Providencia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "64px 80px",
          background: "#0A0F0D",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Background accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 600,
            height: 400,
            background:
              "radial-gradient(ellipse at top right, rgba(201,168,76,0.12) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Gold border top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "#C9A84C",
            display: "flex",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 48,
          }}
        >
          <span
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#C9A84C",
              letterSpacing: "0.22em",
            }}
          >
            GAMAEX
          </span>
          <div
            style={{
              width: 1,
              height: 20,
              background: "rgba(201,168,76,0.35)",
              display: "flex",
            }}
          />
          <span
            style={{
              fontSize: 12,
              color: "#8A8780",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Casa de cambio
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: 62,
            fontWeight: 700,
            color: "#E8E6E1",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            marginBottom: 20,
            maxWidth: 700,
            margin: 0,
          }}
        >
          Casa de cambio en{" "}
          <span style={{ color: "#C9A84C" }}>Providencia</span>
        </h1>

        {/* Subline */}
        <p
          style={{
            fontSize: 22,
            color: "#8A8780",
            fontWeight: 300,
            marginTop: 20,
            marginBottom: 0,
            maxWidth: 600,
          }}
        >
          38 años de trayectoria · +40 divisas · Sin comisiones
        </p>

        {/* Bottom info */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            left: 80,
            display: "flex",
            gap: 32,
          }}
        >
          {[
            ["📍", "Av. Pedro de Valdivia 020"],
            ["🚇", "Metro Pedro de Valdivia"],
            ["🕐", "Lun–Vie 9:00–17:30"],
          ].map(([icon, text]) => (
            <div
              key={text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 14,
                color: "#6A6860",
              }}
            >
              <span>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            right: 80,
            fontSize: 14,
            color: "#4A5350",
          }}
        >
          gamaex.cl
        </div>
      </div>
    ),
    { ...size },
  );
}
