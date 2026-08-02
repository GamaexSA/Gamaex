"use client";

import { useState } from "react";

// Nav compartido para las páginas internas (Servicios, Nosotros, Hazte cliente).
// Replica el sistema de diseño del sitio: logo SVG (gradiente gxNavGold propio para
// no colisionar con gxLogoGold del footer de cada página), links completos del sitio,
// CTA oscuro y menú móvil (hamburguesa + drawer). Sin emojis.

const WA = "https://wa.me/56938782514?text=" + encodeURIComponent("Hola, quiero consultar en Gamaex.");

type NavKey = "tasas" | "servicios" | "nosotros" | "contacto" | "alerta" | "faq" | "ubicacion";

const LINKS: { key: NavKey; label: string; href: string }[] = [
  { key: "tasas", label: "Tasas", href: "/#tasas" },
  { key: "servicios", label: "Servicios", href: "/servicios" },
  { key: "nosotros", label: "Nosotros", href: "/nosotros" },
  { key: "contacto", label: "Contacto", href: "/#contacto" },
  { key: "alerta", label: "Alerta de precio", href: "/alerta-de-precio" },
  { key: "faq", label: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
  { key: "ubicacion", label: "Ubicación", href: "/#ubicacion" },
];

export default function SiteNav({
  active,
  cta = "cliente",
}: {
  active?: NavKey;
  cta?: "cliente" | "whatsapp";
}) {
  const [open, setOpen] = useState(false);
  const ctaHref = cta === "whatsapp" ? WA : "/hazte-cliente";
  const ctaLabel = cta === "whatsapp" ? "WhatsApp" : "Hazte cliente";
  const ctaExternal = cta === "whatsapp";

  return (
    <div className="snv">
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <linearGradient id="gxNavGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8C76E" />
            <stop offset="50%" stopColor="#C9A84C" />
            <stop offset="100%" stopColor="#9C7E2E" />
          </linearGradient>
        </defs>
      </svg>

      <nav className="snv-nav">
        <a href="/" className="snv-logo" aria-label="Gamaex — Casa de cambio">
          <svg viewBox="0 0 800 280" aria-hidden="true">
            <g transform="translate(140,140)">
              <circle cx="0" cy="0" r="100" fill="none" stroke="url(#gxNavGold)" strokeWidth="4" />
              <circle cx="0" cy="0" r="86" fill="none" stroke="url(#gxNavGold)" strokeWidth="1" opacity="0.5" />
              <path d="M -38 -42 A 50 50 0 1 0 38 42 L 38 0 L 0 0" fill="none" stroke="url(#gxNavGold)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M -7 -100 L 0 -107 L 7 -100" fill="none" stroke="url(#gxNavGold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M -7 100 L 0 107 L 7 100" fill="none" stroke="url(#gxNavGold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <text x="280" y="170" fontFamily="'Cormorant Garamond', serif" fontSize="92" fontWeight="500" letterSpacing="14" fill="url(#gxNavGold)">GAMAEX</text>
          </svg>
        </a>

        <ul className="snv-links">
          {LINKS.map((l) => (
            <li key={l.key}>
              <a href={l.href} className={active === l.key ? "is-active" : ""}>{l.label}</a>
            </li>
          ))}
        </ul>

        <a
          href={ctaHref}
          className="snv-cta snv-cta-desktop"
          {...(ctaExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {ctaLabel}
        </a>

        <button
          type="button"
          className={`snv-burger ${open ? "open" : ""}`}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </nav>

      <div className={`snv-overlay ${open ? "open" : ""}`} onClick={() => setOpen(false)} aria-hidden={!open} />
      <aside className={`snv-drawer ${open ? "open" : ""}`} aria-hidden={!open}>
        <ul className="snv-drawer-links">
          {LINKS.map((l) => (
            <li key={l.key}>
              <a href={l.href} className={active === l.key ? "is-active" : ""} onClick={() => setOpen(false)}>{l.label}</a>
            </li>
          ))}
        </ul>
        <a
          href={ctaHref}
          className="snv-drawer-cta"
          onClick={() => setOpen(false)}
          {...(ctaExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {ctaLabel}
        </a>
      </aside>

      <style jsx>{`
        .snv {
          --gold-light: #e8c76e; --gold: #c9a84c; --gold-deep: #9c7e2e;
          --dark: #0f1419; --dark-2: #1a1f26; --gray: #6b7280;
          --white: #fff; --border: #e8e4d6;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .snv-nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(255,255,255,0.94); backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 6%; height: 86px; gap: 1.5rem;
        }
        .snv-logo { display: flex; align-items: center; flex-shrink: 0; }
        .snv-logo svg { height: 56px; width: auto; }
        .snv-links { display: flex; gap: 1.6rem; list-style: none; margin: 0; padding: 0; flex-wrap: nowrap; }
        .snv-links a { font-size: 0.9rem; font-weight: 500; color: var(--gray); text-decoration: none; transition: color 0.2s; white-space: nowrap; }
        .snv-links a:hover { color: var(--dark); }
        .snv-links a.is-active { color: var(--gold-deep); font-weight: 600; }
        .snv-cta { background: var(--dark); color: var(--white); padding: 0.65rem 1.5rem; border-radius: 50px; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; white-space: nowrap; flex-shrink: 0; }
        .snv-cta:hover { background: var(--dark-2); transform: translateY(-1px); }

        .snv-burger { display: none; flex-direction: column; justify-content: center; gap: 5px; width: 44px; height: 44px; padding: 10px; background: transparent; border: none; cursor: pointer; border-radius: 10px; }
        .snv-burger:hover { background: rgba(15,20,25,0.06); }
        .snv-burger span { display: block; width: 22px; height: 2px; background: var(--dark); border-radius: 2px; transition: transform 0.25s ease, opacity 0.2s ease; }
        .snv-burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .snv-burger.open span:nth-child(2) { opacity: 0; }
        .snv-burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        .snv-overlay { display: none; position: fixed; inset: 0; background: rgba(15,20,25,0.55); backdrop-filter: blur(4px); opacity: 0; pointer-events: none; transition: opacity 0.25s; z-index: 99; }
        .snv-overlay.open { opacity: 1; pointer-events: auto; }
        .snv-drawer { display: none; position: fixed; top: 0; right: 0; bottom: 0; width: min(82vw, 360px); background: #fff; padding: 100px 1.75rem 2rem; flex-direction: column; gap: 1rem; box-shadow: -8px 0 28px rgba(15,20,25,0.18); transform: translateX(100%); transition: transform 0.28s cubic-bezier(0.4,0,0.2,1); z-index: 100; overflow-y: auto; }
        .snv-drawer.open { transform: translateX(0); }
        .snv-drawer-links { list-style: none; padding: 0; margin: 0 0 1.5rem; display: flex; flex-direction: column; gap: 0.25rem; }
        .snv-drawer-links a { display: block; padding: 0.95rem 0.25rem; font-size: 1.05rem; font-weight: 500; color: var(--dark); text-decoration: none; border-bottom: 1px solid var(--border); transition: color 0.2s, padding-left 0.2s; }
        .snv-drawer-links a:hover, .snv-drawer-links a.is-active { color: var(--gold-deep); padding-left: 0.5rem; }
        .snv-drawer-links li:last-child a { border-bottom: none; }
        .snv-drawer-cta { display: flex; align-items: center; justify-content: center; padding: 1rem 1.25rem; background: var(--gold); color: var(--dark); text-decoration: none; border-radius: 12px; font-size: 1rem; font-weight: 700; box-shadow: 0 4px 14px rgba(201,168,76,0.3); }

        @media (max-width: 1080px) {
          .snv-links { display: none; }
          .snv-cta-desktop { display: none; }
          .snv-burger { display: flex; }
          .snv-overlay { display: block; }
          .snv-drawer { display: flex; }
        }
        @media (max-width: 780px) {
          .snv-nav { padding: 0 5%; height: 72px; }
          .snv-logo svg { height: 46px; }
        }
      `}</style>
    </div>
  );
}
