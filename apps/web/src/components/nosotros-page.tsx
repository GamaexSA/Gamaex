"use client";

import { useEffect, useRef, useState } from "react";
import SiteNav from "./site-nav";
import { track } from "./analytics";

const WA_NUMBER = "56938782514";
const FIXED_PHONE = "+56 2 2946 2670";
const FIXED_PHONE_2 = "+56 2 2789 4391";
const WA_MSG = "Hola, quiero consultar una cotización en Gamaex.";
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MSG)}`;
const MAPS_LINK = "https://www.google.com/maps/place/?q=place_id:ChIJWTo0fmbPYpYR4XOn4uAxnIU";

const CURRENCIES = [
  { flag: "🇺🇸", code: "USD" }, { flag: "🇪🇺", code: "EUR" }, { flag: "🇬🇧", code: "GBP" },
  { flag: "🇧🇷", code: "BRL" }, { flag: "🇦🇷", code: "ARS" }, { flag: "🇨🇭", code: "CHF" },
  { flag: "🇯🇵", code: "JPY" }, { flag: "🇵🇪", code: "PEN" }, { flag: "🇨🇴", code: "COP" },
  { flag: "🇺🇾", code: "UYU" }, { flag: "🇨🇦", code: "CAD" }, { flag: "🇦🇺", code: "AUD" },
  { flag: "🇲🇽", code: "MXN" }, { flag: "🇨🇳", code: "CNY" },
];

type IconName = "cambio" | "globo" | "empresa" | "preferencial" | "escudo" | "institucion" | "pin" | "reloj";

function Icon({ name }: { name: IconName }) {
  const c = { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "cambio":
      return (<svg {...c}><path d="M4 8h13M14 5l3 3-3 3" /><path d="M20 16H7M10 13l-3 3 3 3" /></svg>);
    case "globo":
      return (<svg {...c}><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c2.6 2.8 2.6 15.2 0 18M12 3c-2.6 2.8-2.6 15.2 0 18" /></svg>);
    case "empresa":
      return (<svg {...c}><path d="M5 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16" /><path d="M15 9h3a1 1 0 0 1 1 1v11" /><path d="M3 21h18M8 8h3M8 12h3M8 16h3" /></svg>);
    case "preferencial":
      return (<svg {...c}><path d="M12 3l7 2.8v5.4c0 4.3-3 7.4-7 8.8-4-1.4-7-4.5-7-8.8V5.8z" /></svg>);
    case "escudo":
      return (<svg {...c}><path d="M12 3l7 2.8v5.4c0 4.3-3 7.4-7 8.8-4-1.4-7-4.5-7-8.8V5.8z" /><path d="M9 12l2 2 4-4" /></svg>);
    case "institucion":
      return (<svg {...c}><path d="M3 21h18" /><path d="M4 21V10M9 21V10M15 21V10M20 21V10" /><path d="M12 3L4 9h16z" /></svg>);
    case "pin":
      return (<svg {...c}><path d="M12 21s-6-5.2-6-10a6 6 0 0 1 12 0c0 4.8-6 10-6 10z" /><circle cx="12" cy="11" r="2.2" /></svg>);
    case "reloj":
      return (<svg {...c}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>);
  }
}

// Cuenta ascendente al entrar en viewport. Respeta prefers-reduced-motion.
function CountUp({ to, suffix = "", duration = 1400 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setVal(to); return; }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !done.current) {
          done.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
            setVal(Math.round(eased * to));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return <span ref={ref}>{val}{suffix}</span>;
}

export default function NosotrosPage() {
  const rootRef = useRef<HTMLElement>(null);

  // Scroll-reveal: cada [data-reveal] se hace visible al entrar en viewport.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { els.forEach((el) => el.classList.add("ns-in")); return; }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("ns-in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main className="ns-root" ref={rootRef}>
      <SiteNav active="nosotros" />

      {/* ── HERO ── */}
      <section className="ns-hero">
        <div className="ns-hero-bg" aria-hidden="true">
          <span className="ns-orb ns-orb-1" />
          <span className="ns-orb ns-orb-2" />
          <span className="ns-orb ns-orb-3" />
        </div>
        <div className="ns-hero-inner">
          <span className="ns-label ns-fade" style={{ animationDelay: "0.05s" }}>Quiénes somos</span>
          <h1 className="ns-fade" style={{ animationDelay: "0.15s" }}>Una casa de cambio chilena <em>con trayectoria real</em>.</h1>
          <p className="ns-hero-desc ns-fade" style={{ animationDelay: "0.28s" }}>
            Empresa familiar con más de tres décadas operando en el mercado cambiario chileno desde nuestra casa matriz en Av. Pedro de Valdivia 020, Providencia. Atención presencial, billetes verificados, sin comisiones ocultas.
          </p>
          <div className="ns-hero-ctas ns-fade" style={{ animationDelay: "0.42s" }}>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="ns-btn-gold" onClick={() => track.whatsappClick("nosotros-hero")}>Cotizar por WhatsApp</a>
            <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="ns-btn-outline" onClick={() => track.mapsClick()}>Cómo llegar</a>
          </div>
        </div>

        {/* Ticker de divisas en movimiento */}
        <div className="ns-ticker" aria-hidden="true">
          <div className="ns-ticker-track">
            {[...CURRENCIES, ...CURRENCIES].map((c, i) => (
              <span className="ns-ticker-item" key={i}><span className="ns-ticker-flag">{c.flag}</span>{c.code}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="ns-stats">
        <div className="ns-stat" data-reveal style={{ transitionDelay: "0s" }}>
          <div className="ns-stat-num"><CountUp to={38} /></div>
          <div className="ns-stat-label">años de experiencia<br />en el rubro cambiario</div>
        </div>
        <div className="ns-stat" data-reveal style={{ transitionDelay: "0.1s" }}>
          <div className="ns-stat-num"><CountUp to={40} suffix="+" /></div>
          <div className="ns-stat-label">divisas disponibles<br />compra y venta</div>
        </div>
        <div className="ns-stat" data-reveal style={{ transitionDelay: "0.2s" }}>
          <div className="ns-stat-num">WU</div>
          <div className="ns-stat-label">socios estratégicos<br />de Western Union</div>
        </div>
        <div className="ns-stat" data-reveal style={{ transitionDelay: "0.3s" }}>
          <div className="ns-stat-num">UAF</div>
          <div className="ns-stat-label">registrados en la<br />Unidad de Análisis Financiero</div>
        </div>
      </section>

      {/* ── HISTORIA + TIMELINE ── */}
      <section className="ns-section ns-section-light">
        <div className="ns-section-head" data-reveal>
          <span className="ns-label">Nuestra historia</span>
          <h2>Una empresa familiar <em>con raíces en Providencia</em>.</h2>
        </div>

        <div className="ns-historia-grid">
          <div className="ns-historia-quote" data-reveal>
            <div className="ns-quote-mark">&ldquo;</div>
            <p>
              Hemos prestado servicios intachables durante décadas. Nuestros clientes vuelven porque saben que en Gamaex encuentran precios claros, atención cercana y operaciones impecables.
            </p>
            <div className="ns-quote-author">
              <strong>El equipo de Gamaex</strong>
              <span>Casa de cambio · Providencia</span>
            </div>
          </div>

          <div className="ns-timeline">
            <div className="ns-tl-line" aria-hidden="true"><span className="ns-tl-fill" /></div>
            <div className="ns-tl-item" data-reveal style={{ transitionDelay: "0s" }}>
              <div className="ns-tl-dot"><Icon name="institucion" /></div>
              <div className="ns-tl-body">
                <span className="ns-tl-year">1987</span>
                <h3>Abrimos en Providencia</h3>
                <p>Nace Gamaex como casa de cambio con local físico en Av. Pedro de Valdivia 020, a pasos del Metro Pedro de Valdivia.</p>
              </div>
            </div>
            <div className="ns-tl-item" data-reveal style={{ transitionDelay: "0.08s" }}>
              <div className="ns-tl-dot"><Icon name="cambio" /></div>
              <div className="ns-tl-body">
                <span className="ns-tl-year">+3 décadas</span>
                <h3>Operación continua</h3>
                <p>Equipo profesional y estable. El integrante más antiguo acumula 38 años de experiencia en el rubro cambiario.</p>
              </div>
            </div>
            <div className="ns-tl-item" data-reveal style={{ transitionDelay: "0.16s" }}>
              <div className="ns-tl-dot"><Icon name="globo" /></div>
              <div className="ns-tl-body">
                <span className="ns-tl-year">Western Union</span>
                <h3>Alcance internacional</h3>
                <p>Socios estratégicos aprobados para giros y transferencias al extranjero, con cobertura global y trazabilidad.</p>
              </div>
            </div>
            <div className="ns-tl-item" data-reveal style={{ transitionDelay: "0.24s" }}>
              <div className="ns-tl-dot"><Icon name="escudo" /></div>
              <div className="ns-tl-body">
                <span className="ns-tl-year">Hoy</span>
                <h3>Formales y registrados</h3>
                <p>Sociedad anónima registrada en la UAF, con más de 40 divisas y atención presencial en Providencia.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICIOS ── */}
      <section className="ns-section">
        <div className="ns-section-head" data-reveal>
          <span className="ns-label">Nuestros servicios</span>
          <h2>Más que cambio de divisas.</h2>
          <p className="ns-section-sub">
            Operamos con personas naturales y empresas. Atención presencial en Providencia, sin comisiones ocultas, con tasas actualizadas diariamente.
          </p>
        </div>

        <div className="ns-services">
          {[
            { icon: "cambio" as const, h: "Cambio de divisas físicas", p: <>Compra y venta presencial de más de 40 monedas: dólar americano (USD), euro (EUR), libra esterlina (GBP), real brasileño (BRL), peso argentino (ARS), franco suizo (CHF), yen japonés (JPY) y muchas más. Tasas actualizadas diariamente, sin comisiones adicionales.</> },
            { icon: "globo" as const, h: "Transferencias internacionales", p: <>Somos <strong>socios estratégicos aprobados de Western Union</strong> para giros internacionales. Envíos al extranjero con cobertura global, tiempos de entrega claros y trazabilidad completa de cada operación.</> },
            { icon: "empresa" as const, h: "Pago a proveedores", p: <>Trabajamos con personas naturales y empresas de todos los tamaños. Servicio de pago a proveedores en Chile y en el extranjero — ideal para importadores, exportadores y empresas con operaciones cross-border.</> },
            { icon: "preferencial" as const, h: "Tasa preferencial", p: <>Operaciones desde <strong>USD 5.000</strong> acceden a tasa preferencial. Si manejas volúmenes recurrentes o vas a hacer una operación grande, contáctanos antes por WhatsApp para coordinar la mejor cotización del día.</> },
          ].map((s, i) => (
            <article className="ns-service-card" data-reveal style={{ transitionDelay: `${i * 0.08}s` }} key={s.h}>
              <div className="ns-service-icon"><Icon name={s.icon} /></div>
              <h3>{s.h}</h3>
              <p>{s.p}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── CONFIANZA ── */}
      <section className="ns-section ns-section-dark">
        <div className="ns-section-head" data-reveal>
          <span className="ns-label">Confianza y regulación</span>
          <h2>Una casa de cambio <em>registrada y formal</em>.</h2>
          <p className="ns-section-sub">
            Cumplimos con la normativa chilena de prevención de lavado de activos y financiamiento del terrorismo que la ley exige a las casas de cambio.
          </p>
        </div>

        <div className="ns-trust-grid">
          {[
            { icon: "escudo" as const, h: "Registrados en la UAF", p: <>Figuramos en el registro público de entidades reportantes de la <strong>Unidad de Análisis Financiero (UAF)</strong> como Inversiones y Turismo Gamaex Chile S.A. — el organismo que fiscaliza a las casas de cambio en Chile.</> },
            { icon: "empresa" as const, h: "Empresa formal", p: <>Sociedad anónima chilena constituida — <strong>Inversiones y Turismo Gamaex Chile S.A.</strong>, RUT 76.688.940-9 — con local físico y operación continua desde 1987.</> },
            { icon: "globo" as const, h: "Western Union", p: <>Socios estratégicos aprobados para giros y transferencias internacionales con cobertura global y trazabilidad.</> },
            { icon: "pin" as const, h: "Casa matriz física", p: <>Av. Pedro de Valdivia 020, Providencia, Santiago. A pasos del Metro Pedro de Valdivia (Línea 1).</> },
          ].map((t, i) => (
            <div className="ns-trust-card" data-reveal style={{ transitionDelay: `${i * 0.08}s` }} key={t.h}>
              <div className="ns-trust-icon"><Icon name={t.icon} /></div>
              <h3>{t.h}</h3>
              <p>{t.p}</p>
            </div>
          ))}
        </div>

        <div className="ns-trust-foot" data-reveal>
          <p>
            <strong>¿Por qué una casa de cambio no aparece en la CMF?</strong> Porque en Chile la Comisión para el Mercado Financiero (CMF) supervisa a los bancos y al mercado cambiario formal, no a las casas de cambio. A las casas de cambio les corresponde la fiscalización de la Unidad de Análisis Financiero (UAF) en prevención de lavado de activos — y Gamaex está registrada en la UAF. Que una casa de cambio no figure en la CMF es lo normal y esperable, no una señal de alerta.
          </p>
          <p>
            Lo que realmente distingue a una casa de cambio seria es tener local físico verificable, trayectoria comprobable y estar registrada en la UAF. Gamaex cumple las tres desde 1987 en Providencia.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="ns-cta-section">
        <div data-reveal>
          <h2>Te esperamos en <em>Providencia</em>.</h2>
          <p className="ns-cta-addr">Av. Pedro de Valdivia 020 · A pasos del Metro Pedro de Valdivia (Línea 1)</p>
          <div className="ns-cta-row">
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="ns-btn-gold ns-btn-shine" onClick={() => track.whatsappClick("nosotros-cta")}>Cotizar por WhatsApp</a>
            <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="ns-btn-outline" onClick={() => track.mapsClick()}>Ver en Maps</a>
            <a href={`tel:${FIXED_PHONE.replace(/\s/g, "")}`} className="ns-btn-outline" onClick={() => track.phoneClick()}>{FIXED_PHONE}</a>
            <a href={`tel:${FIXED_PHONE_2.replace(/\s/g, "")}`} className="ns-btn-outline" onClick={() => track.phoneClick()}>{FIXED_PHONE_2}</a>
          </div>
          <div className="ns-hours">
            <span><Icon name="reloj" /> <strong>Lun – Vie</strong> 9:00 — 17:00</span>
            <span><strong>Sábado</strong> 9:00 — 13:00</span>
            <span><strong>Domingo</strong> Cerrado</span>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="ns-footer">
        <p>© {new Date().getFullYear()} Inversiones y Turismo Gamaex Chile S.A. — Casa de cambio en Providencia, Santiago.</p>
        <div className="ns-footer-links">
          <a href="/">Inicio</a>
          <a href="/servicios">Servicios</a>
          <a href="/hazte-cliente">Hazte cliente</a>
          <a href="/preguntas-frecuentes">Preguntas frecuentes</a>
          <a href="/alerta-de-precio">Alerta de precio</a>
        </div>
      </footer>

      <style>{`
        .ns-root {
          --ns-gold-light: #E8C76E;
          --ns-gold: #C9A84C;
          --ns-gold-deep: #9C7E2E;
          --ns-dark: #0F1419;
          --ns-dark-2: #1A1F26;
          --ns-light: #FAF8F2;
          --ns-light-2: #F3F0E6;
          --ns-white: #FFFFFF;
          --ns-border: #E8E4D6;
          --ns-gray: #6B7280;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: var(--ns-dark);
          background: var(--ns-white);
          line-height: 1.55;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }
        .ns-root * { box-sizing: border-box; }
        .ns-root a { text-decoration: none; color: inherit; }
        .ns-root h1, .ns-root h2 { margin: 0; font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 600; letter-spacing: -0.5px; line-height: 1.1; }
        .ns-root h3 { margin: 0; font-family: 'Inter', sans-serif; font-weight: 700; letter-spacing: -0.3px; line-height: 1.2; }
        .ns-root p { margin: 0; }
        .ns-root em { font-style: normal; color: var(--ns-gold-deep); }

        /* ── REVEAL (scroll) ── */
        [data-reveal] {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1);
          will-change: opacity, transform;
        }
        [data-reveal].ns-in { opacity: 1; transform: none; }

        /* ── FADE IN (hero, al cargar) ── */
        .ns-fade { opacity: 0; transform: translateY(20px); animation: nsFadeUp 0.8s cubic-bezier(0.22,1,0.36,1) forwards; }
        @keyframes nsFadeUp { to { opacity: 1; transform: none; } }

        /* HERO */
        .ns-hero {
          background: linear-gradient(180deg, var(--ns-dark) 0%, var(--ns-dark-2) 100%);
          color: var(--ns-white);
          padding: 6.5rem 6% 0;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .ns-hero-bg { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
        .ns-hero-bg::before {
          content: ''; position: absolute; inset: -20%;
          background:
            radial-gradient(ellipse at 20% 25%, rgba(201,168,76,0.18), transparent 45%),
            radial-gradient(ellipse at 82% 70%, rgba(201,168,76,0.10), transparent 45%);
          animation: nsAurora 16s ease-in-out infinite alternate;
        }
        @keyframes nsAurora {
          0%   { transform: translate3d(0,0,0) scale(1); }
          100% { transform: translate3d(-3%, 2%, 0) scale(1.08); }
        }
        .ns-orb { position: absolute; border-radius: 50%; filter: blur(2px); opacity: 0.5; }
        .ns-orb-1 { width: 220px; height: 220px; left: 8%; top: 18%; background: radial-gradient(circle at 30% 30%, rgba(232,199,110,0.30), transparent 70%); animation: nsFloat 12s ease-in-out infinite; }
        .ns-orb-2 { width: 150px; height: 150px; right: 12%; top: 12%; background: radial-gradient(circle at 30% 30%, rgba(201,168,76,0.22), transparent 70%); animation: nsFloat 15s ease-in-out infinite reverse; }
        .ns-orb-3 { width: 300px; height: 300px; right: 4%; bottom: -6%; background: radial-gradient(circle at 30% 30%, rgba(156,126,46,0.20), transparent 70%); animation: nsFloat 18s ease-in-out infinite; }
        @keyframes nsFloat {
          0%,100% { transform: translate(0,0); }
          33%     { transform: translate(18px,-22px); }
          66%     { transform: translate(-14px,12px); }
        }
        .ns-hero-inner { position: relative; z-index: 1; max-width: 850px; margin: 0 auto; padding-bottom: 4.5rem; }
        .ns-hero h1 {
          font-size: clamp(2.4rem, 5vw, 3.9rem);
          color: var(--ns-white);
          margin: 1.2rem 0 1.5rem;
          line-height: 1.05;
        }
        .ns-hero h1 em { color: var(--ns-gold-light); }
        .ns-hero-desc { color: rgba(255,255,255,0.75); font-size: 1.15rem; max-width: 650px; margin: 0 auto 2.5rem; }
        .ns-hero-ctas { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

        /* TICKER divisas */
        .ns-ticker {
          position: relative; z-index: 1;
          margin: 0 -6%;
          border-top: 1px solid rgba(255,255,255,0.08);
          background: rgba(0,0,0,0.18);
          overflow: hidden;
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
        }
        .ns-ticker-track { display: flex; gap: 2.6rem; width: max-content; padding: 0.9rem 0; animation: nsMarquee 38s linear infinite; }
        .ns-ticker:hover .ns-ticker-track { animation-play-state: paused; }
        @keyframes nsMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .ns-ticker-item {
          display: inline-flex; align-items: center; gap: 0.5rem;
          font-size: 0.9rem; font-weight: 600; letter-spacing: 0.14em;
          color: rgba(255,255,255,0.55); white-space: nowrap;
        }
        .ns-ticker-flag { font-size: 1.15rem; }

        /* LABELS */
        .ns-label {
          display: inline-block;
          font-family: 'Inter', sans-serif; font-size: 0.78rem; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--ns-gold); margin-bottom: 0.8rem;
        }
        .ns-section-dark .ns-label { color: var(--ns-gold-light); }

        /* BUTTONS */
        .ns-btn-gold {
          position: relative; overflow: hidden;
          background: var(--ns-gold); color: var(--ns-dark) !important;
          padding: 1rem 1.8rem; border-radius: 12px; font-weight: 700; font-size: 1rem;
          display: inline-flex; align-items: center; gap: 0.5rem;
          transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .ns-btn-gold:hover { background: var(--ns-gold-deep); color: var(--ns-white) !important; transform: translateY(-2px); box-shadow: 0 10px 25px rgba(201,168,76,0.35); }
        .ns-btn-shine::after {
          content: ''; position: absolute; top: 0; left: -60%; width: 40%; height: 100%;
          background: linear-gradient(100deg, transparent, rgba(255,255,255,0.55), transparent);
          transform: skewX(-18deg); animation: nsShine 3.6s ease-in-out infinite;
        }
        @keyframes nsShine { 0%,60% { left: -60%; } 100% { left: 130%; } }
        .ns-btn-outline {
          padding: 1rem 1.8rem; border-radius: 12px; font-weight: 600; font-size: 1rem;
          display: inline-flex; align-items: center; gap: 0.5rem;
          border: 1.5px solid rgba(255,255,255,0.4); color: var(--ns-white) !important;
          transition: all 0.2s; background: transparent;
        }
        .ns-btn-outline:hover { background: rgba(255,255,255,0.08); border-color: var(--ns-white); transform: translateY(-2px); }
        .ns-section-light .ns-btn-outline,
        .ns-section .ns-btn-outline,
        .ns-cta-section .ns-btn-outline {
          border-color: var(--ns-dark); color: var(--ns-dark) !important;
        }
        .ns-cta-section .ns-btn-outline:hover { background: var(--ns-dark); color: var(--ns-white) !important; }

        /* STATS */
        .ns-stats {
          display: grid; grid-template-columns: repeat(4, 1fr);
          background: var(--ns-light);
          border-bottom: 1px solid var(--ns-border);
        }
        .ns-stat {
          padding: 3rem 1.5rem; text-align: center;
          border-right: 1px solid var(--ns-border);
          transition: background 0.3s;
        }
        .ns-stat:last-child { border-right: none; }
        .ns-stat:hover { background: #fff; }
        .ns-stat-num {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 3.4rem; font-weight: 600;
          letter-spacing: -1px;
          color: var(--ns-gold-deep); line-height: 1;
          margin-bottom: 0.6rem;
        }
        .ns-stat:hover .ns-stat-num { color: var(--ns-gold); }
        .ns-stat-label {
          font-size: 0.88rem; color: var(--ns-gray);
          line-height: 1.45; font-weight: 500;
        }

        /* SECTIONS */
        .ns-section { padding: 6rem 6%; }
        .ns-section-light { background: var(--ns-light); }
        .ns-section-dark { background: var(--ns-dark); color: var(--ns-white); }
        .ns-section-dark h2 { color: var(--ns-white); }
        .ns-section-dark h2 em { color: var(--ns-gold-light); }
        .ns-section-head { max-width: 720px; margin: 0 auto 3.5rem; text-align: center; }
        .ns-section-head h2 {
          font-size: clamp(1.9rem, 3.4vw, 2.8rem);
          margin-bottom: 1rem;
        }
        .ns-section-sub {
          font-size: 1.1rem; color: var(--ns-gray); line-height: 1.6;
        }
        .ns-section-dark .ns-section-sub { color: rgba(255,255,255,0.7); }

        /* HISTORIA */
        .ns-historia-grid {
          display: grid; grid-template-columns: 1fr 1.15fr;
          gap: 4rem; max-width: 1150px; margin: 0 auto;
          align-items: start;
        }
        .ns-historia-quote {
          background: var(--ns-white); border: 1px solid var(--ns-border);
          padding: 2.5rem; border-radius: 16px;
          position: relative; position: sticky; top: 110px;
          box-shadow: 0 10px 40px rgba(15,20,25,0.05);
        }
        .ns-quote-mark {
          font-family: 'Cormorant Garamond', serif;
          font-size: 6rem; line-height: 0.7;
          color: var(--ns-gold); margin-bottom: 0.5rem;
        }
        .ns-historia-quote p {
          font-size: 1.15rem; line-height: 1.55;
          color: var(--ns-dark); font-weight: 500;
          margin-bottom: 1.5rem;
        }
        .ns-quote-author {
          padding-top: 1.5rem; border-top: 1px solid var(--ns-border);
          display: flex; flex-direction: column; gap: 0.2rem;
        }
        .ns-quote-author strong { font-family: 'Inter', sans-serif; font-size: 1rem; color: var(--ns-dark); }
        .ns-quote-author span { font-size: 0.85rem; color: var(--ns-gray); letter-spacing: 0.08em; text-transform: uppercase; }

        /* TIMELINE */
        .ns-timeline { position: relative; padding-left: 0; }
        .ns-tl-line { position: absolute; left: 23px; top: 12px; bottom: 12px; width: 2px; background: var(--ns-border); border-radius: 2px; overflow: hidden; }
        .ns-tl-fill { position: absolute; inset: 0; background: linear-gradient(var(--ns-gold-light), var(--ns-gold-deep)); transform: scaleY(0); transform-origin: top; animation: nsDraw linear both; animation-timeline: view(); animation-range: cover 0% cover 70%; }
        @keyframes nsDraw { to { transform: scaleY(1); } }
        .ns-tl-item { position: relative; display: flex; gap: 1.4rem; padding-bottom: 2.4rem; }
        .ns-tl-item:last-child { padding-bottom: 0; }
        .ns-tl-dot {
          flex-shrink: 0; width: 48px; height: 48px; border-radius: 50%;
          background: var(--ns-white); border: 2px solid var(--ns-gold);
          color: var(--ns-gold-deep);
          display: flex; align-items: center; justify-content: center;
          z-index: 1; box-shadow: 0 4px 14px rgba(201,168,76,0.2);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .ns-tl-item:hover .ns-tl-dot { transform: scale(1.1) rotate(-6deg); box-shadow: 0 8px 22px rgba(201,168,76,0.35); }
        .ns-tl-dot svg { width: 22px; height: 22px; }
        .ns-tl-body { padding-top: 0.15rem; }
        .ns-tl-year {
          display: inline-block; font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--ns-gold-deep); background: rgba(201,168,76,0.14);
          padding: 0.25rem 0.6rem; border-radius: 6px; margin-bottom: 0.55rem;
        }
        .ns-tl-body h3 { font-size: 1.15rem; margin-bottom: 0.4rem; color: var(--ns-dark); }
        .ns-tl-body p { font-size: 0.98rem; line-height: 1.6; color: var(--ns-gray); }

        /* SERVICIOS */
        .ns-services {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem; max-width: 1100px; margin: 0 auto;
        }
        .ns-service-card {
          background: var(--ns-white); border: 1px solid var(--ns-border);
          padding: 2.2rem; border-radius: 16px;
          transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
        }
        .ns-service-card:hover {
          border-color: var(--ns-gold);
          box-shadow: 0 16px 40px rgba(15,20,25,0.1);
          transform: translateY(-5px);
        }
        .ns-service-icon {
          width: 54px; height: 54px; border-radius: 13px;
          background: rgba(201,168,76,0.16); color: var(--ns-gold-deep);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.1rem;
          transition: transform 0.35s, background 0.3s;
        }
        .ns-service-card:hover .ns-service-icon { transform: scale(1.08) rotate(-5deg); background: rgba(201,168,76,0.26); }
        .ns-service-card h3 {
          font-size: 1.25rem;
          margin-bottom: 0.8rem; color: var(--ns-dark);
        }
        .ns-service-card p {
          font-size: 1rem; line-height: 1.65;
          color: var(--ns-gray);
        }

        /* TRUST */
        .ns-trust-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 1.2rem; max-width: 1200px; margin: 0 auto 3rem;
        }
        .ns-trust-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 1.8rem; border-radius: 14px;
          transition: transform 0.3s, border-color 0.3s, background 0.3s;
        }
        .ns-trust-card:hover {
          border-color: var(--ns-gold);
          background: rgba(201,168,76,0.06);
          transform: translateY(-4px);
        }
        .ns-trust-icon {
          width: 50px; height: 50px; border-radius: 12px;
          background: rgba(201,168,76,0.14); color: var(--ns-gold-light);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1rem;
          transition: transform 0.35s;
        }
        .ns-trust-card:hover .ns-trust-icon { transform: scale(1.08) rotate(-5deg); }
        .ns-trust-card h3 {
          font-family: 'Inter', sans-serif; font-size: 1rem; font-weight: 700;
          letter-spacing: 0.05em; text-transform: uppercase;
          color: var(--ns-gold-light); margin-bottom: 0.6rem;
        }
        .ns-trust-card p { font-size: 0.92rem; line-height: 1.55; color: rgba(255,255,255,0.75); }
        .ns-trust-card strong { color: var(--ns-white); }
        .ns-trust-foot {
          max-width: 850px; margin: 0 auto; text-align: center;
          padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.08);
        }
        .ns-trust-foot p { font-size: 1.05rem; line-height: 1.7; color: rgba(255,255,255,0.7); margin-bottom: 1rem; }
        .ns-trust-foot p:last-child { margin-bottom: 0; }

        /* CTA SECTION */
        .ns-cta-section {
          padding: 6rem 6%; text-align: center;
          background: var(--ns-light-2);
          border-top: 1px solid var(--ns-border);
        }
        .ns-cta-section h2 {
          font-size: clamp(2rem, 3.6vw, 3rem);
          margin-bottom: 0.8rem;
        }
        .ns-cta-addr { font-size: 1.1rem; color: var(--ns-gray); margin-bottom: 2rem; }
        .ns-cta-row {
          display: flex; gap: 0.8rem; justify-content: center; flex-wrap: wrap;
          margin-bottom: 2.5rem;
        }
        .ns-hours {
          display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap;
          font-size: 0.95rem; color: var(--ns-gray);
        }
        .ns-hours span { display: inline-flex; align-items: center; gap: 0.4rem; }
        .ns-hours svg { width: 18px; height: 18px; color: var(--ns-gold-deep); }
        .ns-hours strong { color: var(--ns-dark); margin-right: 0.4rem; }

        /* FOOTER */
        .ns-footer {
          padding: 2.5rem 6%;
          background: var(--ns-dark); color: rgba(255,255,255,0.6);
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 1.5rem;
          font-size: 0.88rem;
        }
        .ns-footer-links { display: flex; gap: 1.5rem; flex-wrap: wrap; }
        .ns-footer-links a { color: rgba(255,255,255,0.6); transition: color 0.2s; }
        .ns-footer-links a:hover { color: var(--ns-gold-light); }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .ns-stats { grid-template-columns: repeat(2, 1fr); }
          .ns-stat:nth-child(2) { border-right: none; }
          .ns-stat:nth-child(1), .ns-stat:nth-child(2) { border-bottom: 1px solid var(--ns-border); }
          .ns-historia-grid { grid-template-columns: 1fr; gap: 2.5rem; }
          .ns-historia-quote { position: relative; top: 0; }
          .ns-services { grid-template-columns: 1fr; }
          .ns-trust-grid { grid-template-columns: repeat(2, 1fr); }
          .ns-section { padding: 4rem 5%; }
          .ns-hero { padding: 4.5rem 5% 0; }
          .ns-cta-section { padding: 4rem 5%; }
          .ns-footer { flex-direction: column; text-align: center; }
        }
        @media (max-width: 500px) {
          .ns-stats { grid-template-columns: 1fr; }
          .ns-stat { border-right: none !important; border-bottom: 1px solid var(--ns-border); }
          .ns-stat:last-child { border-bottom: none; }
          .ns-trust-grid { grid-template-columns: 1fr; }
          .ns-hero-ctas { flex-direction: column; }
          .ns-hero-ctas a { width: 100%; justify-content: center; }
          .ns-cta-row a { flex: 1; min-width: 140px; }
        }

        /* Accesibilidad: sin movimiento si el usuario lo prefiere */
        @media (prefers-reduced-motion: reduce) {
          .ns-root *, .ns-root *::before, .ns-root *::after {
            animation: none !important;
            transition: none !important;
          }
          [data-reveal] { opacity: 1 !important; transform: none !important; }
          .ns-fade { opacity: 1 !important; transform: none !important; }
          .ns-tl-fill { transform: scaleY(1) !important; }
        }
      `}</style>
    </main>
  );
}
