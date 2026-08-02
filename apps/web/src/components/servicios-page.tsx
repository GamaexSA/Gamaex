"use client";

import { useEffect } from "react";
import SiteNav from "./site-nav";

// Página de Servicios standalone que REPLICA el sistema de diseño del sitio Gamaex
// (fuentes Cormorant Garamond + Inter, paleta oro/oscuro/crema, logo SVG con gradiente,
// nav fijo con blur, secciones con label dorado + título, cards con caja de ícono dorada,
// footer oscuro, reveal on-scroll). Sin emojis: íconos SVG de línea.

const WA = "https://wa.me/56938782514?text=" + encodeURIComponent("Hola, quiero consultar por sus servicios en Gamaex.");

type IconName = "cambio" | "transfer" | "tarjeta" | "empresa" | "asesoria" | "preferencial";

function Icon({ name }: { name: IconName }) {
  const common = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "cambio":
      return (<svg {...common}><path d="M4 8h13M14 5l3 3-3 3" /><path d="M20 16H7M10 13l-3 3 3 3" /></svg>);
    case "transfer":
      return (<svg {...common}><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c2.6 2.8 2.6 15.2 0 18M12 3c-2.6 2.8-2.6 15.2 0 18" /></svg>);
    case "tarjeta":
      return (<svg {...common}><rect x="3" y="6" width="18" height="12" rx="2.5" /><path d="M3 10h18M7 15h3" /></svg>);
    case "empresa":
      return (<svg {...common}><path d="M5 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16" /><path d="M15 9h3a1 1 0 0 1 1 1v11" /><path d="M3 21h18M8 8h3M8 12h3M8 16h3" /></svg>);
    case "asesoria":
      return (<svg {...common}><path d="M21 11.5a7.5 7.5 0 0 1-10.8 6.7L4 20l1.8-5.2A7.5 7.5 0 1 1 21 11.5z" /></svg>);
    case "preferencial":
      return (<svg {...common}><path d="M12 3l7 2.8v5.4c0 4.3-3 7.4-7 8.8-4-1.4-7-4.5-7-8.8V5.8z" /></svg>);
  }
}

const SERVICIOS: { icon: IconName; title: string; desc: string }[] = [
  { icon: "cambio", title: "Cambio de divisas", desc: "Compra y venta de dólares, euros y más de 40 monedas al tipo de cambio del día. Precios publicados, sin comisiones ocultas." },
  { icon: "transfer", title: "Transferencias internacionales", desc: "Envío y recepción de fondos al exterior: pago a proveedores, operaciones en el extranjero y remesas familiares, con asesoría en cada operación." },
  { icon: "tarjeta", title: "Pago de tarjetas de crédito", desc: "Paga tu tarjeta de crédito internacional al tipo de cambio del día. Consulta el valor con nosotros antes de pagarla con el banco." },
  { icon: "empresa", title: "Empresas y pago a proveedores", desc: "Para compañías que operan o pagan en moneda extranjera. Condiciones especiales por volumen y atención corporativa dedicada." },
  { icon: "asesoria", title: "Asesoría personalizada", desc: "Te acompañamos en cada operación con atención directa. 38 años de experiencia en el mercado cambiario chileno." },
  { icon: "preferencial", title: "Atención preferencial", desc: "Módulos privados para operaciones de mayor monto. Discreción total, trato personalizado y seguridad en local físico." },
];

const PASOS = [
  { n: "01", t: "Déjanos tus datos", d: "Completa el formulario de «Hazte cliente» con tu información." },
  { n: "02", t: "Te validamos", d: "Te contactamos para verificar el registro y completar los requisitos." },
  { n: "03", t: "Comienza a operar", d: "Como cliente registrado operas más rápido, presencial o coordinado." },
];

export default function ServiciosPage() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = document.querySelectorAll<HTMLElement>(".sv-reveal");
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); obs.unobserve(e.target); } }),
      { threshold: 0.12 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="sv-root">
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <linearGradient id="gxLogoGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8C76E" />
            <stop offset="50%" stopColor="#C9A84C" />
            <stop offset="100%" stopColor="#9C7E2E" />
          </linearGradient>
        </defs>
      </svg>

      <SiteNav active="servicios" />

      <header className="sv-hero">
        <span className="sv-tag">Nuestros servicios</span>
        <h1>Más que una casa de cambio</h1>
        <p className="sv-hero-p">
          38 años en Providencia operando divisas, transferencias internacionales y pagos en moneda
          extranjera. Precios publicados, sin comisiones ocultas, atención presencial.
        </p>
        <div className="sv-hero-cta">
          <a href="/hazte-cliente" className="sv-btn-gold">Hazte cliente</a>
          <a href={WA} target="_blank" rel="noopener noreferrer" className="sv-btn-line">Consultar por WhatsApp</a>
        </div>
      </header>

      <section className="sv-section sv-section-light sv-reveal">
        <p className="sv-label">Qué hacemos</p>
        <h2 className="sv-title">Todo lo que necesitas<br />en un solo lugar</h2>
        <p className="sv-subtitle">Más que cambio de divisas: tu socio para operaciones en moneda extranjera.</p>
        <div className="sv-grid">
          {SERVICIOS.map((s) => (
            <article className="sv-card" key={s.title}>
              <div className="sv-ic"><Icon name={s.icon} /></div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sv-section sv-section-dark sv-reveal">
        <p className="sv-label">Hazte cliente</p>
        <h2 className="sv-title">Empieza a operar en tres pasos</h2>
        <div className="sv-pasos">
          {PASOS.map((p) => (
            <div className="sv-paso" key={p.n}>
              <span className="sv-paso-n">{p.n}</span>
              <h3>{p.t}</h3>
              <p>{p.d}</p>
            </div>
          ))}
        </div>
        <a href="/hazte-cliente" className="sv-btn-gold sv-btn-center">Comenzar registro</a>
      </section>

      <footer className="sv-footer">
        <svg className="sv-footer-logo" viewBox="0 0 800 280" aria-hidden="true">
          <g transform="translate(140,140)">
            <circle cx="0" cy="0" r="100" fill="none" stroke="url(#gxLogoGold)" strokeWidth="4" />
            <circle cx="0" cy="0" r="86" fill="none" stroke="url(#gxLogoGold)" strokeWidth="1" opacity="0.5" />
            <path d="M -38 -42 A 50 50 0 1 0 38 42 L 38 0 L 0 0" fill="none" stroke="url(#gxLogoGold)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M -7 -100 L 0 -107 L 7 -100" fill="none" stroke="url(#gxLogoGold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M -7 100 L 0 107 L 7 100" fill="none" stroke="url(#gxLogoGold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <text x="280" y="155" fontFamily="'Cormorant Garamond', serif" fontSize="78" fontWeight="500" letterSpacing="14" fill="url(#gxLogoGold)">GAMAEX</text>
          <text x="280" y="195" fontFamily="'Inter', sans-serif" fontSize="16" fontWeight="400" letterSpacing="6" fill="#C9A84C">CASA DE CAMBIO · DESDE 1988</text>
        </svg>
        <p className="sv-footer-addr">Av. Pedro de Valdivia 020, Providencia, Santiago · Lun–Vie 9:00–17:00 · Sáb 9:00–13:00</p>
        <a href="/" className="sv-footer-back">← Volver al inicio</a>
      </footer>

      <style jsx>{`
        .sv-root {
          --gold-light: #e8c76e; --gold: #c9a84c; --gold-deep: #9c7e2e;
          --dark: #0f1419; --dark-2: #1a1f26; --gray: #6b7280;
          --light: #faf8f2; --white: #fff; --border: #e8e4d6;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          color: var(--dark); background: var(--white); line-height: 1.5; -webkit-font-smoothing: antialiased;
        }
        .sv-nav { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.94); backdrop-filter: blur(14px); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 6%; height: 86px; }
        .sv-logo { display: flex; align-items: center; }
        .sv-logo svg { height: 58px; width: auto; }
        .sv-nav-links { display: flex; gap: 2rem; list-style: none; margin: 0; padding: 0; }
        .sv-nav-links a { font-size: 0.92rem; font-weight: 500; color: var(--gray); text-decoration: none; transition: color 0.2s; }
        .sv-nav-links a:hover { color: var(--dark); }
        .sv-cta-dark { background: var(--dark); color: var(--white); padding: 0.65rem 1.5rem; border-radius: 50px; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
        .sv-cta-dark:hover { background: var(--dark-2); }

        .sv-hero { padding: 5.5rem 6% 4rem; text-align: center; background: linear-gradient(180deg, var(--white) 0%, var(--light) 100%); }
        .sv-tag { display: inline-block; padding: 0.45rem 1rem; border-radius: 50px; background: rgba(201,168,76,0.15); color: var(--gold-deep); font-size: 0.78rem; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase; margin-bottom: 1.3rem; }
        .sv-hero h1 { font-family: "Cormorant Garamond", Georgia, serif; font-size: clamp(2.6rem, 6vw, 4.2rem); font-weight: 600; letter-spacing: -0.5px; line-height: 1.05; margin: 0 0 1.2rem; color: var(--dark); }
        .sv-hero-p { font-size: 1.1rem; color: var(--gray); max-width: 60ch; margin: 0 auto; line-height: 1.65; }
        .sv-hero-cta { display: flex; gap: 0.9rem; justify-content: center; flex-wrap: wrap; margin-top: 2rem; }
        .sv-btn-gold { background: var(--gold); color: var(--dark); padding: 0.95rem 1.8rem; border-radius: 12px; font-size: 0.98rem; font-weight: 700; text-decoration: none; transition: all 0.2s; }
        .sv-btn-gold:hover { background: var(--gold-deep); color: var(--white); transform: translateY(-2px); box-shadow: 0 10px 24px rgba(201,168,76,0.32); }
        .sv-btn-line { background: transparent; color: var(--dark); border: 1.5px solid var(--border); padding: 0.95rem 1.8rem; border-radius: 12px; font-size: 0.98rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
        .sv-btn-line:hover { border-color: var(--gold); color: var(--gold-deep); }
        .sv-btn-center { display: inline-block; margin-top: 2.5rem; }

        .sv-section { padding: 5.5rem 6%; text-align: center; }
        .sv-section-light { background: var(--light); }
        .sv-section-dark { background: var(--dark); color: var(--white); }
        .sv-label { font-size: 0.78rem; font-weight: 700; letter-spacing: 2.5px; color: var(--gold-deep); text-transform: uppercase; margin: 0; }
        .sv-section-dark .sv-label { color: var(--gold); }
        .sv-title { font-family: "Cormorant Garamond", Georgia, serif; font-size: clamp(2rem, 4vw, 3rem); font-weight: 600; letter-spacing: -0.5px; color: var(--dark); margin: 0.6rem 0 0; line-height: 1.12; }
        .sv-section-dark .sv-title { color: var(--white); }
        .sv-subtitle { font-size: 1.05rem; color: var(--gray); margin: 1rem auto 0; max-width: 580px; line-height: 1.6; }

        .sv-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 3rem; text-align: left; max-width: 1120px; margin-left: auto; margin-right: auto; }
        .sv-card { background: var(--white); border: 1.5px solid var(--border); border-radius: 18px; padding: 2rem 1.7rem; transition: all 0.3s; }
        .sv-card:hover { border-color: var(--gold); transform: translateY(-3px); box-shadow: 0 16px 40px rgba(15,20,25,0.07); }
        .sv-ic { width: 52px; height: 52px; border-radius: 13px; background: rgba(201,168,76,0.16); color: var(--gold-deep); display: flex; align-items: center; justify-content: center; margin-bottom: 1.2rem; }
        .sv-card h3 { font-size: 1.15rem; font-weight: 700; color: var(--dark); margin: 0 0 0.5rem; letter-spacing: -0.2px; }
        .sv-card p { font-size: 0.92rem; color: var(--gray); line-height: 1.7; margin: 0; }

        .sv-pasos { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; max-width: 960px; margin: 3rem auto 0; text-align: left; }
        .sv-paso-n { font-family: "Cormorant Garamond", Georgia, serif; font-size: 2.6rem; font-weight: 600; color: var(--gold); display: block; line-height: 1; }
        .sv-paso h3 { font-size: 1.15rem; font-weight: 700; color: var(--white); margin: 0.7rem 0 0.4rem; }
        .sv-paso p { font-size: 0.92rem; color: rgba(255,255,255,0.62); line-height: 1.65; margin: 0; }

        .sv-footer { background: var(--dark); color: var(--white); padding: 4rem 6% 2.4rem; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); }
        .sv-footer-logo { height: 80px; width: auto; margin-bottom: 1.2rem; }
        .sv-footer-addr { color: rgba(255,255,255,0.6); font-size: 0.9rem; margin: 0 0 1rem; }
        .sv-footer-back { color: var(--gold-light); text-decoration: none; font-size: 0.9rem; font-weight: 600; }

        .sv-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1); }
        .sv-reveal.is-visible { opacity: 1; transform: translateY(0); }
        @media (prefers-reduced-motion: reduce) { .sv-reveal { opacity: 1; transform: none; transition: none; } }

        @media (max-width: 920px) { .sv-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 780px) {
          .sv-nav-links { display: none; }
          .sv-nav { padding: 0 5%; height: 72px; }
          .sv-logo svg { height: 48px; }
          .sv-grid, .sv-pasos { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
