"use client";

import { useState, useEffect } from "react";
import type { PublicRate } from "@gamaex/types";

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

interface Props {
  rates: PublicRate[];
  systemStatus: string;
  lastSyncAt: string;
}

export default function LandingPage({ rates, lastSyncAt }: Props) {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CLP");
  const [amount, setAmount] = useState("1000");
  const [hoveredRate, setHoveredRate] = useState<number | null>(null);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

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
    setFromCurrency(next);
    if (next === toCurrency) {
      setToCurrency(next === "CLP" ? (rates[0]?.code ?? "USD") : "CLP");
    }
  }

  function changeTo(next: string) {
    setToCurrency(next);
    if (next === fromCurrency) {
      setFromCurrency(next === "CLP" ? (rates[0]?.code ?? "USD") : "CLP");
    }
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
          cursor: default; gap: 12px;
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
        @media (max-width: 900px) {
          .nav-links { display: none !important; }
        }
        @media (max-width: 768px) {
          .rate-row { grid-template-columns: 32px 1fr 90px 90px; padding: 11px 14px; gap: 8px; }
          .hero-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
          .services-grid { grid-template-columns: 1fr !important; }
          .hero-section { padding: 48px 20px 40px !important; min-height: auto !important; }
          .converter-box { padding: 20px !important; }
          .section-pad { padding-left: 20px !important; padding-right: 20px !important; }
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
        </div>
        <div className="nav-links">
          <a href="#tasas" className="nav-link">Tasas</a>
          <a href="#servicios" className="nav-link">Servicios</a>
          <a href="#local" className="nav-link">Nuestro local</a>
          <a href="#testimonios" className="nav-link">Opiniones</a>
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
              Compra y venta de{" "}
              <span style={{ color: "#C9A84C" }}>divisas en Santiago</span>
            </h1>
            <p
              style={{
                fontSize: 17,
                color: "#9A9890",
                lineHeight: 1.7,
                marginBottom: 36,
                maxWidth: 420,
                fontWeight: 300,
                letterSpacing: "0.01em",
              }}
            >
              38 años de trayectoria en Providencia. Atención presencial, precios transparentes y sin comisiones ocultas.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 44 }}>
              <a
                href={wa()}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-wa"
                style={{ letterSpacing: "0.01em" }}
              >
                💬 Consultar cotización
              </a>
              <a href="#ubicacion" className="cta-gold" style={{ letterSpacing: "0.01em" }}>
                📍 Cómo llegar
              </a>
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
          <div className="converter-box">
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
            >
              💬 Consultar esta cotización
            </a>
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
              desc: "Venís a nuestra oficina en Providencia. Proceso rápido, atención directa y sin comisiones ocultas.",
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
          {rates.length > 0 && lastSyncAt && (
            <div style={{ fontSize: 11, color: "#6A6860", letterSpacing: "0.04em", paddingBottom: 2 }}>
              Actualizado {new Date(lastSyncAt).toLocaleDateString("es-CL", { day: "numeric", month: "long" })}
            </div>
          )}
        </div>

        <div
          style={{
            background: "#111916",
            border: "1px solid rgba(201,168,76,0.14)",
            borderRadius: 18,
            overflow: "hidden",
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
                    minimumFractionDigits: rate.decimal_places,
                    maximumFractionDigits: rate.decimal_places,
                  })}
                </div>
                <div className="mono" style={{ textAlign: "right", fontSize: 15, fontWeight: 500 }}>
                  ${rate.sell.toLocaleString("es-CL", {
                    minimumFractionDigits: rate.decimal_places,
                    maximumFractionDigits: rate.decimal_places,
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
                "{r.text}"
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "#111916", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 40, padding: "12px 28px" }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#E8E6E1", letterSpacing: "-0.02em" }}>5.0</span>
            <div style={{ display: "flex", gap: 2 }}>
              {Array.from({ length: 5 }).map((_, j) => (
                <span key={j} style={{ color: "#F9AB00", fontSize: 15 }}>★</span>
              ))}
            </div>
            <span style={{ fontSize: 11, color: "#8A8780", letterSpacing: "0.04em" }}>en Google Maps</span>
          </div>
        </div>
      </section>

      {/* ── Ubicación ── */}
      <section
        id="ubicacion"
        style={{
          padding: "80px 28px 72px",
          background: "#0D1511",
          borderTop: "1px solid rgba(201,168,76,0.1)",
        }}
      >
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#C9A84C", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginBottom: 16 }}>Ubicación</div>
          <h2 style={{ fontSize: 30, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.025em" }}>Encuéntranos</h2>
          <p style={{ fontSize: 22, color: "#C9A84C", fontWeight: 500, marginBottom: 4 }}>
            Av. Pedro de Valdivia 020
          </p>
          <p style={{ fontSize: 15, color: "#8A8780", marginBottom: 12 }}>
            Providencia, Santiago · Metro Pedro de Valdivia
          </p>
          <a
            href="https://maps.google.com/?q=Av+Pedro+de+Valdivia+020,+Providencia,+Santiago"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-block", fontSize: 13, color: "#C9A84C", textDecoration: "none", marginBottom: 16, opacity: 0.85 }}
          >
            Ver en Google Maps →
          </a>
          <div style={{ marginBottom: 36, borderRadius: 12, overflow: "hidden", border: "1px solid #2A2F2C" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!4v1776975132724!6m8!1m7!1sHiOUKwxtkdhLltTGtazSxA!2m2!1d-33.4232948606249!2d-70.6126826154358!3f211.72070402856832!4f-0.10699491030922559!5f1.8412259963801398"
              width="100%"
              height="300"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
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
            <a href={`tel:${FIXED_PHONE.replace(/\s/g, "")}`} className="cta-gold">
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
      >
        💬
      </a>
    </div>
  );
}
