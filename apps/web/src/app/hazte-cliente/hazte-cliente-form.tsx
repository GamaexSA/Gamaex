"use client";

import { useState } from "react";
import SiteNav from "@/components/site-nav";

type Tipo = "persona" | "empresa";
type Status = "idle" | "sending" | "ok" | "error";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RX = /^\+?[\d\s()-]{7,20}$/;

const INTERESES = [
  "Compra y venta de divisas",
  "Transferencias internacionales",
  "Pago de tarjetas de crédito",
  "Pago a proveedores (empresa)",
  "Otro",
];

export default function HazteClienteForm() {
  const [tipo, setTipo] = useState<Tipo>("persona");
  const [nombre, setNombre] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [interes, setInteres] = useState(INTERESES[0]);
  const [mensaje, setMensaje] = useState("");
  const [empresa, setEmpresa] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const canSubmit =
    nombre.trim().length >= 2 &&
    rut.trim().length >= 6 &&
    EMAIL_RX.test(email.trim()) &&
    PHONE_RX.test(telefono.trim()) &&
    status !== "sending";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/hazte-cliente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, nombre, rut, email, telefono, interes, mensaje, empresa }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) setStatus("ok");
      else {
        setStatus("error");
        setError(data.error ?? "No pudimos enviar la solicitud. Intenta de nuevo.");
      }
    } catch {
      setStatus("error");
      setError("Problema de conexión. Revisa tu internet e intenta de nuevo.");
    }
  }

  return (
    <div className="hc-root">
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <linearGradient id="gxLogoGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8C76E" />
            <stop offset="50%" stopColor="#C9A84C" />
            <stop offset="100%" stopColor="#9C7E2E" />
          </linearGradient>
        </defs>
      </svg>

      <SiteNav cta="whatsapp" />

      <main className="hc-main">
        <div className="hc-card">
          {status === "ok" ? (
            <div className="hc-success" role="status">
              <div className="hc-check" aria-hidden="true">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5l5 5L20 6" /></svg>
              </div>
              <h1>Solicitud recibida</h1>
              <p>
                Gracias. Te vamos a contactar a la brevedad para validar tu registro y contarte los
                pasos para operar como cliente de Gamaex.
              </p>
              <a className="hc-btn-gold" href="/">Volver al inicio</a>
            </div>
          ) : (
            <>
              <div className="hc-head">
                <span className="hc-tag">Hazte cliente</span>
                <h1>Opera con Gamaex como cliente registrado</h1>
                <p className="hc-lede">
                  Déjanos tus datos y te contactamos para validar el registro. La verificación de
                  identidad se coordina en ese momento — no subas documentos por acá.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <fieldset className="hc-op">
                  <legend>¿Cómo te registras?</legend>
                  <div className="hc-toggle">
                    <button type="button" className={tipo === "persona" ? "on" : ""} aria-pressed={tipo === "persona"} onClick={() => setTipo("persona")}>Persona</button>
                    <button type="button" className={tipo === "empresa" ? "on" : ""} aria-pressed={tipo === "empresa"} onClick={() => setTipo("empresa")}>Empresa</button>
                  </div>
                </fieldset>

                <div className="hc-row">
                  <label className="hc-field">
                    <span>{tipo === "empresa" ? "Razón social" : "Nombre y apellido"}</span>
                    <input value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete={tipo === "empresa" ? "organization" : "name"} />
                  </label>
                  <label className="hc-field">
                    <span>RUT {tipo === "empresa" ? "de la empresa" : ""}</span>
                    <input value={rut} onChange={(e) => setRut(e.target.value)} placeholder="12.345.678-9" />
                  </label>
                </div>

                <div className="hc-row">
                  <label className="hc-field">
                    <span>Email</span>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="tu@correo.cl" />
                  </label>
                  <label className="hc-field">
                    <span>Teléfono / WhatsApp</span>
                    <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} autoComplete="tel" placeholder="+56 9 ..." />
                  </label>
                </div>

                <label className="hc-field">
                  <span>¿Qué necesitas principalmente?</span>
                  <select value={interes} onChange={(e) => setInteres(e.target.value)}>
                    {INTERESES.map((i) => (<option key={i} value={i}>{i}</option>))}
                  </select>
                </label>

                <label className="hc-field">
                  <span>Mensaje <em>(opcional)</em></span>
                  <textarea rows={3} maxLength={800} value={mensaje} onChange={(e) => setMensaje(e.target.value)} placeholder="Cuéntanos brevemente qué operaciones harías (opcional)" />
                </label>

                <input className="hc-hp" tabIndex={-1} autoComplete="off" value={empresa} onChange={(e) => setEmpresa(e.target.value)} aria-hidden="true" />

                {status === "error" && <div className="hc-alert" role="alert">{error}</div>}

                <button type="submit" className="hc-submit" disabled={!canSubmit}>
                  {status === "sending" ? "Enviando…" : "Enviar solicitud"}
                </button>
                <p className="hc-legal">Tus datos se usan solo para contactarte y validar tu registro como cliente.</p>
              </form>
            </>
          )}
        </div>
      </main>

      <footer className="hc-footer">
        <svg className="hc-footer-logo" viewBox="0 0 800 280" width="211" height="74" aria-hidden="true">
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
        <p className="hc-footer-addr">Av. Pedro de Valdivia 020, Providencia, Santiago · Lun–Vie 9:00–17:00 · Sáb 9:00–13:00</p>
        <a href="/servicios" className="hc-footer-back">← Ver servicios</a>
      </footer>

      <style jsx>{`
        .hc-root {
          --gold-light: #e8c76e; --gold: #c9a84c; --gold-deep: #9c7e2e;
          --dark: #0f1419; --dark-2: #1a1f26; --gray: #6b7280;
          --light: #faf8f2; --white: #fff; --border: #e8e4d6;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          color: var(--dark); background: var(--white); line-height: 1.5; -webkit-font-smoothing: antialiased;
          min-height: 100vh; display: flex; flex-direction: column;
        }
        .hc-nav { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.94); backdrop-filter: blur(14px); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 6%; height: 86px; }
        .hc-logo { display: flex; align-items: center; }
        .hc-logo svg { height: 58px; width: auto; }
        .hc-nav-links { display: flex; gap: 2rem; list-style: none; margin: 0; padding: 0; }
        .hc-nav-links a { font-size: 0.92rem; font-weight: 500; color: var(--gray); text-decoration: none; transition: color 0.2s; }
        .hc-nav-links a:hover { color: var(--dark); }
        .hc-cta-dark { background: var(--dark); color: var(--white); padding: 0.65rem 1.5rem; border-radius: 50px; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
        .hc-cta-dark:hover { background: var(--dark-2); }

        .hc-main { flex: 1; display: flex; justify-content: center; padding: 3.5rem 6% 4rem; background: linear-gradient(180deg, var(--white) 0%, var(--light) 100%); }
        .hc-card { width: 100%; max-width: 640px; background: var(--white); border: 1.5px solid var(--border); border-radius: 22px; padding: 2.6rem; box-shadow: 0 20px 60px rgba(15,20,25,0.07); align-self: flex-start; }
        .hc-tag { display: inline-block; padding: 0.45rem 1rem; border-radius: 50px; background: rgba(201,168,76,0.15); color: var(--gold-deep); font-size: 0.78rem; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase; margin-bottom: 1rem; }
        .hc-head h1 { font-family: "Cormorant Garamond", Georgia, serif; font-size: clamp(1.9rem, 3.6vw, 2.6rem); font-weight: 600; letter-spacing: -0.5px; line-height: 1.1; margin: 0 0 0.7rem; color: var(--dark); }
        .hc-lede { color: var(--gray); margin: 0 0 1.8rem; font-size: 1rem; line-height: 1.6; }

        form { display: flex; flex-direction: column; gap: 16px; }
        fieldset { border: 0; padding: 0; margin: 0; }
        legend { font-size: 0.78rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--gold-deep); margin-bottom: 10px; padding: 0; }
        .hc-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .hc-toggle button { padding: 14px; border-radius: 12px; border: 1.5px solid var(--border); background: var(--light); color: var(--dark); font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.18s; font-family: inherit; }
        .hc-toggle button:hover { border-color: var(--gold); }
        .hc-toggle button.on { background: var(--dark); color: var(--white); border-color: var(--dark); }
        .hc-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .hc-field { display: flex; flex-direction: column; gap: 6px; }
        .hc-field > span { font-size: 0.82rem; font-weight: 600; color: #4b5058; }
        .hc-field em { color: #9aa0a6; font-style: normal; font-weight: 400; }
        .hc-field input, .hc-field select, .hc-field textarea { border: 1.5px solid var(--border); border-radius: 11px; padding: 12px 14px; font-size: 15px; color: var(--dark); background: var(--white); width: 100%; box-sizing: border-box; font-family: inherit; transition: border-color 0.15s, box-shadow 0.15s; }
        .hc-field input:focus, .hc-field select:focus, .hc-field textarea:focus { outline: none; border-color: var(--gold); box-shadow: 0 0 0 3px rgba(201,168,76,0.16); }
        .hc-field textarea { resize: vertical; }
        .hc-hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }
        .hc-alert { background: #fdecec; border: 1px solid #f5c2c2; color: #9b1c1c; border-radius: 11px; padding: 11px 14px; font-size: 14px; }
        .hc-submit { margin-top: 4px; padding: 15px; border: 0; border-radius: 12px; background: var(--gold); color: var(--dark); font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .hc-submit:hover:not(:disabled) { background: var(--gold-deep); color: var(--white); transform: translateY(-2px); box-shadow: 0 10px 24px rgba(201,168,76,0.3); }
        .hc-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .hc-legal { text-align: center; color: #9aa0a6; font-size: 12px; margin: 4px 0 0; }

        .hc-success { text-align: center; padding: 16px 0; }
        .hc-check { width: 60px; height: 60px; border-radius: 50%; background: rgba(201,168,76,0.16); color: var(--gold-deep); display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; }
        .hc-success h1 { font-family: "Cormorant Garamond", Georgia, serif; font-size: 2rem; font-weight: 600; margin: 0 0 10px; }
        .hc-success p { color: var(--gray); margin: 0 auto 22px; max-width: 420px; font-size: 15px; line-height: 1.65; }
        .hc-btn-gold { display: inline-block; background: var(--gold); color: var(--dark); text-decoration: none; padding: 13px 26px; border-radius: 12px; font-weight: 700; transition: all 0.2s; }
        .hc-btn-gold:hover { background: var(--gold-deep); color: var(--white); }

        .hc-footer { background: var(--dark); color: var(--white); padding: 3.4rem 6% 2.2rem; text-align: center; }
        .hc-footer-logo { height: 74px; width: auto; margin-bottom: 1rem; }
        .hc-footer-addr { color: rgba(255,255,255,0.6); font-size: 0.9rem; margin: 0 0 1rem; }
        .hc-footer-back { color: var(--gold-light); text-decoration: none; font-size: 0.9rem; font-weight: 600; }

        @media (max-width: 780px) {
          .hc-nav-links { display: none; }
          .hc-nav { padding: 0 5%; height: 72px; }
          .hc-logo svg { height: 48px; }
          .hc-card { padding: 1.8rem 1.4rem; }
          .hc-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
