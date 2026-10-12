"use client";

import { useEffect, useState } from "react";

export const CONSENT_KEY = "gamaex_cookie_consent";
export const CONSENT_EVENT = "gamaex-consent";

type Loc = "es" | "en" | "pt";

const COPY: Record<Loc, { text: string; reject: string; accept: string }> = {
  es: {
    text: "Usamos cookies y tecnologías similares para mejorar y personalizar tu experiencia, comprender cómo interactúas con el sitio web y con fines de marketing. Haz clic en \"Rechazar\" para rechazar las cookies opcionales o en \"Entiendo\" para aceptarlas.",
    reject: "Rechazar",
    accept: "Entiendo",
  },
  en: {
    text: "We use cookies and similar technologies to improve and personalize your experience, understand how you interact with the website and for marketing purposes. Click \"Reject\" to decline optional cookies or \"I understand\" to accept them.",
    reject: "Reject",
    accept: "I understand",
  },
  pt: {
    text: "Usamos cookies e tecnologias semelhantes para melhorar e personalizar sua experiência, entender como você interage com o site e para fins de marketing. Clique em \"Rejeitar\" para recusar os cookies opcionais ou em \"Entendi\" para aceitá-los.",
    reject: "Rejeitar",
    accept: "Entendi",
  },
};

function readLocale(): Loc {
  const m = document.cookie.match(/(?:^|; )gamaex_locale=(es|en|pt)/);
  return (m?.[1] as Loc) ?? "es";
}

function readChoice(): "accepted" | "rejected" | null {
  try {
    localStorage.removeItem(CONSENT_KEY); // limpia el consentimiento permanente de versiones anteriores
    const v = sessionStorage.getItem(CONSENT_KEY);
    return v === "accepted" || v === "rejected" ? v : null;
  } catch {
    return null;
  }
}

// El aviso se muestra en cada visita nueva (sessionStorage), aunque sea la misma persona.
// NO bloquea el sitio: si rechaza, puede seguir usándolo; solo no se cargan las cookies opcionales.
export function hasConsent(): boolean {
  return readChoice() === "accepted";
}

export default function CookieConsent() {
  const [state, setState] = useState<"unknown" | "pending" | "done">("unknown");
  const [loc, setLoc] = useState<Loc>("es");

  useEffect(() => {
    setLoc(readLocale());
    setState(readChoice() ? "done" : "pending");
  }, []);

  function choose(choice: "accepted" | "rejected") {
    try { sessionStorage.setItem(CONSENT_KEY, choice); } catch { /* sin storage: vale solo esta página */ }
    setState("done");
    if (choice === "accepted") window.dispatchEvent(new Event(CONSENT_EVENT));
  }

  if (state !== "pending") return null;

  const t = COPY[loc];

  return (
    <div
      role="region"
      aria-label="Cookies"
      style={{
        position: "fixed", left: "50%", bottom: "1rem", transform: "translateX(-50%)",
        zIndex: 2147483000, width: "calc(100% - 2rem)", maxWidth: 520,
        background: "#fff", color: "#1a1a1a", borderRadius: 16, padding: "1.3rem 1.3rem 1.2rem",
        boxShadow: "0 12px 40px rgba(0,0,0,0.28)", border: "1px solid rgba(0,0,0,0.08)", fontFamily: "inherit",
      }}
    >
      <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.55, color: "#4a4a4a" }}>{t.text}</p>
      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.1rem" }}>
        <button
          onClick={() => choose("rejected")}
          style={{ flex: 1, padding: "0.8rem 1rem", borderRadius: 10, border: "1.5px solid #1a1a1a", background: "#fff", color: "#1a1a1a", fontSize: "0.98rem", fontWeight: 600, cursor: "pointer" }}
        >
          {t.reject}
        </button>
        <button
          onClick={() => choose("accepted")}
          style={{ flex: 1, padding: "0.8rem 1rem", borderRadius: 10, border: "none", background: "#0d1b2a", color: "#fff", fontSize: "0.98rem", fontWeight: 600, cursor: "pointer" }}
        >
          {t.accept}
        </button>
      </div>
    </div>
  );
}
