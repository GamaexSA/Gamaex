"use client";

import { useState } from "react";

export interface MonedaOption {
  code: string;
  name: string;
  flag: string;
}

type Operacion = "comprar" | "vender";
type Status = "idle" | "sending" | "ok" | "error";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RX = /^\+?[\d\s()-]{7,20}$/;

// Fallback si no llegan monedas desde las tasas en vivo (ej. embebido sin datos).
const DEFAULT_MONEDAS: MonedaOption[] = [
  { code: "USD", name: "Dólar estadounidense", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "ARS", name: "Peso argentino", flag: "🇦🇷" },
  { code: "BRL", name: "Real brasileño", flag: "🇧🇷" },
  { code: "GBP", name: "Libra esterlina", flag: "🇬🇧" },
  { code: "PEN", name: "Sol peruano", flag: "🇵🇪" },
];

export default function ContactoForm({
  monedas,
  embedded = false,
}: {
  monedas: MonedaOption[];
  embedded?: boolean;
}) {
  const opts = monedas.length ? monedas : DEFAULT_MONEDAS;
  const [operacion, setOperacion] = useState<Operacion>("comprar");
  const [moneda, setMoneda] = useState(opts[0]?.code ?? "USD");
  const [cantidad, setCantidad] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [empresa, setEmpresa] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const montoNum = parseFloat(cantidad.replace(/\./g, "").replace(",", "."));
  const canSubmit =
    !!moneda &&
    montoNum > 0 &&
    nombre.trim().length >= 2 &&
    apellido.trim().length >= 2 &&
    EMAIL_RX.test(email.trim()) &&
    PHONE_RX.test(telefono.trim()) &&
    status !== "sending";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operacion,
          moneda,
          cantidad,
          nombre,
          apellido,
          email,
          telefono,
          mensaje,
          empresa,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setStatus("ok");
      } else {
        setStatus("error");
        setError(data.error ?? "No pudimos enviar la solicitud. Intenta de nuevo.");
      }
    } catch {
      setStatus("error");
      setError("Problema de conexión. Revisa tu internet e intenta de nuevo.");
    }
  }

  function resetForm() {
    setCantidad("");
    setNombre("");
    setApellido("");
    setEmail("");
    setTelefono("");
    setMensaje("");
    setStatus("idle");
    setError("");
  }

  return (
    <main className={embedded ? "ct-wrap ct-embedded" : "ct-wrap"}>
      {!embedded && (
        <header className="ct-top">
          <a href="/" className="ct-brand" aria-label="Volver a Gamaex">
            <span className="ct-logo">GAMAEX</span>
            <span className="ct-sub">Casa de cambio · Providencia</span>
          </a>
          <a href="/" className="ct-back">← Volver al inicio</a>
        </header>
      )}

      <section className="ct-card">
        {status === "ok" ? (
          <div className="ct-success" role="status">
            <div className="ct-check">✓</div>
            <h1>¡Solicitud enviada!</h1>
            <p>
              Recibimos tus datos. Te contactamos a la brevedad con el precio final y la
              disponibilidad. Gracias por preferir Gamaex.
            </p>
            <div className="ct-success-actions">
              <button type="button" className="ct-btn-ghost" onClick={resetForm}>
                Enviar otra solicitud
              </button>
              <a className="ct-btn" href="/">Ir al inicio</a>
            </div>
          </div>
        ) : (
          <>
            <div className="ct-head">
              <h1>Cotiza tu cambio</h1>
              <p>Déjanos tus datos y te contactamos con el precio final. Sin compromiso.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <fieldset className="ct-op">
                <legend>¿Qué necesitas?</legend>
                <div className="ct-toggle">
                  <button
                    type="button"
                    className={operacion === "comprar" ? "on" : ""}
                    aria-pressed={operacion === "comprar"}
                    onClick={() => setOperacion("comprar")}
                  >
                    Quiero comprar
                  </button>
                  <button
                    type="button"
                    className={operacion === "vender" ? "on" : ""}
                    aria-pressed={operacion === "vender"}
                    onClick={() => setOperacion("vender")}
                  >
                    Quiero vender
                  </button>
                </div>
              </fieldset>

              <div className="ct-row">
                <label className="ct-field">
                  <span>Moneda</span>
                  <select value={moneda} onChange={(e) => setMoneda(e.target.value)}>
                    {opts.map((m) => (
                      <option key={m.code} value={m.code}>
                        {m.flag} {m.code} — {m.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="ct-field">
                  <span>Monto (en {moneda})</span>
                  <input
                    inputMode="decimal"
                    placeholder="Ej: 1.000"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value.replace(/[^\d.,]/g, ""))}
                  />
                </label>
              </div>

              <div className="ct-row">
                <label className="ct-field">
                  <span>Nombre</span>
                  <input value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="given-name" />
                </label>
                <label className="ct-field">
                  <span>Apellido</span>
                  <input value={apellido} onChange={(e) => setApellido(e.target.value)} autoComplete="family-name" />
                </label>
              </div>

              <div className="ct-row">
                <label className="ct-field">
                  <span>Email</span>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="tu@correo.cl" />
                </label>
                <label className="ct-field">
                  <span>Teléfono / WhatsApp</span>
                  <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} autoComplete="tel" placeholder="+56 9 ..." />
                </label>
              </div>

              <label className="ct-field">
                <span>Mensaje <em>(opcional)</em></span>
                <textarea
                  rows={3}
                  maxLength={800}
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="¿Algo que debamos saber? (opcional)"
                />
              </label>

              {/* honeypot anti-spam: oculto para humanos */}
              <input
                className="ct-hp"
                tabIndex={-1}
                autoComplete="off"
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                aria-hidden="true"
              />

              {status === "error" && <div className="ct-alert" role="alert">{error}</div>}

              <button type="submit" className="ct-submit" disabled={!canSubmit}>
                {status === "sending" ? "Enviando…" : "Enviar solicitud"}
              </button>

              <p className="ct-legal">
                Tus datos solo se usan para contactarte por esta cotización.
              </p>
            </form>
          </>
        )}
      </section>

      {!embedded && (
        <footer className="ct-foot">
          Av. Pedro de Valdivia 020, Providencia · Lun–Vie 9:00–17:30 · Sáb 9:00–13:00
        </footer>
      )}

      <style jsx>{`
        .ct-wrap {
          min-height: 100vh;
          background: #faf8f2;
          color: #0f1419;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 16px 40px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .ct-embedded {
          min-height: auto;
          padding: 0;
          background: transparent;
        }
        .ct-top {
          width: 100%;
          max-width: 560px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 0 22px;
        }
        .ct-brand { text-decoration: none; display: flex; flex-direction: column; }
        .ct-logo { color: #0f1419; font-weight: 800; letter-spacing: 0.2em; font-size: 18px; }
        .ct-sub { color: #8a8f97; font-size: 12px; margin-top: 2px; }
        .ct-back { color: #9c7e2e; text-decoration: none; font-size: 14px; font-weight: 600; }
        .ct-back:hover { text-decoration: underline; }
        .ct-card {
          width: 100%;
          max-width: 560px;
          background: #fff;
          border: 1px solid #e8e4d6;
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 8px 30px rgba(15, 20, 25, 0.05);
        }
        .ct-head h1 { font-size: 26px; margin: 0 0 6px; letter-spacing: -0.01em; }
        .ct-head p { color: #6b6f76; margin: 0 0 22px; font-size: 15px; }
        form { display: flex; flex-direction: column; gap: 16px; }
        fieldset { border: 0; padding: 0; margin: 0; }
        legend { font-size: 13px; font-weight: 600; color: #6b6f76; margin-bottom: 8px; padding: 0; }
        .ct-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .ct-toggle button {
          padding: 14px; border-radius: 12px; border: 1.5px solid #e0dccb;
          background: #fbfaf6; color: #0f1419; font-size: 15px; font-weight: 600;
          cursor: pointer; transition: all 0.15s;
        }
        .ct-toggle button:hover { border-color: #c9a84c; }
        .ct-toggle button.on { background: #0f1419; color: #fff; border-color: #0f1419; }
        .ct-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .ct-field { display: flex; flex-direction: column; gap: 6px; }
        .ct-field > span { font-size: 13px; font-weight: 600; color: #4b5058; }
        .ct-field em { color: #9aa0a6; font-style: normal; font-weight: 400; }
        .ct-field input, .ct-field select, .ct-field textarea {
          border: 1.5px solid #e0dccb; border-radius: 10px; padding: 12px 13px;
          font-size: 15px; color: #0f1419; background: #fff; width: 100%;
          box-sizing: border-box; font-family: inherit; transition: border-color 0.15s;
        }
        .ct-field input:focus, .ct-field select:focus, .ct-field textarea:focus {
          outline: none; border-color: #c9a84c; box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.15);
        }
        .ct-field textarea { resize: vertical; }
        .ct-hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }
        .ct-alert {
          background: #fdecec; border: 1px solid #f5c2c2; color: #9b1c1c;
          border-radius: 10px; padding: 11px 13px; font-size: 14px;
        }
        .ct-submit {
          margin-top: 4px; padding: 15px; border: 0; border-radius: 12px;
          background: #c9a84c; color: #0f1419; font-size: 16px; font-weight: 700;
          cursor: pointer; transition: background 0.15s;
        }
        .ct-submit:hover:not(:disabled) { background: #b8952f; }
        .ct-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .ct-legal { text-align: center; color: #9aa0a6; font-size: 12px; margin: 4px 0 0; }
        .ct-success { text-align: center; padding: 12px 0; }
        .ct-check {
          width: 56px; height: 56px; border-radius: 50%; background: #e8f5ec;
          color: #16a34a; font-size: 30px; font-weight: 700; line-height: 56px;
          margin: 0 auto 16px;
        }
        .ct-success h1 { font-size: 24px; margin: 0 0 8px; }
        .ct-success p { color: #6b6f76; margin: 0 auto 22px; max-width: 400px; font-size: 15px; }
        .ct-success-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .ct-btn, .ct-btn-ghost {
          text-decoration: none; padding: 12px 20px; border-radius: 10px;
          font-size: 15px; font-weight: 600; cursor: pointer; border: 1.5px solid transparent;
        }
        .ct-btn { background: #c9a84c; color: #0f1419; }
        .ct-btn:hover { background: #b8952f; }
        .ct-btn-ghost { background: #fff; color: #0f1419; border-color: #e0dccb; }
        .ct-btn-ghost:hover { border-color: #c9a84c; }
        .ct-foot { color: #9aa0a6; font-size: 12px; margin-top: 22px; text-align: center; }
        @media (max-width: 480px) {
          .ct-card { padding: 22px 18px; }
          .ct-row { grid-template-columns: 1fr; }
          .ct-head h1 { font-size: 23px; }
        }
      `}</style>
    </main>
  );
}
