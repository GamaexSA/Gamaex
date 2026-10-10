"use client";

import { useEffect, useState } from "react";

export const CONSENT_KEY = "gamaex_cookie_consent";
export const CONSENT_EVENT = "gamaex-consent";

type Loc = "es" | "en" | "pt";

const COPY: Record<Loc, { text: string; reject: string; accept: string; blocked: string; acceptBlocked: string }> = {
  es: {
    text: "Usamos cookies y tecnologías similares para que el sitio funcione, medir cómo se usa y mejorar tu experiencia. Para usar gamaex.cl necesitas aceptarlas.",
    reject: "Rechazar",
    accept: "Entiendo",
    blocked: "Para usar este sitio es necesario aceptar las cookies.",
    acceptBlocked: "Aceptar y continuar",
  },
  en: {
    text: "We use cookies and similar technologies to make the site work, measure how it is used and improve your experience. To use gamaex.cl you need to accept them.",
    reject: "Reject",
    accept: "I understand",
    blocked: "You need to accept cookies to use this site.",
    acceptBlocked: "Accept and continue",
  },
  pt: {
    text: "Usamos cookies e tecnologias semelhantes para que o site funcione, medir como é usado e melhorar sua experiência. Para usar gamaex.cl você precisa aceitá-los.",
    reject: "Rejeitar",
    accept: "Entendi",
    blocked: "Para usar este site é necessário aceitar os cookies.",
    acceptBlocked: "Aceitar e continuar",
  },
};

function readLocale(): Loc {
  const m = document.cookie.match(/(?:^|; )gamaex_locale=(es|en|pt)/);
  return (m?.[1] as Loc) ?? "es";
}

export function hasConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === "accepted";
  } catch {
    return false;
  }
}

export default function CookieConsent() {
  const [state, setState] = useState<"unknown" | "pending" | "rejected" | "accepted">("unknown");
  const [loc, setLoc] = useState<Loc>("es");

  useEffect(() => {
    setLoc(readLocale());
    setState(hasConsent() ? "accepted" : "pending");
  }, []);

  useEffect(() => {
    if (state === "pending" || state === "rejected") {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
    return undefined;
  }, [state]);

  function accept() {
    try { localStorage.setItem(CONSENT_KEY, "accepted"); } catch { /* sin storage: queda solo en esta visita */ }
    setState("accepted");
    window.dispatchEvent(new Event(CONSENT_EVENT));
  }

  if (state === "unknown" || state === "accepted") return null;

  const t = COPY[loc];
  const rejected = state === "rejected";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-live="polite"
      style={{
        position: "fixed", inset: 0, zIndex: 2147483647,
        background: "rgba(10,10,10,0.72)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
      }}
    >
      <div style={{ background: "#fff", color: "#1a1a1a", borderRadius: 16, maxWidth: 480, width: "100%", padding: "1.6rem 1.5rem", boxShadow: "0 20px 60px rgba(0,0,0,0.4)", fontFamily: "inherit" }}>
        <p style={{ margin: 0, fontSize: "1rem", lineHeight: 1.55 }}>{rejected ? t.blocked : t.text}</p>
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.3rem" }}>
          {!rejected && (
            <button
              onClick={() => setState("rejected")}
              style={{ flex: 1, padding: "0.8rem 1rem", borderRadius: 10, border: "1.5px solid #1a1a1a", background: "#fff", color: "#1a1a1a", fontSize: "0.98rem", fontWeight: 600, cursor: "pointer" }}
            >
              {t.reject}
            </button>
          )}
          <button
            onClick={accept}
            style={{ flex: 1, padding: "0.8rem 1rem", borderRadius: 10, border: "none", background: "#111", color: "#fff", fontSize: "0.98rem", fontWeight: 600, cursor: "pointer" }}
          >
            {rejected ? t.acceptBlocked : t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
