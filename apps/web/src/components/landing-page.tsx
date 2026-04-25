"use client";

import { useState, useEffect } from "react";
import type { PublicRate } from "@gamaex/types";
import { track } from "./analytics";

// ─── CONFIGURACIÓN WhatsApp ───────────────────────────────────────────────────
// ⚠ PENDIENTE: reemplazar WA_NUMBER con el número real de WhatsApp Business.
//   Formato: código país + número, sin + ni espacios (ej: "56912345678")
//   El teléfono fijo NO funciona con WhatsApp — deben ser números distintos.
const WA_NUMBER = "56999999999"; // ← reemplazar antes de publicar
const FIXED_PHONE = "+56 2 2946 2670"; // teléfono fijo — solo llamadas
const WA_MSG = "Hola, quiero consultar una cotización en Gamaex.";
const wa = (msg?: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg ?? WA_MSG)}`;
// ─────────────────────────────────────────────────────────────────────────────

interface PageContext {
  h1Before?: string;
  h1Accent?: string;
  heroDesc?: string;
}

interface Props {
  rates: PublicRate[];
  systemStatus: string;
  lastSyncAt: string;
  pageContext?: PageContext;
}

const FAQ_ITEMS = [
  {
    q: "¿Compran y venden dólares?",
    a: "Sí. Compramos y vendemos dólares americanos (USD) y más de 40 monedas. Los precios se publican diariamente y se confirman al momento de la operación.",
  },
  {
    q: "¿Tienen comisiones adicionales?",
    a: "No. Operamos con precios finales. Sin comisiones ocultas, sin cargos extra. El precio que ves es el precio de la operación.",
  },
  {
    q: "¿Puedo cotizar por WhatsApp antes de ir?",
    a: "Sí. Escríbenos con el monto y las monedas que quieres operar. Te confirmamos precio y disponibilidad al instante.",
  },
  {
    q: "¿Qué monedas trabajan?",
    a: "Más de 40 monedas: dólar (USD), euro (EUR), real brasileño (BRL), libra esterlina (GBP), yen japonés (JPY), peso argentino (ARS), franco suizo (CHF) y muchas más.",
  },
  {
    q: "¿Cuáles son los horarios de atención?",
    a: "Lunes a viernes de 9:00 a 17:30 y sábados de 9:00 a 13:00. Domingos y festivos cerrado.",
  },
  {
    q: "¿Aceptan billetes en mal estado o fuera de circulación?",
    a: "Aceptamos dólares corrientes que no estén en circulación, sujeto a evaluación en el momento. Consúltanos por WhatsApp si tienes dudas sobre un billete específico.",
  },
  {
    q: "¿Hacen transferencias internacionales?",
    a: "Sí. Ofrecemos transferencias internacionales y pago a proveedores en moneda extranjera. Tenemos condiciones especiales para empresas.",
  },
  {
    q: "¿Cómo llego al local?",
    a: "Estamos en Av. Pedro de Valdivia 020, Providencia. A pasos de la salida del Metro Pedro de Valdivia (Línea 1). También cerca de Costanera Center.",
  },
];

export default function LandingPage({ rates, systemStatus, lastSyncAt, pageContext }: Props) {
  const h1Before = pageContext?.h1Before ?? "Casa de cambio en ";
  const h1Accent = pageContext?.h1Accent ?? "Providencia";
  const heroDesc = pageContext?.heroDesc ?? "38 años de trayectoria a pasos del Metro Pedro de Valdivia. Compra y venta de dólares, euros, reales y más de 40 divisas.";
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CLP");
  const [amount, setAmount] = useState("1000");
  const [hoveredRate, setHoveredRate] = useState<number | null>(null);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  useEffect(() => {
    function checkOpen() {
      const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Santiago" }));
      const day = now.getDay(); // 0=Sun,1=Mon..6=Sat
      const h = now.getHours();
      const m = now.getMinutes();
      const mins = h * 60 + m;
      if (day >= 1 && day <= 5) setIsOpen(mins >= 540 && mins < 1050); // 9:00–17:30
      else if (day === 6) setIsOpen(mins >= 540 && mins < 780);         // 9:00–13:00
      else setIsOpen(false);
    }
    checkOpen();
    const t = setInterval(checkOpen, 60_000);
    return () => clearInterval(t);
  }, []);

  function copyShareLink() {
    const url = `${window.location.origin}?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`;
    void navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      track.shareLink(fromCurrency, toCurrency);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");
    const to = params.get("to");
    const amt = params.get("amount");
    if (from) setFromCurrency(from);
    if (to) setToCurrency(to);
    if (amt) setAmount(amt);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting && e.target.id)
            setVisibleSections((p) => new Set([...p, e.target.id]));
        }),
      { threshold: 0.12 },
    );
    document.querySelectorAll("[data-anim]").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // ── Calculadora ──────────────────────────────────────────────────────────────
  const selectOptions = [
    { code: "CLP", flag_emoji: "🇨🇱", name: "Peso Chileno" },
    ...rates.map((r) => ({ code: r.code, flag_emoji: r.flag_emoji, name: r.name })),
  ];

  const fromRate = rates.find((r) => r.code === fromCurrency);
  const toRate = rates.find((r) => r.code === toCurrency);
  const numAmount = parseFloat(amount) || 0;

  function calcResult(): { value: number; decimals: number; code: string } {
    if (fromCurrency === toCurrency) {
      return { value: numAmount, decimals: 2, code: toCurrency };
    }
    if (fromCurrency !== "CLP" && toCurrency === "CLP") {
      if (!fromRate?.buy) return { value: 0, decimals: 0, code: "CLP" };
      return { value: numAmount * fromRate.buy, decimals: 0, code: "CLP" };
    }
    if (fromCurrency === "CLP" && toCurrency !== "CLP") {
      if (!toRate?.sell) return { value: 0, decimals: toRate?.decimal_places ?? 2, code: toCurrency };
      return { value: numAmount / toRate.sell, decimals: toRate.decimal_places ?? 2, code: toCurrency };
    }
    if (fromRate?.buy && toRate?.sell) {
      const clp = numAmount * fromRate.buy;
      return { value: clp / toRate.sell, decimals: toRate.decimal_places ?? 2, code: toCurrency };
    }
    return { value: 0, decimals: 2, code: toCurrency };
  }

  const result = calcResult();
  const hasResult = result.value > 0 && numAmount > 0;

  const waCalcMsg = hasResult
    ? `Hola, quiero cambiar ${numAmount.toLocaleString("es-CL")} ${fromCurrency} a ${toCurrency} en Gamaex. ¿Pueden confirmarme precio y disponibilidad?`
    : WA_MSG;

  function swap() {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }

  function changeFrom(next: string) {
    const newTo = next === toCurrency ? (next === "CLP" ? (rates[0]?.code ?? "USD") : "CLP") : toCurrency;
    setFromCurrency(next);
    if (next === toCurrency) setToCurrency(newTo);
    track.calcUsed(next, newTo);
  }

  function changeTo(next: string) {
    const newFrom = next === fromCurrency ? (next === "CLP" ? (rates[0]?.code ?? "USD") : "CLP") : fromCurrency;
    setToCurrency(next);
    if (next === fromCurrency) setFromCurrency(newFrom);
    track.calcUsed(newFrom, next);
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const visStyle = (id: string): React.CSSProperties => ({
    transition: "all 0.6s ease",
    opacity: visibleSections.has(id) ? 1 : 0,
    transform: visibleSections.has(id) ? "translateY(0)" : "translateY(24px)",
  });

  return (
    <div
      style={{
        fontFamily: "'DM Sans', -apple-system, sans-serif",
        background: "#0A0F0D",
        color: "#E8E6E1",
        minHeight: "100vh",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
          --bg: #0A0F0D; --bg2: #111916; --bg3: #1A2320;
          --gold: #C9A84C; --gold-dim: rgba(201,168,76,0.15);
          --green: #2ECC71; --green-dim: rgba(46,204,113,0.12);
          --text: #E8E6E1; --text-dim: #8A8780; --border: #2A3330; --red: #E74C3C;
        }
        .mono { font-family: 'DM Mono', monospace; }
        .rate-row {
          display: grid; grid-template-columns: 40px 1fr 110px 110px;
          align-items: center; padding: 14px 20px;
          border-bottom: 1px solid var(--border); transition: background 0.2s;
          cursor: default; gap: 12px; min-width: 320px;
        }
        .rate-row:hover { background: var(--bg3); }
        .rate-row:last-child { border-bottom: none; }
        .badge { background: var(--gold-dim); border: 1px solid rgba(201,168,76,0.3); color: var(--gold); padding: 5px 13px; border-radius: 24px; font-size: 12px; font-weight: 500; letter-spacing: 0.5px; display: inline-flex; align-items: center; gap: 6px; }
        .cta-wa { background: #25D366; color: white; border: none; padding: 14px 28px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.25s; display: inline-flex; align-items: center; gap: 10px; font-family: inherit; text-decoration: none; white-space: nowrap; }
        .cta-wa:hover { background: #1EBE5A; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(37,211,102,0.3); }
        .cta-gold { background: transparent; border: 1.5px solid var(--gold); color: var(--gold); padding: 14px 28px; border-radius: 12px; font-size: 15px; font-weight: 500; cursor: pointer; transition: all 0.25s; font-family: inherit; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; }
        .cta-gold:hover { background: var(--gold-dim); }
        .hero-wrap {
          position: relative; overflow: hidden;
          background:
            radial-gradient(ellipse 90% 65% at 80% -10%, rgba(201,168,76,0.09) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at -5% 110%, rgba(201,168,76,0.05) 0%, transparent 55%),
            #0A0F0D;
        }
        .converter-box {
          background: rgba(17,25,22,0.92);
          border: 1px solid rgba(201,168,76,0.18);
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 0 0 1px rgba(201,168,76,0.06), 0 32px 80px rgba(0,0,0,0.5);
          backdrop-filter: blur(8px);
        }
        .conv-input { background: var(--bg3); border: 1px solid var(--border); color: var(--text); padding: 13px 16px; border-radius: 10px; font-size: 15px; font-family: 'DM Mono', monospace; width: 100%; outline: none; transition: border-color 0.2s; }
        .conv-input:focus { border-color: var(--gold); }
        .conv-select { background: var(--bg3); border: 1px solid var(--border); color: var(--text); padding: 13px 12px; border-radius: 10px; font-size: 14px; font-family: inherit; width: 100%; outline: none; transition: border-color 0.2s; cursor: pointer; }
        .conv-select:focus { border-color: var(--gold); }
        option { background: #111916; color: #E8E6E1; }
        .service-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 18px; padding: 32px 26px; transition: all 0.3s; }
        .service-card:hover { border-color: rgba(201,168,76,0.35); transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.35); }
        .float-wa { position: fixed; bottom: 24px; right: 24px; width: 56px; height: 56px; background: #25D366; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 26px; cursor: pointer; box-shadow: 0 4px 20px rgba(37,211,102,0.4); z-index: 1000; transition: transform 0.3s; border: none; text-decoration: none; }
        .float-wa:hover { transform: scale(1.1); }
        .nav-links { display: flex; gap: 28px; align-items: center; }
        .nav-link { font-size: 11px; color: var(--text-dim); text-decoration: none; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 500; transition: color 0.2s; }
        .nav-link:hover { color: var(--text); }
        .faq-item { border-bottom: 1px solid rgba(201,168,76,0.1); }
        .faq-item:last-child { border-bottom: none; }
        .faq-btn { width: 100%; background: none; border: none; color: var(--text); font-family: inherit; font-size: 15px; font-weight: 500; text-align: left; padding: 22px 0; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 16px; transition: color 0.2s; }
        .faq-btn:hover { color: var(--gold); }
        .faq-answer { font-size: 14px; color: var(--text-dim); line-height: 1.75; padding-bottom: 20px; font-weight: 300; }
        @media (max-width: 900px) {
          .nav-links { display: none !important; }
        }
        @media (max-width: 768px) {
          .rate-row { grid-template-columns: 28px 1fr 80px 80px; padding: 10px 12px; gap: 6px; }
          .hero-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
          .services-grid { grid-template-columns: 1fr !important; }
          .hero-section { padding: 48px 20px 40px !important; min-height: auto !important; }
          .converter-box { padding: 20px !important; }
          .section-pad { padding-left: 20px !important; padding-right: 20px !important; }
        }
        @media (max-width: 400px) {
          .rate-row { grid-template-columns: 24px 1fr 70px 70px; padding: 9px 10px; gap: 4px; font-size: 13px; }
        }
      `}</style>

      {/* ── Nav ── */}
      <nav
        style={{
          background: "rgba(10,15,13,0.96)",
          borderBottom: "1px solid rgba(201,168,76,0.13)",
          padding: "16px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 100,
          backdropFilter: "blur(16px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.18em", color: "#C9A84C" }}>GAMAEX</span>
          <span style={{ width: 1, height: 16, background: "rgba(201,168,76,0.25)" }} />
          <span style={{ fontSize: 10, color: "#8A8780", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500 }}>Casa de cambio</span>
          {isOpen !== null && (
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
              padding: "3px 10px", borderRadius: 20,
              background: isOpen ? "rgba(46,204,113,0.1)" : "rgba(100,100,100,0.1)",
              border: `1px solid ${isOpen ? "rgba(46,204,113,0.3)" : "rgba(100,100,100,0.2)"}`,
              color: isOpen ? "#2ECC71" : "#6A6860",
            }}>
              {isOpen ? "● Abierto" : "○ Cerrado"}
            </span>
          )}
        </div>
        <div className="nav-links">
          <a href="#tasas" className="nav-link">Tasas</a>
          <a href="#servicios" className="nav-link">Servicios</a>
          <a href="#local" className="nav-link">Nuestro local</a>
          <a href="#testimonios" className="nav-link">Opiniones</a>
          <a href="#faq" className="nav-link">FAQ</a>
          <a href="#ubicacion" className="nav-link">Ubicación</a>
          <a
            href={wa()}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-wa"
            style={{ padding: "9px 18px", fontSize: 13, borderRadius: 8 }}
          >
            💬 WhatsApp
          </a>
        </div>
        {/* Mobile: solo botón WA */}
        <a
          href={wa()}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-wa"
          style={{ padding: "9px 16px", fontSize: 13, borderRadius: 8, display: "none" }}
          id="nav-wa-mobile"
        >
          💬
        </a>
        <style>{`@media (max-width: 900px) { #nav-wa-mobile { display: inline-flex !important; } }`}</style>
      </nav>

      {/* ── Hero ── */}
      <div className="hero-wrap">
      <section className="hero-section" style={{ padding: "96px 28px 88px", maxWidth: 1100, margin: "0 auto", minHeight: "calc(100vh - 57px)" }}>
        <div
          className="hero-grid"
          style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 64, alignItems: "center" }}
        >
          {/* Copy */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
              <div style={{ width: 28, height: 1, background: "#C9A84C", opacity: 0.7, flexShrink: 0 }} />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#C9A84C",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                }}
              >
                Casa de cambio · Providencia, Santiago
              </span>
            </div>
            <h1
              style={{
                fontSize: "clamp(38px, 4.5vw, 58px)",
                fontWeight: 700,
                lineHeight: 1.06,
                marginBottom: 22,
                letterSpacing: "-0.03em",
              }}
            >
              {h1Before}
              <span style={{ color: "#C9A84C" }}>{h1Accent}</span>
            </h1>
            <p
              style={{
                fontSize: 17,
                color: "#9A9890",
                lineHeight: 1.7,
                marginBottom: 12,
                maxWidth: 420,
                fontWeight: 300,
                letterSpacing: "0.01em",
              }}
            >
              {heroDesc}
            </p>
            <p style={{ fontSize: 14, color: "#6A7A70", marginBottom: 36, maxWidth: 380, lineHeight: 1.6 }}>
              Precios transparentes, sin comisiones ocultas. El precio que ves es el precio final.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 44 }}>
              <a
                href={wa()}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-wa"
                style={{ letterSpacing: "0.01em" }}
                onClick={() => track.whatsappClick("hero")}
              >
                💬 Consultar cotización
              </a>
              <a href="#ubicacion" className="cta-gold" style={{ letterSpacing: "0.01em" }}>
                📍 Cómo llegar
              </a>
            </div>
            {/* Trust signals */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 36 }}>
              {[
                { icon: "🏛", label: "Regulado UAF" },
                { icon: "✓", label: "Sin comisiones" },
                { icon: "⏱", label: "38 años de trayectoria" },
                { icon: "🔒", label: "Operaciones seguras" },
              ].map(({ icon, label }) => (
                <span
                  key={label}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11,
                    fontWeight: 500,
                    color: "#8A9A8E",
                    background: "rgba(46,204,113,0.05)",
                    border: "1px solid rgba(46,204,113,0.12)",
                    borderRadius: 20,
                    padding: "5px 12px",
                    letterSpacing: "0.02em",
                  }}
                >
                  <span style={{ fontSize: 12 }}>{icon}</span> {label}
                </span>
              ))}
            </div>

            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {[
                ["Lun–Vie", "9:00 – 17:30"],
                ["Sábado", "9:00 – 13:00"],
                ["Metro", "Pedro de Valdivia"],
              ].map(([label, value], i) => (
                <div key={i} style={{ borderLeft: "1px solid rgba(201,168,76,0.25)", paddingLeft: 14 }}>
                  <div
                    style={{
                      fontSize: 9,
                      color: "#6A6860",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: 4,
                      fontWeight: 600,
                    }}
                  >
                    {label}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#C8C6C0" }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Calculadora */}
          <div className="converter-box" id="calculadora">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
                paddingBottom: 20,
                borderBottom: "1px solid rgba(201,168,76,0.12)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 3, height: 18, background: "#C9A84C", borderRadius: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.01em" }}>Calculadora</span>
              </div>
              <span style={{ fontSize: 11, color: "#8A8780", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Precios del día
              </span>
            </div>

            {/* Popular pairs */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
              {[
                { from: "USD", to: "CLP", label: "USD→CLP" },
                { from: "EUR", to: "CLP", label: "EUR→CLP" },
                { from: "BRL", to: "CLP", label: "BRL→CLP" },
                { from: "CLP", to: "USD", label: "CLP→USD" },
              ].map((pair) => {
                const active = fromCurrency === pair.from && toCurrency === pair.to;
                return (
                  <button
                    key={pair.label}
                    onClick={() => { setFromCurrency(pair.from); setToCurrency(pair.to); track.calcUsed(pair.from, pair.to); }}
                    style={{
                      background: active ? "rgba(201,168,76,0.15)" : "rgba(42,51,48,0.8)",
                      border: `1px solid ${active ? "rgba(201,168,76,0.4)" : "rgba(42,51,48,1)"}`,
                      color: active ? "#C9A84C" : "#8A8780",
                      padding: "4px 10px",
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.15s",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    {pair.label}
                  </button>
                );
              })}
            </div>

            {/* Tengo */}
            <div style={{ marginBottom: 10 }}>
              <label
                style={{
                  fontSize: 11,
                  color: "#8A8780",
                  marginBottom: 7,
                  display: "block",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                }}
              >
                Tengo
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 8 }}>
                <input
                  className="conv-input"
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                  placeholder="1000"
                />
                <select
                  className="conv-select"
                  value={fromCurrency}
                  onChange={(e) => changeFrom(e.target.value)}
                >
                  {selectOptions.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag_emoji} {c.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap */}
            <div style={{ textAlign: "center", margin: "10px 0" }}>
              <button
                onClick={swap}
                style={{
                  background: "#1A2320",
                  border: "1px solid #2A3330",
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  cursor: "pointer",
                  fontSize: 16,
                  color: "#C9A84C",
                }}
              >
                ⇅
              </button>
            </div>

            {/* Quiero recibir */}
            <div style={{ marginBottom: 18 }}>
              <label
                style={{
                  fontSize: 11,
                  color: "#8A8780",
                  marginBottom: 7,
                  display: "block",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                }}
              >
                Quiero recibir
              </label>
              <select
                className="conv-select"
                value={toCurrency}
                onChange={(e) => changeTo(e.target.value)}
              >
                {selectOptions.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag_emoji} {c.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Resultado */}
            <div
              style={{
                background: "#070C0A",
                border: "1px solid rgba(201,168,76,0.35)",
                borderRadius: 14,
                padding: "20px 22px",
                marginBottom: 16,
                boxShadow: "inset 0 1px 0 rgba(201,168,76,0.08), 0 4px 20px rgba(0,0,0,0.3)",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#8A8780",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  fontWeight: 500,
                }}
              >
                Recibes aprox.
              </div>
              <div
                className="mono"
                style={{ fontSize: 32, fontWeight: 700, color: "#C9A84C", lineHeight: 1.05, letterSpacing: "-0.01em" }}
              >
                {hasResult
                  ? result.value.toLocaleString("es-CL", {
                      minimumFractionDigits: result.decimals,
                      maximumFractionDigits: result.decimals,
                    })
                  : "—"}{" "}
                <span style={{ fontSize: 14, fontWeight: 400, color: "#6A6860" }}>
                  {result.code}
                </span>
              </div>
              <div style={{ fontSize: 11, color: "#6A6860", marginTop: 10, lineHeight: 1.5 }}>
                Valor referencial. El precio final lo confirma un ejecutivo.
              </div>
            </div>

            <a
              href={wa(waCalcMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-wa"
              style={{ width: "100%", justifyContent: "center", display: "flex", borderRadius: 10 }}
              onClick={() => track.calcWaClick(fromCurrency, toCurrency, numAmount)}
            >
              💬 Consultar esta cotización
            </a>
            {hasResult && (
              <button
                onClick={copyShareLink}
                style={{
                  marginTop: 10,
                  width: "100%",
                  background: "transparent",
                  border: "1px solid rgba(201,168,76,0.2)",
                  borderRadius: 10,
                  color: copied ? "#2ECC71" : "#8A8780",
                  fontSize: 12,
                  padding: "9px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                }}
              >
                {copied ? "✓ Enlace copiado" : "🔗 Compartir cotización"}
              </button>
            )}
          </div>
        </div>
      </section>
      </div>

      {/* ── Cómo funciona ── */}
      <section
        id="como-funciona"
        data-anim
        className="section-pad"
        style={{ padding: "72px 28px 64px", maxWidth: 1100, margin: "0 auto", ...visStyle("como-funciona") }}
      >
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 10, color: "#C9A84C", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>
            El proceso
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.02em" }}>Tres pasos para operar</h2>
          <p style={{ fontSize: 13, color: "#8A8780", letterSpacing: "0.01em" }}>Sin reservas automáticas ni precios bloqueados — atención real, proceso claro</p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
          }}
        >
          {[
            {
              step: "01",
              icon: "🧮",
              title: "Calculá tu cotización",
              desc: "Usá la calculadora para estimar cuánto recibirías. El valor es referencial — el precio final lo confirma un ejecutivo.",
            },
            {
              step: "02",
              icon: "💬",
              title: "Consultá por WhatsApp",
              desc: "Escribinos con el monto y las monedas que querés operar. Te confirmamos precio real y disponibilidad.",
            },
            {
              step: "03",
              icon: "🏛",
              title: "Operamos en el local",
              desc: "Vienes a nuestra oficina en Providencia. Proceso rápido, atención directa y sin comisiones ocultas.",
            },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                background: "#111916",
                border: "1px solid #2A3330",
                borderRadius: 16,
                padding: "24px 22px",
              }}
            >
              <div
                className="mono"
                style={{ fontSize: 11, color: "#C9A84C", fontWeight: 700, letterSpacing: 2, marginBottom: 14 }}
              >
                {s.step}
              </div>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: "#8A8780", lineHeight: 1.65, fontWeight: 300 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tasas ── */}
      <section
        id="tasas"
        data-anim
        className="section-pad"
        style={{ padding: "72px 28px 72px", maxWidth: 1100, margin: "0 auto", ...visStyle("tasas") }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 24,
          }}
        >
          <div>
            <div style={{ fontSize: 10, color: "#C9A84C", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginBottom: 10 }}>
              Precios del día
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4, letterSpacing: "-0.025em" }}>Precios publicados</h2>
            <p style={{ fontSize: 13, color: "#8A8780" }}>
              Compra y venta en pesos chilenos (CLP)
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            {rates.length > 0 && lastSyncAt && (
              <div style={{ fontSize: 11, color: "#6A6860", letterSpacing: "0.04em" }}>
                Actualizado {new Date(lastSyncAt).toLocaleDateString("es-CL", { day: "numeric", month: "long" })}
              </div>
            )}
            {systemStatus === "stale" && (
              <div style={{ fontSize: 11, color: "#C0392B", background: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.2)", borderRadius: 6, padding: "3px 10px" }}>
                ⚠ Precios temporalmente no disponibles — consultar por WhatsApp
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            background: "#111916",
            border: "1px solid rgba(201,168,76,0.14)",
            borderRadius: 18,
            overflowX: "auto",
            boxShadow: "0 16px 48px rgba(0,0,0,0.3)",
          }}
        >
          <div className="rate-row" style={{ background: "#141E1B", borderBottom: "1px solid rgba(201,168,76,0.18)" }}>
            <span />
            <span style={{ fontSize: 10, color: "#8A8780", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
              Divisa
            </span>
            <span style={{ fontSize: 10, color: "#8A8780", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "right", fontWeight: 600 }}>
              Compramos
            </span>
            <span style={{ fontSize: 10, color: "#8A8780", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "right", fontWeight: 600 }}>
              Vendemos
            </span>
          </div>
          {rates.length === 0 ? (
            <div style={{ padding: "36px 20px", textAlign: "center", color: "#8A8780", fontSize: 13 }}>
              Cotizaciones no disponibles en este momento.{" "}
              <a
                href={wa()}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#C9A84C", textDecoration: "none" }}
              >
                Consultar por WhatsApp →
              </a>
            </div>
          ) : (
            rates.map((rate, i) => (
              <div
                key={rate.code}
                className="rate-row"
                onMouseEnter={() => setHoveredRate(i)}
                onMouseLeave={() => setHoveredRate(null)}
                onClick={() => { setFromCurrency(rate.code); setToCurrency("CLP"); document.getElementById("calculadora")?.scrollIntoView({ behavior: "smooth" }); }}
                style={{ cursor: "pointer" } as React.CSSProperties}
              >
                <span style={{ fontSize: 22 }}>{rate.flag_emoji}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: "0.01em" }}>{rate.name}</div>
                  <div style={{ fontSize: 10, color: "#6A6860", letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 2 }}>{rate.code}</div>
                </div>
                <div
                  className="mono"
                  style={{
                    textAlign: "right",
                    fontSize: 15,
                    fontWeight: 500,
                    color: hoveredRate === i ? "#34D27A" : "#2ECC71",
                    transition: "color 0.15s",
                  }}
                >
                  ${rate.buy.toLocaleString("es-CL", {
                    minimumFractionDigits: rate.buy < 1 ? rate.decimal_places : 0,
                    maximumFractionDigits: rate.buy < 1 ? rate.decimal_places : 0,
                  })}
                </div>
                <div className="mono" style={{ textAlign: "right", fontSize: 15, fontWeight: 500 }}>
                  ${rate.sell.toLocaleString("es-CL", {
                    minimumFractionDigits: rate.sell < 1 ? rate.decimal_places : 0,
                    maximumFractionDigits: rate.sell < 1 ? rate.decimal_places : 0,
                  })}
                </div>
              </div>
            ))
          )}
        </div>
        <p style={{ fontSize: 11, color: "#8A8780", marginTop: 12, textAlign: "center" }}>
          Cotización orientativa. Para confirmar precio y operar, consúltenos directamente.
        </p>
      </section>

      {/* ── Servicios ── */}
      <section
        id="servicios"
        data-anim
        style={{
          padding: "80px 28px",
          background: "#0D1511",
          borderTop: "1px solid rgba(201,168,76,0.1)",
          borderBottom: "1px solid rgba(201,168,76,0.1)",
          ...visStyle("servicios"),
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: 30, fontWeight: 700, marginBottom: 10, letterSpacing: "-0.02em" }}>Nuestros servicios</h2>
            <p style={{ fontSize: 14, color: "#8A8780", fontWeight: 300, letterSpacing: "0.01em" }}>
              38 años al servicio de personas y empresas en Chile
            </p>
          </div>
          <div
            className="services-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            {[
              {
                icon: "💱",
                title: "Cambio de Divisas",
                desc: "Más de 40 monedas disponibles. Precios publicados, sin comisiones ni cargos ocultos.",
              },
              {
                icon: "🌐",
                title: "Transferencias Internacionales",
                desc: "Envío y recepción de fondos al exterior. Asesoría personalizada para cada operación.",
              },
              {
                icon: "🏢",
                title: "Pago a Proveedores",
                desc: "Para empresas que operan o pagan en moneda extranjera. Condiciones especiales por volumen.",
              },
              {
                icon: "🔒",
                title: "Atención Preferencial",
                desc: "Oficinas privadas para operaciones de mayor monto. Discreción total y trato personalizado.",
              },
            ].map((s, i) => (
              <div key={i} className="service-card">
                <div style={{ fontSize: 32, marginBottom: 14 }}>{s.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: "#8A8780", lineHeight: 1.65, fontWeight: 300 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section
        data-anim
        id="trust"
        style={{
          padding: "80px 28px 88px",
          maxWidth: 960,
          margin: "0 auto",
          textAlign: "center",
          ...visStyle("trust"),
        }}
      >
        <div style={{ fontSize: 10, color: "#C9A84C", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginBottom: 48 }}>
          Por qué Gamaex
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 40,
          }}
        >
          {[
            ["38+", "Años de\ntrayectoria"],
            ["+40", "Monedas\ndisponibles"],
            ["Sin", "cargos\nadicionales"],
            ["Lun–Sáb", "Atención\npresencial"],
          ].map(([num, label], i) => (
            <div key={i} style={{ borderTop: "1px solid rgba(201,168,76,0.15)", paddingTop: 20 }}>
              <div className="mono" style={{ fontSize: 46, fontWeight: 700, color: "#C9A84C", lineHeight: 1, letterSpacing: "-0.02em" }}>
                {num}
              </div>
              <div style={{ fontSize: 11, color: "#8A8780", marginTop: 10, whiteSpace: "pre-line", lineHeight: 1.55, letterSpacing: "0.02em", textTransform: "uppercase" }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Video local ── */}
      <section
        id="local"
        data-anim
        className="section-pad"
        style={{
          padding: "56px 28px 80px",
          maxWidth: 1000,
          margin: "0 auto",
          ...visStyle("local"),
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "#C9A84C",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            Casa de cambio · Providencia
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 10, letterSpacing: "-0.02em", color: "#E8E6E1" }}>
            Conoce nuestro local
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "#8A8780",
              fontWeight: 300,
              maxWidth: 460,
              margin: "0 auto",
              lineHeight: 1.65,
            }}
          >
            Una casa de cambio familiar en el corazón de Providencia. Atención directa, sin intermediarios ni burocracia.
          </p>
        </div>

        <div
          style={{
            position: "relative",
            borderRadius: 20,
            overflow: "hidden",
            border: "1px solid rgba(201,168,76,0.22)",
            boxShadow:
              "0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(201,168,76,0.07), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <video
            src="/local.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            style={{ width: "100%", display: "block" }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 80,
              background: "linear-gradient(to top, rgba(10,15,13,0.55) 0%, transparent 100%)",
              pointerEvents: "none",
            }}
          />
        </div>
      </section>

      {/* ── Testimonios ── */}
      <section
        id="testimonios"
        data-anim
        className="section-pad"
        style={{
          padding: "72px 28px 80px",
          maxWidth: 1100,
          margin: "0 auto",
          ...visStyle("testimonios"),
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 10, color: "#C9A84C", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginBottom: 14 }}>
            Opiniones
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8 }}>Lo que dicen nuestros clientes</h2>
          <p style={{ fontSize: 13, color: "#8A8780" }}>Reseñas verificadas en Google Maps</p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {[
            {
              name: "Javier H. Wolnitzky",
              initial: "J",
              color: "#8B7355",
              badge: "Local Guide",
              text: "Solo un peso más caro por dólar, pero sin esperas. Además, aceptan dólares corrientes que no estén en circulación.",
            },
            {
              name: "Ignacio Jorquera",
              initial: "I",
              color: "#2E7D32",
              badge: null,
              text: "Muy buena atención, rápida y clara. Me explicaron bien el tipo de cambio y el proceso fue ordenado. Recomendado si buscas una casa de cambio en Providencia.",
            },
            {
              name: "Invertaz Ltda",
              initial: "I",
              color: "#1565C0",
              badge: null,
              text: "El mejor de Providencia.",
            },
            {
              name: "Matias Schwarc",
              initial: "M",
              color: "#AD1457",
              badge: null,
              text: "Rápido, el servicio espectacular, recomendable al 100%.",
            },
            {
              name: "Alan S.",
              initial: "A",
              color: "#4A6741",
              badge: null,
              text: "La mejor de Providencia.",
            },
          ].map((r, i) => (
            <div
              key={i}
              style={{
                background: "#111916",
                border: "1px solid #2A3330",
                borderRadius: 16,
                padding: "22px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                transition: "border-color 0.25s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2A3330")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: r.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 17,
                    fontWeight: 600,
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {r.initial}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#E8E6E1" }}>{r.name}</div>
                  {r.badge && (
                    <div style={{ fontSize: 11, color: "#8A8780", marginTop: 1 }}>{r.badge}</div>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", gap: 2 }}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} style={{ color: "#F9AB00", fontSize: 16 }}>★</span>
                ))}
              </div>
              <p style={{ fontSize: 14, color: "#C8C6C0", lineHeight: 1.65, margin: 0 }}>
                &ldquo;{r.text}&rdquo;
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#111916", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 40, padding: "12px 28px" }}>
            <span style={{ fontSize: 15, color: "#C9A84C" }}>✦</span>
            <span style={{ fontSize: 13, color: "#C8C6C0", letterSpacing: "0.04em", fontWeight: 500 }}>Testimonios reales de clientes</span>
            <span style={{ fontSize: 15, color: "#C9A84C" }}>✦</span>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section
        id="faq"
        data-anim
        style={{
          padding: "80px 28px",
          background: "#0D1511",
          borderTop: "1px solid rgba(201,168,76,0.1)",
          borderBottom: "1px solid rgba(201,168,76,0.1)",
          ...visStyle("faq"),
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 10, color: "#C9A84C", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginBottom: 14 }}>
              Preguntas frecuentes
            </div>
            <h2 style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.025em", marginBottom: 10 }}>
              Todo lo que necesitás saber
            </h2>
            <p style={{ fontSize: 14, color: "#8A8780", fontWeight: 300 }}>
              Respondemos las consultas más comunes antes de tu visita
            </p>
          </div>

          <div
            style={{
              background: "#111916",
              border: "1px solid rgba(201,168,76,0.14)",
              borderRadius: 18,
              overflow: "hidden",
              padding: "0 28px",
            }}
          >
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="faq-item">
                <button
                  className="faq-btn"
                  onClick={() => { setOpenFaq(openFaq === i ? null : i); if (openFaq !== i) track.faqOpen(item.q); }}
                  aria-expanded={openFaq === i}
                >
                  <span>{item.q}</span>
                  <span
                    style={{
                      color: "#C9A84C",
                      fontSize: 20,
                      flexShrink: 0,
                      transition: "transform 0.25s",
                      transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                      display: "inline-block",
                      lineHeight: 1,
                    }}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <p className="faq-answer">{item.a}</p>
                )}
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 36 }}>
            <p style={{ fontSize: 14, color: "#8A8780", marginBottom: 16 }}>
              ¿Tenés otra pregunta? Escribinos directamente.
            </p>
            <a href={wa("Hola, tengo una consulta sobre el servicio de Gamaex.")} target="_blank" rel="noopener noreferrer" className="cta-wa">
              💬 Consultar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── Ubicación ── */}
      <section
        id="ubicacion"
        style={{
          padding: "80px 28px 72px",
          background: "#0A0F0D",
        }}
      >
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#C9A84C", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginBottom: 16 }}>Ubicación</div>
          <h2 style={{ fontSize: 30, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.025em" }}>Cómo llegar</h2>
          <p style={{ fontSize: 22, color: "#C9A84C", fontWeight: 500, marginBottom: 4 }}>
            Av. Pedro de Valdivia 020
          </p>
          <p style={{ fontSize: 15, color: "#8A8780", marginBottom: 6 }}>
            Providencia, Santiago
          </p>
          <p style={{ fontSize: 13, color: "#6A6860", marginBottom: 28 }}>
            🚇 A pasos de Metro Pedro de Valdivia (Línea 1) · También cerca de Costanera Center
          </p>
          <div style={{ marginBottom: 36, borderRadius: 12, overflow: "hidden", border: "1px solid #2A2F2C" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!4v1776977116640!6m8!1m7!1sHiOUKwxtkdhLltTGtazSxA!2m2!1d-33.4232948606249!2d-70.6126826154358!3f219.86831397446946!4f0.2564110419943262!5f1.8039058824642895"
              width="100%"
              height="300"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Gamaex Chile — Av. Pedro de Valdivia 020, Providencia"
            />
          </div>

          {/* Botón Ver en Google Maps */}
          <div style={{ marginBottom: 32 }}>
            <a
              href="https://maps.google.com/?q=Av.+Pedro+de+Valdivia+020,+Providencia,+Santiago,+Chile"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track.mapsClick()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                color: "#8A8780",
                textDecoration: "none",
                border: "1px solid #2A3330",
                borderRadius: 8,
                padding: "9px 16px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(201,168,76,0.4)";
                (e.currentTarget as HTMLAnchorElement).style.color = "#C9A84C";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#2A3330";
                (e.currentTarget as HTMLAnchorElement).style.color = "#8A8780";
              }}
            >
              📍 Ver en Google Maps
            </a>
          </div>

          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: 40,
            }}
          >
            <a
              href={wa()}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-wa"
              style={{ fontSize: 16 }}
            >
              💬 Consultar por WhatsApp
            </a>
            <a href={`tel:${FIXED_PHONE.replace(/\s/g, "")}`} className="cta-gold" onClick={() => track.phoneClick()}>
              📞 Llamar al local
            </a>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 20,
            }}
          >
            {(
              [
                ["Lunes a Viernes", "9:00 – 17:30", false],
                ["Sábado", "9:00 – 13:00", false],
                ["Domingo", "Cerrado", true],
              ] as [string, string, boolean][]
            ).map(([day, hours, closed], i) => (
              <div
                key={i}
                style={{
                  background: "#090E0C",
                  border: "1px solid rgba(201,168,76,0.12)",
                  borderRadius: 14,
                  padding: "20px 22px",
                }}
              >
                <div style={{ fontSize: 10, color: "#6A6860", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>{day}</div>
                <div style={{ fontSize: 17, fontWeight: 600, color: closed ? "#C0392B" : "#E8E6E1", letterSpacing: closed ? "0" : "-0.01em" }}>
                  {hours}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: "44px 28px", borderTop: "1px solid rgba(201,168,76,0.15)", textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#C9A84C", letterSpacing: "0.18em", marginBottom: 10 }}>
          GAMAEX
        </div>
        <p style={{ fontSize: 12, color: "#8A8780", marginBottom: 4 }}>
          Inversiones y Turismo Gamaex Chile S.A.
        </p>
        <p style={{ fontSize: 12, color: "#8A8780", marginBottom: 16 }}>
          Av. Pedro de Valdivia 020, Providencia · Metro Pedro de Valdivia
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap", marginBottom: 16 }}>
          <a
            href={wa()}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 12, color: "#2ECC71", textDecoration: "none" }}
          >
            💬 Cotizaciones por WhatsApp
          </a>
          <a href={`tel:${FIXED_PHONE.replace(/\s/g, "")}`} style={{ fontSize: 12, color: "#8A8780", textDecoration: "none" }}>
            📞 {FIXED_PHONE} (fijo)
          </a>
          <a href="mailto:gamaex@gmail.com" style={{ fontSize: 12, color: "#8A8780", textDecoration: "none" }}>
            ✉ gamaex@gmail.com
          </a>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap", marginBottom: 16 }}>
          <a href="#tasas" style={{ fontSize: 11, color: "#4A5350", textDecoration: "none" }}>Tasas</a>
          <a href="#servicios" style={{ fontSize: 11, color: "#4A5350", textDecoration: "none" }}>Servicios</a>
          <a href="#faq" style={{ fontSize: 11, color: "#4A5350", textDecoration: "none" }}>Preguntas frecuentes</a>
          <a href="#ubicacion" style={{ fontSize: 11, color: "#4A5350", textDecoration: "none" }}>Ubicación</a>
        </div>
        <p style={{ fontSize: 11, color: "#4A5350" }}>
          © {new Date().getFullYear()} · Entidad regulada por la Unidad de Análisis Financiero (UAF)
        </p>
      </footer>

      <a
        className="float-wa"
        href={wa()}
        target="_blank"
        rel="noopener noreferrer"
        title="Consultar cotización por WhatsApp"
        aria-label="Consultar por WhatsApp"
      >
        💬
      </a>
    </div>
  );
}
