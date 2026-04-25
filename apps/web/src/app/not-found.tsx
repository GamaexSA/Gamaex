import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Página no encontrada | Gamaex Chile",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0F0D",
      color: "#E8E6E1",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      padding: "24px",
      textAlign: "center",
    }}>
      <div>
        <div style={{ fontSize: 72, fontWeight: 700, color: "rgba(201,168,76,0.2)", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 16 }}>
          404
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.02em" }}>
          Página no encontrada
        </div>
        <p style={{ fontSize: 15, color: "#8A8780", marginBottom: 36, lineHeight: 1.6 }}>
          La página que buscás no existe.<br />
          Probablemente fue movida o el enlace está incorrecto.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)",
              color: "#C9A84C", padding: "12px 24px", borderRadius: 10,
              fontSize: 14, fontWeight: 500, textDecoration: "none",
            }}
          >
            ← Ir al inicio
          </Link>
          <a
            href="/#tasas"
            style={{
              display: "inline-flex", alignItems: "center",
              background: "transparent", border: "1px solid rgba(42,51,48,1)",
              color: "#8A8780", padding: "12px 24px", borderRadius: 10,
              fontSize: 14, textDecoration: "none",
            }}
          >
            Ver cotizaciones
          </a>
        </div>
      </div>
    </div>
  );
}
