"use client";

import { useState } from "react";

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
    <main className="hc-wrap">
      <header className="hc-top">
        <a href="/" className="hc-brand" aria-label="Gamaex — inicio">
          <span className="hc-logo">GAMAEX</span>
          <span className="hc-sub">Casa de cambio · Providencia</span>
        </a>
        <a href="/servicios" className="hc-back">← Servicios</a>
      </header>

      <section className="hc-card">
        {status === "ok" ? (
          <div className="hc-success" role="status">
            <div className="hc-check">✓</div>
            <h1>¡Solicitud recibida!</h1>
            <p>
              Gracias. Te vamos a contactar a la brevedad para validar tu registro y contarte los
              pasos para operar como cliente de Gamaex.
            </p>
            <a className="hc-btn" href="/">Ir al inicio</a>
          </div>
        ) : (
          <>
            <div className="hc-head">
              <p className="hc-eyebrow">Hazte cliente</p>
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
                  <button type="button" className={tipo === "persona" ? "on" : ""} aria-pressed={tipo === "persona"} onClick={() => setTipo("persona")}>
                    Persona
                  </button>
                  <button type="button" className={tipo === "empresa" ? "on" : ""} aria-pressed={tipo === "empresa"} onClick={() => setTipo("empresa")}>
                    Empresa
                  </button>
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
                  {INTERESES.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
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
      </section>

      <footer className="hc-foot">Av. Pedro de Valdivia 020, Providencia · Lun–Vie 9:00–17:00 · Sáb 9:00–13:00</footer>

      <style jsx>{`
        .hc-wrap { min-height: 100vh; background: #faf8f2; color: #16181c; display: flex; flex-direction: column; align-items: center; padding: 20px 16px 40px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
        .hc-top { width: 100%; max-width: 620px; display: flex; align-items: center; justify-content: space-between; padding: 6px 0 22px; }
        .hc-brand { text-decoration: none; display: flex; flex-direction: column; }
        .hc-logo { color: #0f1419; font-weight: 800; letter-spacing: 0.2em; font-size: 18px; }
        .hc-sub { color: #8a8f97; font-size: 12px; margin-top: 2px; }
        .hc-back { color: #9c7e2e; text-decoration: none; font-size: 14px; font-weight: 600; }
        .hc-card { width: 100%; max-width: 620px; background: #fff; border: 1px solid #e8e4d6; border-radius: 16px; padding: 28px; box-shadow: 0 8px 30px rgba(15,20,25,0.05); }
        .hc-eyebrow { text-transform: uppercase; letter-spacing: 0.16em; font-size: 12px; font-weight: 700; color: #c9781a; margin: 0 0 10px; }
        .hc-head h1 { font-size: 25px; margin: 0 0 8px; letter-spacing: -0.01em; }
        .hc-lede { color: #5b6069; margin: 0 0 22px; font-size: 15px; }
        form { display: flex; flex-direction: column; gap: 16px; }
        fieldset { border: 0; padding: 0; margin: 0; }
        legend { font-size: 13px; font-weight: 600; color: #6b6f76; margin-bottom: 8px; padding: 0; }
        .hc-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .hc-toggle button { padding: 14px; border-radius: 12px; border: 1.5px solid #e0dccb; background: #fbfaf6; color: #0f1419; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
        .hc-toggle button:hover { border-color: #c9a84c; }
        .hc-toggle button.on { background: #0f1419; color: #fff; border-color: #0f1419; }
        .hc-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .hc-field { display: flex; flex-direction: column; gap: 6px; }
        .hc-field > span { font-size: 13px; font-weight: 600; color: #4b5058; }
        .hc-field em { color: #9aa0a6; font-style: normal; font-weight: 400; }
        .hc-field input, .hc-field select, .hc-field textarea { border: 1.5px solid #e0dccb; border-radius: 10px; padding: 12px 13px; font-size: 15px; color: #0f1419; background: #fff; width: 100%; box-sizing: border-box; font-family: inherit; transition: border-color 0.15s; }
        .hc-field input:focus, .hc-field select:focus, .hc-field textarea:focus { outline: none; border-color: #c9a84c; box-shadow: 0 0 0 3px rgba(201,168,76,0.15); }
        .hc-field textarea { resize: vertical; }
        .hc-hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }
        .hc-alert { background: #fdecec; border: 1px solid #f5c2c2; color: #9b1c1c; border-radius: 10px; padding: 11px 13px; font-size: 14px; }
        .hc-submit { margin-top: 4px; padding: 15px; border: 0; border-radius: 12px; background: #c9a84c; color: #0f1419; font-size: 16px; font-weight: 700; cursor: pointer; transition: background 0.15s; }
        .hc-submit:hover:not(:disabled) { background: #b8952f; }
        .hc-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .hc-legal { text-align: center; color: #9aa0a6; font-size: 12px; margin: 4px 0 0; }
        .hc-success { text-align: center; padding: 12px 0; }
        .hc-check { width: 56px; height: 56px; border-radius: 50%; background: #e8f5ec; color: #16a34a; font-size: 30px; font-weight: 700; line-height: 56px; margin: 0 auto 16px; }
        .hc-success h1 { font-size: 24px; margin: 0 0 8px; }
        .hc-success p { color: #5b6069; margin: 0 auto 22px; max-width: 400px; font-size: 15px; }
        .hc-btn { display: inline-block; background: #c9a84c; color: #0f1419; text-decoration: none; padding: 12px 22px; border-radius: 10px; font-weight: 700; }
        .hc-foot { color: #9aa0a6; font-size: 12px; margin-top: 22px; text-align: center; }
        @media (max-width: 520px) { .hc-card { padding: 22px 18px; } .hc-row { grid-template-columns: 1fr; } .hc-head h1 { font-size: 22px; } }
      `}</style>
    </main>
  );
}
