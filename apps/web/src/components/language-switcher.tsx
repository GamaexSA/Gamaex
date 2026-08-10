"use client";

import { useEffect, useState } from "react";
import { DEFAULT_LOCALE, LOCALES, LOCALE_COOKIE, LOCALE_INFO, type Locale } from "@/i18n/messages";

interface Props {
  /** Si el server ya sabe el locale (via cookie), pásalo para evitar mismatch de hidratación */
  initial?: Locale;
  compact?: boolean;
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie.split(";").map((c) => c.trim()).find((c) => c.startsWith(name + "="));
  return raw ? decodeURIComponent(raw.slice(name.length + 1)) : null;
}

export default function LanguageSwitcher({ initial, compact = false }: Props) {
  const [current, setCurrent] = useState<Locale>(initial ?? DEFAULT_LOCALE);

  useEffect(() => {
    const raw = readCookie(LOCALE_COOKIE);
    if (raw && (LOCALES as readonly string[]).includes(raw)) setCurrent(raw as Locale);
  }, []);

  const setLocale = (loc: Locale) => {
    if (loc === current) return;
    document.cookie = `${LOCALE_COOKIE}=${loc};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
    window.location.reload();
  };

  return (
    <div
      role="group"
      aria-label="Change language"
      className={`gx-lang-switcher${compact ? " gx-lang-switcher-compact" : ""}`}
    >
      {LOCALES.map((loc) => {
        const info = LOCALE_INFO[loc];
        const active = loc === current;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => setLocale(loc)}
            className={active ? "gx-lang-btn gx-lang-active" : "gx-lang-btn"}
            aria-label={info.ariaLabel}
            aria-pressed={active}
            title={info.ariaLabel}
          >
            <span className="gx-lang-flag" aria-hidden="true">{info.flag}</span>
            {!compact && <span className="gx-lang-label">{info.label}</span>}
          </button>
        );
      })}

      <style jsx>{`
        .gx-lang-switcher {
          display: inline-flex;
          gap: 0.15rem;
          background: rgba(255,255,255,0.6);
          border: 1px solid #E8E4D6;
          border-radius: 999px;
          padding: 0.2rem;
        }
        .gx-lang-switcher-compact { background: transparent; border: none; padding: 0; gap: 0.35rem; }
        .gx-lang-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.3rem 0.65rem;
          border: none;
          background: transparent;
          border-radius: 999px;
          font-family: inherit;
          font-size: 0.82rem;
          font-weight: 600;
          color: #6B7280;
          cursor: pointer;
          transition: all 0.15s;
          line-height: 1;
        }
        .gx-lang-switcher-compact .gx-lang-btn { padding: 0.25rem 0.4rem; }
        .gx-lang-btn:hover { color: #0F1419; background: rgba(15,20,25,0.05); }
        .gx-lang-active { background: #0F1419 !important; color: #FFFFFF !important; }
        .gx-lang-flag { font-size: 1rem; }
      `}</style>
    </div>
  );
}
