"use client";

import { useState } from "react";
import { track } from "./analytics";

const WA_NUMBER = "56938782514";
const FIXED_PHONE = "+56 2 2946 2670";
const FIXED_PHONE_2 = "+56 2 2789 4391";
const WA_MSG = "Hola, quiero consultar una cotización en Gamaex.";
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MSG)}`;
const MAPS_LINK = "https://www.google.com/maps/place/?q=place_id:ChIJWTo0fmbPYpYR4XOn4uAxnIU";

export default function NosotrosPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <main className="ns-root">
      {/* ── NAV ── */}
      <nav className="ns-nav">
        <a href="/" className="ns-brand">
          <svg viewBox="0 33 800 214" xmlns="http://www.w3.org/2000/svg" aria-label="Gamaex">
            <defs>
              <linearGradient id="nsLogoGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E8C76E" />
                <stop offset="50%" stopColor="#C9A84C" />
                <stop offset="100%" stopColor="#9C7E2E" />
              </linearGradient>
            </defs>
            <g transform="translate(140,140)">
              <circle cx="0" cy="0" r="100" fill="none" stroke="url(#nsLogoGold)" strokeWidth="4" />
              <circle cx="0" cy="0" r="86" fill="none" stroke="url(#nsLogoGold)" strokeWidth="1" opacity="0.5" />
              <path d="M -38 -42 A 50 50 0 1 0 38 42 L 38 0 L 0 0" fill="none" stroke="url(#nsLogoGold)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M -7 -100 L 0 -107 L 7 -100" fill="none" stroke="url(#nsLogoGold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M -7 100 L 0 107 L 7 100" fill="none" stroke="url(#nsLogoGold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <text x="280" y="170" fontFamily="'Cormorant Garamond', serif" fontSize="92" fontWeight="500" letterSpacing="14" fill="url(#nsLogoGold)">GAMAEX</text>
          </svg>
        </a>
        <div className="ns-nav-links">
          <a href="/">Inicio</a>
          <a href="/servicios">Servicios</a>
          <a href="/preguntas-frecuentes">FAQ</a>
          <a href="/#ubicacion">Ubicación</a>
        </div>
        <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="ns-cta-dark ns-cta-desktop" onClick={() => track.whatsappClick("nosotros-nav")}>💬 Cotizar</a>
        <button
          type="button"
          className={`ns-burger ${menuOpen ? "open" : ""}`}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      <div
        className={`ns-mobile-overlay ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden={!menuOpen}
      />
      <aside
        className={`ns-mobile-drawer ${menuOpen ? "open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <ul className="ns-mobile-links">
          <li><a href="/" onClick={() => setMenuOpen(false)}>Inicio</a></li>
          <li><a href="/servicios" onClick={() => setMenuOpen(false)}>Servicios</a></li>
          <li><a href="/preguntas-frecuentes" onClick={() => setMenuOpen(false)}>FAQ</a></li>
          <li><a href="/#ubicacion" onClick={() => setMenuOpen(false)}>Ubicación</a></li>
        </ul>
        <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="ns-mobile-cta" onClick={() => { track.whatsappClick("nosotros-mobile-menu"); setMenuOpen(false); }}>
          💬 Cotizar por WhatsApp
        </a>
        <a href={`tel:${FIXED_PHONE.replace(/\s/g, "")}`} className="ns-mobile-cta-outline" onClick={() => { track.phoneClick(); setMenuOpen(false); }}>
          📞 Llamar al local
        </a>
      </aside>

      {/* ── HERO ── */}
      <section className="ns-hero">
        <div className="ns-hero-inner">
          <span className="ns-label">Quiénes somos</span>
          <h1>Una casa de cambio chilena <em>con trayectoria real</em>.</h1>
          <p className="ns-hero-desc">
            Empresa familiar con más de tres décadas operando en el mercado cambiario chileno desde nuestra casa matriz en Av. Pedro de Valdivia 020, Providencia. Atención presencial, billetes verificados, sin comisiones ocultas.
          </p>
          <div className="ns-hero-ctas">
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="ns-btn-gold" onClick={() => track.whatsappClick("nosotros-hero")}>💬 Cotizar por WhatsApp</a>
            <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="ns-btn-outline" onClick={() => track.mapsClick()}>📍 Cómo llegar</a>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="ns-stats">
        <div className="ns-stat">
          <div className="ns-stat-num">38</div>
          <div className="ns-stat-label">años de experiencia<br />en el rubro cambiario</div>
        </div>
        <div className="ns-stat">
          <div className="ns-stat-num">40+</div>
          <div className="ns-stat-label">divisas disponibles<br />compra y venta</div>
        </div>
        <div className="ns-stat">
          <div className="ns-stat-num">WU</div>
          <div className="ns-stat-label">socios estratégicos<br />de Western Union</div>
        </div>
        <div className="ns-stat">
          <div className="ns-stat-num">UAF</div>
          <div className="ns-stat-label">registrados en la<br />Unidad de Análisis Financiero</div>
        </div>
      </section>

      {/* ── HISTORIA ── */}
      <section className="ns-section ns-section-light">
        <div className="ns-section-head">
          <span className="ns-label">Nuestra historia</span>
          <h2>Una empresa familiar <em>con raíces en Providencia</em>.</h2>
        </div>

        <div className="ns-historia-grid">
          <div className="ns-historia-quote">
            <div className="ns-quote-mark">&ldquo;</div>
            <p>
              Hemos prestado servicios intachables durante décadas. Nuestros clientes vuelven porque saben que en Gamaex encuentran precios claros, atención cercana y operaciones impecables.
            </p>
            <div className="ns-quote-author">
              <strong>El equipo de Gamaex</strong>
              <span>Casa de cambio · Providencia</span>
            </div>
          </div>

          <div className="ns-historia-text">
            <p>
              Gamaex es una <strong>casa de cambio chilena</strong> con casa matriz en Av. Pedro de Valdivia 020, Providencia, Santiago. Somos una empresa familiar con más de tres décadas de operación continua en el mercado cambiario nacional.
            </p>
            <p>
              Nuestro equipo es profesional y estable: el integrante más antiguo acumula <strong>38 años de experiencia</strong> en el rubro, y esa experiencia se traduce en cada operación que realizamos. Conocemos los billetes, conocemos el mercado, y conocemos a nuestros clientes.
            </p>
            <p>
              A lo largo de los años hemos construido una cartera estable de clientes habituales — personas naturales, viajeros frecuentes, empresas y profesionales — que regresan a Gamaex porque encuentran lo que toda casa de cambio seria debe ofrecer: precios claros, atención personalizada, billetes verificados y operaciones impecables.
            </p>
            <p>
              Lo que nos distingue es ser una casa de cambio <strong>presencial con trayectoria real</strong>, no una aplicación digital ni un intermediario online. Cuando vienes a Gamaex, hablas con personas con experiencia, ves los billetes, recibes tu cambio en mano y operas con la tranquilidad de tratar con una empresa establecida físicamente en Providencia.
            </p>
          </div>
        </div>
      </section>

      {/* ── SERVICIOS ── */}
      <section className="ns-section">
        <div className="ns-section-head">
          <span className="ns-label">Nuestros servicios</span>
          <h2>Más que cambio de divisas.</h2>
          <p className="ns-section-sub">
            Operamos con personas naturales y empresas. Atención presencial en Providencia, sin comisiones ocultas, con tasas actualizadas diariamente.
          </p>
        </div>

        <div className="ns-services">
          <article className="ns-service-card">
            <div className="ns-service-icon">💵</div>
            <h3>Cambio de divisas físicas</h3>
            <p>
              Compra y venta presencial de más de 40 monedas: dólar americano (USD), euro (EUR), libra esterlina (GBP), real brasileño (BRL), peso argentino (ARS), franco suizo (CHF), yen japonés (JPY) y muchas más. Tasas actualizadas diariamente, sin comisiones adicionales.
            </p>
          </article>

          <article className="ns-service-card">
            <div className="ns-service-icon">🌎</div>
            <h3>Transferencias internacionales</h3>
            <p>
              Somos <strong>socios estratégicos aprobados de Western Union</strong> para giros internacionales. Envíos al extranjero con cobertura global, tiempos de entrega claros y trazabilidad completa de cada operación.
            </p>
          </article>

          <article className="ns-service-card">
            <div className="ns-service-icon">🏢</div>
            <h3>Pago a proveedores</h3>
            <p>
              Trabajamos con personas naturales y empresas de todos los tamaños. Servicio de pago a proveedores en Chile y en el extranjero — ideal para importadores, exportadores y empresas con operaciones cross-border.
            </p>
          </article>

          <article className="ns-service-card">
            <div className="ns-service-icon">⭐</div>
            <h3>Tasa preferencial</h3>
            <p>
              Operaciones desde <strong>USD 5.000</strong> acceden a tasa preferencial. Si manejas volúmenes recurrentes o vas a hacer una operación grande, contáctanos antes por WhatsApp para coordinar la mejor cotización del día.
            </p>
          </article>
        </div>
      </section>

      {/* ── CONFIANZA ── */}
      <section className="ns-section ns-section-dark">
        <div className="ns-section-head">
          <span className="ns-label">Confianza y regulación</span>
          <h2>Una casa de cambio <em>formalmente regulada</em>.</h2>
          <p className="ns-section-sub">
            Cumplimos con la normativa chilena de prevención de lavado de activos y financiamiento del terrorismo aplicable al sector cambiario.
          </p>
        </div>

        <div className="ns-trust-grid">
          <div className="ns-trust-card">
            <div className="ns-trust-icon">🛡️</div>
            <h3>UAF</h3>
            <p>Registrados ante la <strong>Unidad de Análisis Financiero</strong> de Chile, cumpliendo normativas de prevención de lavado de activos.</p>
          </div>
          <div className="ns-trust-card">
            <div className="ns-trust-icon">🏛️</div>
            <h3>Superintendencia</h3>
            <p>Operamos inscritos ante la <strong>Superintendencia</strong>, bajo los estándares legales del sistema financiero chileno.</p>
          </div>
          <div className="ns-trust-card">
            <div className="ns-trust-icon">🌐</div>
            <h3>Western Union</h3>
            <p>Socios estratégicos aprobados para giros y transferencias internacionales con cobertura global y trazabilidad.</p>
          </div>
          <div className="ns-trust-card">
            <div className="ns-trust-icon">📍</div>
            <h3>Casa matriz física</h3>
            <p>Av. Pedro de Valdivia 020, Providencia, Santiago. A pasos del Metro Pedro de Valdivia (Línea 1).</p>
          </div>
        </div>

        <div className="ns-trust-foot">
          <p>
            Esta regulación no es solo un trámite: es la garantía de que cada operación que realizas en Gamaex cumple con los estándares legales y de transparencia que el sistema financiero chileno exige a las casas de cambio formales. Es lo que distingue a una empresa establecida de los cambistas informales que operan sin supervisión.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="ns-cta-section">
        <h2>Te esperamos en <em>Providencia</em>.</h2>
        <p>Av. Pedro de Valdivia 020 · A pasos del Metro Pedro de Valdivia (Línea 1)</p>
        <div className="ns-cta-row">
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="ns-btn-gold" onClick={() => track.whatsappClick("nosotros-cta")}>💬 Cotizar por WhatsApp</a>
          <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="ns-btn-outline" onClick={() => track.mapsClick()}>📍 Ver en Maps</a>
          <a href={`tel:${FIXED_PHONE.replace(/\s/g, "")}`} className="ns-btn-outline" onClick={() => track.phoneClick()}>📞 {FIXED_PHONE}</a>
          <a href={`tel:${FIXED_PHONE_2.replace(/\s/g, "")}`} className="ns-btn-outline" onClick={() => track.phoneClick()}>📞 {FIXED_PHONE_2}</a>
        </div>
        <div className="ns-hours">
          <span><strong>Lun – Vie</strong> 9:00 — 17:00</span>
          <span><strong>Sábado</strong> 9:00 — 13:00</span>
          <span><strong>Domingo</strong> Cerrado</span>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="ns-footer">
        <p>© {new Date().getFullYear()} Inversiones y Turismo Gamaex Chile S.A. — Casa de cambio en Providencia, Santiago.</p>
        <div className="ns-footer-links">
          <a href="/">Inicio</a>
          <a href="/servicios">Servicios</a>
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
        }
        .ns-root * { box-sizing: border-box; }
        .ns-root a { text-decoration: none; color: inherit; }
        .ns-root h1, .ns-root h2, .ns-root h3 { margin: 0; font-family: inherit; font-weight: 800; letter-spacing: -1px; line-height: 1.15; }
        .ns-root p { margin: 0; }
        .ns-root em { font-style: normal; color: var(--ns-gold-deep); }

        /* NAV */
        .ns-nav {
          position: sticky; top: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          padding: 1rem 6%; background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--ns-border);
        }
        .ns-brand svg { height: 42px; width: auto; }
        .ns-nav-links { display: flex; gap: 2rem; }
        .ns-nav-links a { color: var(--ns-gray); font-size: 0.95rem; font-weight: 500; transition: color 0.2s; }
        .ns-nav-links a:hover { color: var(--ns-dark); }
        .ns-cta-dark {
          background: var(--ns-dark); color: var(--ns-white) !important;
          padding: 0.65rem 1.5rem; border-radius: 50px; font-size: 0.9rem;
          font-weight: 600; transition: all 0.2s;
        }
        .ns-cta-dark:hover { background: var(--ns-dark-2); transform: translateY(-1px); }

        /* HERO */
        .ns-hero {
          background: linear-gradient(180deg, var(--ns-dark) 0%, var(--ns-dark-2) 100%);
          color: var(--ns-white);
          padding: 6rem 6% 5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .ns-hero::before {
          content: ''; position: absolute; inset: 0;
          background:
            radial-gradient(ellipse at 20% 30%, rgba(201,168,76,0.15), transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(201,168,76,0.08), transparent 50%);
          pointer-events: none;
        }
        .ns-hero-inner { position: relative; max-width: 850px; margin: 0 auto; }
        .ns-hero h1 {
          font-size: clamp(2rem, 4.5vw, 3.4rem);
          font-weight: 800; letter-spacing: -1.5px; line-height: 1.1;
          color: var(--ns-white);
          margin: 1.2rem 0 1.5rem;
        }
        .ns-hero h1 em { color: var(--ns-gold-light); font-style: normal; }
        .ns-hero-desc { color: rgba(255,255,255,0.75); font-size: 1.15rem; max-width: 650px; margin: 0 auto 2.5rem; }
        .ns-hero-ctas { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

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
          background: var(--ns-gold); color: var(--ns-dark) !important;
          padding: 1rem 1.8rem; border-radius: 12px; font-weight: 700; font-size: 1rem;
          display: inline-flex; align-items: center; gap: 0.5rem;
          transition: all 0.2s;
        }
        .ns-btn-gold:hover { background: var(--ns-gold-deep); color: var(--ns-white) !important; transform: translateY(-2px); box-shadow: 0 10px 25px rgba(201,168,76,0.35); }
        .ns-btn-outline {
          padding: 1rem 1.8rem; border-radius: 12px; font-weight: 600; font-size: 1rem;
          display: inline-flex; align-items: center; gap: 0.5rem;
          border: 1.5px solid rgba(255,255,255,0.4); color: var(--ns-white) !important;
          transition: all 0.2s; background: transparent;
        }
        .ns-btn-outline:hover { background: rgba(255,255,255,0.08); border-color: var(--ns-white); }
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
        }
        .ns-stat:last-child { border-right: none; }
        .ns-stat-num {
          font-size: 3rem; font-weight: 800;
          letter-spacing: -2.5px;
          color: var(--ns-gold-deep); line-height: 1;
          margin-bottom: 0.6rem;
        }
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
          font-size: clamp(1.7rem, 3vw, 2.5rem);
          font-weight: 800; letter-spacing: -1px; line-height: 1.15;
          margin-bottom: 1rem;
        }
        .ns-section-sub {
          font-size: 1.1rem; color: var(--ns-gray); line-height: 1.6;
        }
        .ns-section-dark .ns-section-sub { color: rgba(255,255,255,0.7); }

        /* HISTORIA */
        .ns-historia-grid {
          display: grid; grid-template-columns: 1fr 1.2fr;
          gap: 4rem; max-width: 1200px; margin: 0 auto;
          align-items: start;
        }
        .ns-historia-quote {
          background: var(--ns-white); border: 1px solid var(--ns-border);
          padding: 2.5rem; border-radius: 16px;
          position: relative;
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

        .ns-historia-text { display: flex; flex-direction: column; gap: 1.2rem; }
        .ns-historia-text p { font-size: 1.05rem; line-height: 1.75; color: var(--ns-dark); }

        /* SERVICIOS */
        .ns-services {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem; max-width: 1100px; margin: 0 auto;
        }
        .ns-service-card {
          background: var(--ns-white); border: 1px solid var(--ns-border);
          padding: 2.2rem; border-radius: 16px;
          transition: all 0.3s;
        }
        .ns-service-card:hover {
          border-color: var(--ns-gold);
          box-shadow: 0 12px 30px rgba(15,20,25,0.08);
          transform: translateY(-3px);
        }
        .ns-service-icon { font-size: 2.4rem; margin-bottom: 1rem; }
        .ns-service-card h3 {
          font-size: 1.25rem; font-weight: 700; letter-spacing: -0.5px;
          line-height: 1.25;
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
          transition: all 0.3s;
        }
        .ns-trust-card:hover {
          border-color: var(--ns-gold);
          background: rgba(201,168,76,0.05);
        }
        .ns-trust-icon { font-size: 2rem; margin-bottom: 0.8rem; }
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
        .ns-trust-foot p { font-size: 1.05rem; line-height: 1.7; color: rgba(255,255,255,0.7); }

        /* CTA SECTION */
        .ns-cta-section {
          padding: 6rem 6%; text-align: center;
          background: var(--ns-light-2);
          border-top: 1px solid var(--ns-border);
        }
        .ns-cta-section h2 {
          font-size: clamp(1.8rem, 3.5vw, 2.7rem);
          font-weight: 800; letter-spacing: -1px; line-height: 1.15;
          margin-bottom: 0.8rem;
        }
        .ns-cta-section > p { font-size: 1.1rem; color: var(--ns-gray); margin-bottom: 2rem; }
        .ns-cta-row {
          display: flex; gap: 0.8rem; justify-content: center; flex-wrap: wrap;
          margin-bottom: 2.5rem;
        }
        .ns-hours {
          display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap;
          font-size: 0.95rem; color: var(--ns-gray);
        }
        .ns-hours strong { color: var(--ns-dark); margin-right: 0.4rem; }

        /* FOOTER */
        .ns-footer {
          padding: 2.5rem 6%;
          background: var(--ns-dark); color: rgba(255,255,255,0.6);
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 1.5rem;
          font-size: 0.88rem;
        }
        .ns-footer-links { display: flex; gap: 1.5rem; }
        .ns-footer-links a { color: rgba(255,255,255,0.6); transition: color 0.2s; }
        .ns-footer-links a:hover { color: var(--ns-gold-light); }

        /* RESPONSIVE */
        /* HAMBURGER + DRAWER */
        .ns-burger { display: none; flex-direction: column; justify-content: center; gap: 5px; width: 44px; height: 44px; padding: 10px; background: transparent; border: none; cursor: pointer; border-radius: 10px; margin-left: auto; }
        .ns-burger:hover { background: rgba(15,20,25,0.06); }
        .ns-burger span { display: block; width: 22px; height: 2px; background: var(--ns-dark); border-radius: 2px; transition: transform 0.25s ease, opacity 0.2s ease; }
        .ns-burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .ns-burger.open span:nth-child(2) { opacity: 0; }
        .ns-burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        .ns-mobile-overlay { display: none; position: fixed; inset: 0; background: rgba(15,20,25,0.55); backdrop-filter: blur(4px); opacity: 0; pointer-events: none; transition: opacity 0.25s; z-index: 99; }
        .ns-mobile-overlay.open { opacity: 1; pointer-events: auto; }

        .ns-mobile-drawer {
          display: none; position: fixed; top: 0; right: 0; bottom: 0; width: min(82vw, 360px);
          background: white; padding: 100px 1.75rem 2rem; flex-direction: column; gap: 1rem;
          box-shadow: -8px 0 28px rgba(15,20,25,0.18); transform: translateX(100%); transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 100; overflow-y: auto;
        }
        .ns-mobile-drawer.open { transform: translateX(0); }
        .ns-mobile-links { list-style: none; padding: 0; margin: 0 0 1.5rem; display: flex; flex-direction: column; gap: 0.25rem; }
        .ns-mobile-links a { display: block; padding: 0.95rem 0.25rem; font-size: 1.05rem; font-weight: 500; color: var(--ns-dark); border-bottom: 1px solid var(--ns-border); transition: color 0.2s, padding-left 0.2s; }
        .ns-mobile-links a:hover, .ns-mobile-links a:active { color: var(--ns-gold-deep); padding-left: 0.5rem; }
        .ns-mobile-links li:last-child a { border-bottom: none; }
        .ns-mobile-cta { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem 1.25rem; background: var(--ns-gold); color: var(--ns-dark); border-radius: 12px; font-size: 1rem; font-weight: 700; box-shadow: 0 4px 14px rgba(201,168,76,0.3); transition: transform 0.15s; }
        .ns-mobile-cta:active { transform: scale(0.98); }
        .ns-mobile-cta-outline { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.95rem 1.25rem; background: white; color: var(--ns-dark); border: 1.5px solid var(--ns-border); border-radius: 12px; font-size: 0.95rem; font-weight: 600; }

        @media (max-width: 900px) {
          .ns-nav { padding: 1rem 5%; }
          .ns-nav-links { display: none; }
          .ns-cta-desktop { display: none; }
          .ns-burger { display: flex; }
          .ns-mobile-overlay { display: block; }
          .ns-mobile-drawer { display: flex; }
          .ns-stats { grid-template-columns: repeat(2, 1fr); }
          .ns-stat:nth-child(2) { border-right: none; }
          .ns-stat:nth-child(1), .ns-stat:nth-child(2) { border-bottom: 1px solid var(--ns-border); }
          .ns-historia-grid { grid-template-columns: 1fr; gap: 2.5rem; }
          .ns-services { grid-template-columns: 1fr; }
          .ns-trust-grid { grid-template-columns: repeat(2, 1fr); }
          .ns-section { padding: 4rem 5%; }
          .ns-hero { padding: 4rem 5% 3.5rem; }
          .ns-cta-section { padding: 4rem 5%; }
          .ns-footer { flex-direction: column; text-align: center; }
        }
        @media (max-width: 500px) {
          .ns-stats { grid-template-columns: 1fr; }
          .ns-stat { border-right: none !important; border-bottom: 1px solid var(--ns-border); }
          .ns-stat:last-child { border-bottom: none; }
          .ns-trust-grid { grid-template-columns: 1fr; }
          .ns-hero h1 { font-size: 2.2rem; }
          .ns-hero-ctas { flex-direction: column; }
          .ns-hero-ctas a { width: 100%; justify-content: center; }
          .ns-cta-row a { flex: 1; min-width: 140px; }
        }
      `}</style>
    </main>
  );
}
