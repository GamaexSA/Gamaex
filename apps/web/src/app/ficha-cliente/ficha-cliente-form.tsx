"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";
import SiteNav from "@/components/site-nav";

type Tipo = "persona" | "empresa";
type Status = "idle" | "uploading" | "sending" | "ok" | "error";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RX = /^\+?[\d\s()-]{7,20}$/;

const TIPO_SOCIEDAD = [
  "Sociedad Anónima (S.A.)",
  "Sociedad por Acciones (SpA)",
  "Responsabilidad Limitada (Ltda.)",
  "E.I.R.L.",
  "Sociedad Colectiva",
  "En Comandita",
  "Otra",
];

interface DocField {
  key: string;
  label: string;
  hint: string;
  required: boolean;
  multiple?: boolean;
}

const DOCS: Record<Tipo, DocField[]> = {
  empresa: [
    { key: "constitucion", label: "Constitución de sociedad y modificaciones", hint: "PDF de la escritura y sus modificaciones", required: true },
    { key: "vigencia", label: "Vigencia de la sociedad y de los poderes", hint: "Certificados del CBRS (Conservador de Bienes Raíces), con no más de 30 días de antigüedad. Puedes subir varios archivos", required: true, multiple: true },
    { key: "cedulaRep", label: "Cédula de identidad del representante legal", hint: "Ambos lados (imagen o PDF)", required: true, multiple: true },
    { key: "erut", label: "e-RUT de la empresa (SII)", hint: "Carpeta tributaria o e-RUT del SII", required: true },
    { key: "origenFondos", label: "Origen de los fondos / actividad económica", hint: "Documento que respalde el origen de los fondos (PDF o imagen)", required: true },
  ],
  persona: [
    { key: "cedula", label: "Cédula de identidad (frente y reverso)", hint: "Sube ambos lados (imagen o PDF)", required: true, multiple: true },
    { key: "domicilio", label: "Comprobante de domicilio", hint: "Opcional — cuenta de servicios reciente", required: false },
    { key: "origenFondos", label: "Origen de los fondos / actividad económica", hint: "Documento que respalde el origen de los fondos (PDF o imagen)", required: true },
  ],
};

const ACCEPT = ".pdf,.jpg,.jpeg,.png,.webp,.heic,.heif,application/pdf,image/*";
const MAX_BYTES = 15 * 1024 * 1024;

const EMPTY = {
  nombre: "", rut: "", nacionalidad: "", actividad: "",
  rutSociedad: "", razonSocial: "", fantasia: "", giro: "", tipoSociedad: "", repNombre: "", repRut: "",
  direccion: "", comuna: "", email: "", telefono: "", pepDetalle: "", origenFondos: "",
};

export default function FichaClienteForm() {
  const [tipo, setTipo] = useState<Tipo>("empresa");
  const [f, setF] = useState({ ...EMPTY });
  const [pep, setPep] = useState<"" | "si" | "no">("");
  const [consent, setConsent] = useState(false);
  const [files, setFiles] = useState<Record<string, File[]>>({});
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }));

  const docFields = DOCS[tipo];

  function onPick(key: string, multiple: boolean) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const picked = Array.from(e.target.files ?? []).filter((file) => file.size <= MAX_BYTES);
      setError("");
      setFiles((prev) => ({ ...prev, [key]: multiple ? [...(prev[key] ?? []), ...picked].slice(0, 4) : picked.slice(0, 1) }));
      e.target.value = "";
    };
  }
  function removeFile(key: string, idx: number) {
    setFiles((prev) => ({ ...prev, [key]: (prev[key] ?? []).filter((_, i) => i !== idx) }));
  }

  const docsOk = docFields.every((d) => !d.required || (files[d.key]?.length ?? 0) > 0);
  const baseOk =
    EMAIL_RX.test(f.email.trim()) && PHONE_RX.test(f.telefono.trim()) && f.direccion.trim().length >= 3 &&
    pep !== "" && consent && docsOk && (pep === "no" || f.pepDetalle.trim().length >= 3);
  const tipoOk =
    tipo === "empresa"
      ? f.rutSociedad.trim().length >= 6 && f.razonSocial.trim().length >= 2 && f.giro.trim().length >= 2 &&
        f.tipoSociedad.trim() !== "" && f.repNombre.trim().length >= 2 && f.repRut.trim().length >= 6
      : f.nombre.trim().length >= 2 && f.rut.trim().length >= 6 && f.actividad.trim().length >= 2;
  const canSubmit = baseOk && tipoOk && status !== "uploading" && status !== "sending";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError("");
    const rutSlug = (tipo === "empresa" ? f.rutSociedad : f.rut).replace(/[^0-9kK]/g, "").slice(0, 12) || "sn";
    const queue = docFields.flatMap((d) => (files[d.key] ?? []).map((file) => ({ d, file })));
    setProgress({ done: 0, total: queue.length });
    setStatus("uploading");
    const uploaded: { label: string; pathname: string; filename: string; size: number }[] = [];
    try {
      for (const { d, file } of queue) {
        const safe = file.name.replace(/[^\w.\- ]/g, "_").slice(0, 80);
        const blob = await upload(`ficha/${tipo}/${rutSlug}/${d.key}-${safe}`, file, {
          access: "private",
          handleUploadUrl: "/api/ficha-cliente/blob-upload",
        });
        uploaded.push({ label: d.label, pathname: blob.pathname, filename: file.name, size: file.size });
        setProgress((p) => ({ ...p, done: p.done + 1 }));
      }
    } catch {
      setStatus("error");
      setError("No pudimos subir los documentos. Revisa tu conexión e intenta de nuevo. Cada archivo debe pesar máximo 15 MB.");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/ficha-cliente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, ...f, pep, consent, website, docs: uploaded }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) setStatus("ok");
      else { setStatus("error"); setError(data.error ?? "No pudimos enviar la ficha. Intenta de nuevo."); }
    } catch {
      setStatus("error");
      setError("Problema de conexión. Revisa tu internet e intenta de nuevo.");
    }
  }

  const busy = status === "uploading" || status === "sending";

  return (
    <div className="fc-root">
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

      <main className="fc-main">
        <div className="fc-card">
          {status === "ok" ? (
            <div className="fc-success" role="status">
              <div className="fc-check" aria-hidden="true">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5l5 5L20 6" /></svg>
              </div>
              <h1>Ficha recibida</h1>
              <p>Recibimos tus datos y documentos. Vamos a revisarlos y te contactamos a la brevedad para confirmar tu registro como cliente de Gamaex.</p>
              <a className="fc-btn-gold" href="/">Volver al inicio</a>
            </div>
          ) : (
            <>
              <div className="fc-head">
                <span className="fc-tag">Ficha de cliente</span>
                <h1>Regístrate y sube tus antecedentes</h1>
                <p className="fc-lede">
                  Completa tus datos y adjunta los documentos para tu evaluación. Todo viaja cifrado y se guarda en
                  almacenamiento privado — solo Gamaex puede verlo. Es un requisito de la normativa de prevención de
                  lavado de activos (UAF) para operar como cliente.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <fieldset className="fc-op">
                  <legend>Tipo de cliente</legend>
                  <div className="fc-toggle">
                    <button type="button" className={tipo === "empresa" ? "on" : ""} aria-pressed={tipo === "empresa"} onClick={() => setTipo("empresa")}>Empresa (persona jurídica)</button>
                    <button type="button" className={tipo === "persona" ? "on" : ""} aria-pressed={tipo === "persona"} onClick={() => setTipo("persona")}>Persona</button>
                  </div>
                </fieldset>

                <div className="fc-sec-label">Datos</div>
                {tipo === "empresa" ? (
                  <>
                    <div className="fc-row">
                      <label className="fc-field"><span>RUT de la sociedad *</span><input value={f.rutSociedad} onChange={set("rutSociedad")} placeholder="76.123.456-7" /></label>
                      <label className="fc-field"><span>Razón social *</span><input value={f.razonSocial} onChange={set("razonSocial")} autoComplete="organization" /></label>
                    </div>
                    <div className="fc-row">
                      <label className="fc-field"><span>Nombre de fantasía</span><input value={f.fantasia} onChange={set("fantasia")} /></label>
                      <label className="fc-field"><span>Giro comercial *</span><input value={f.giro} onChange={set("giro")} /></label>
                    </div>
                    <label className="fc-field"><span>Tipo de sociedad *</span>
                      <select value={f.tipoSociedad} onChange={set("tipoSociedad")}>
                        <option value="" disabled>Selecciona…</option>
                        {TIPO_SOCIEDAD.map((t) => (<option key={t} value={t}>{t}</option>))}
                      </select>
                    </label>
                    <div className="fc-row">
                      <label className="fc-field"><span>Representante legal *</span><input value={f.repNombre} onChange={set("repNombre")} autoComplete="name" /></label>
                      <label className="fc-field"><span>RUT rep. legal *</span><input value={f.repRut} onChange={set("repRut")} placeholder="12.345.678-9" /></label>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="fc-row">
                      <label className="fc-field"><span>Nombre y apellido *</span><input value={f.nombre} onChange={set("nombre")} autoComplete="name" /></label>
                      <label className="fc-field"><span>RUT *</span><input value={f.rut} onChange={set("rut")} placeholder="12.345.678-9" /></label>
                    </div>
                    <div className="fc-row">
                      <label className="fc-field"><span>Nacionalidad</span><input value={f.nacionalidad} onChange={set("nacionalidad")} /></label>
                      <label className="fc-field"><span>Profesión / actividad *</span><input value={f.actividad} onChange={set("actividad")} /></label>
                    </div>
                  </>
                )}

                <div className="fc-row">
                  <label className="fc-field"><span>Dirección *</span><input value={f.direccion} onChange={set("direccion")} autoComplete="street-address" /></label>
                  <label className="fc-field"><span>Comuna</span><input value={f.comuna} onChange={set("comuna")} /></label>
                </div>
                <div className="fc-row">
                  <label className="fc-field"><span>Email *</span><input type="email" value={f.email} onChange={set("email")} autoComplete="email" placeholder="tu@correo.cl" /></label>
                  <label className="fc-field"><span>Teléfono / WhatsApp *</span><input type="tel" value={f.telefono} onChange={set("telefono")} autoComplete="tel" placeholder="+56 9 ..." /></label>
                </div>

                <fieldset className="fc-pep">
                  <legend>¿Eres Persona Expuesta Políticamente (PEP)? *</legend>
                  <p className="fc-pep-hint">Cargo público de alto nivel (o familiar/cercano de uno) en los últimos años. Es una pregunta estándar UAF.</p>
                  <div className="fc-radios">
                    <label className={`fc-radio ${pep === "no" ? "on" : ""}`}><input type="radio" name="pep" checked={pep === "no"} onChange={() => setPep("no")} /> No</label>
                    <label className={`fc-radio ${pep === "si" ? "on" : ""}`}><input type="radio" name="pep" checked={pep === "si"} onChange={() => setPep("si")} /> Sí</label>
                  </div>
                  {pep === "si" && (
                    <label className="fc-field" style={{ marginTop: "10px" }}><span>Detalle del vínculo (declaración) *</span>
                      <textarea rows={2} value={f.pepDetalle} onChange={set("pepDetalle")} placeholder="Cargo, institución y período (o vínculo con la persona PEP)" />
                    </label>
                  )}
                </fieldset>

                <div className="fc-sec-label">Documentos *</div>
                <div className="fc-docs">
                  {docFields.map((d) => {
                    const list = files[d.key] ?? [];
                    return (
                      <div className="fc-doc" key={d.key}>
                        <div className="fc-doc-top">
                          <div>
                            <div className="fc-doc-label">{d.label}{d.required && <span className="fc-req"> *</span>}</div>
                            <div className="fc-doc-hint">{d.hint}</div>
                          </div>
                          <label className="fc-upload">
                            <input type="file" accept={ACCEPT} multiple={d.multiple} onChange={onPick(d.key, !!d.multiple)} />
                            {list.length ? "Agregar" : "Subir"}
                          </label>
                        </div>
                        {list.length > 0 && (
                          <ul className="fc-files">
                            {list.map((file, i) => (
                              <li key={`${file.name}-${i}`}>
                                <span className="fc-file-name">📄 {file.name}</span>
                                <button type="button" onClick={() => removeFile(d.key, i)} aria-label="Quitar">✕</button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>


                <label className="fc-consent">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                  <span>Autorizo a Gamaex (Inversiones y Turismo Gamaex Chile S.A.) a tratar estos datos y documentos con el único fin de evaluar mi registro como cliente, conforme a la normativa de la UAF. Declaro que la información es verídica.</span>
                </label>

                <input className="fc-hp" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} aria-hidden="true" placeholder="Tu sitio web" />

                {status === "error" && <div className="fc-alert" role="alert">{error}</div>}
                {status === "uploading" && <div className="fc-info" role="status">Subiendo documentos… {progress.done}/{progress.total}</div>}

                <button type="submit" className="fc-submit" disabled={!canSubmit}>
                  {status === "uploading" ? `Subiendo… ${progress.done}/${progress.total}` : status === "sending" ? "Enviando ficha…" : "Enviar ficha"}
                </button>
                <p className="fc-legal">🔒 Tus documentos se guardan en almacenamiento privado y solo Gamaex accede a ellos para tu evaluación.</p>
              </form>
            </>
          )}
        </div>
      </main>

      <footer className="fc-footer">
        <svg className="fc-footer-logo" viewBox="0 0 800 280" width="211" height="74" aria-hidden="true">
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
        <p className="fc-footer-addr">Av. Pedro de Valdivia 020, Providencia, Santiago · Lun–Vie 9:00–17:00 · Sáb 9:00–13:00</p>
        <p className="fc-footer-nospam">Gamaex no envía correos masivos ni realiza llamados telefónicos con fines publicitarios. Solo respondemos a quienes nos contactan directamente.</p>
      </footer>

      <style jsx>{`
        .fc-root {
          --gold-light: #e8c76e; --gold: #c9a84c; --gold-deep: #9c7e2e;
          --dark: #0f1419; --dark-2: #1a1f26; --gray: #6b7280;
          --light: #faf8f2; --white: #fff; --border: #e8e4d6;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          color: var(--dark); background: var(--white); line-height: 1.5; -webkit-font-smoothing: antialiased;
          min-height: 100vh; display: flex; flex-direction: column;
        }
        .fc-main { flex: 1; display: flex; justify-content: center; padding: 3.5rem 6% 4rem; background: linear-gradient(180deg, var(--white) 0%, var(--light) 100%); }
        .fc-card { width: 100%; max-width: 680px; background: var(--white); border: 1.5px solid var(--border); border-radius: 22px; padding: 2.6rem; box-shadow: 0 20px 60px rgba(15,20,25,0.07); align-self: flex-start; }
        .fc-tag { display: inline-block; padding: 0.45rem 1rem; border-radius: 50px; background: rgba(201,168,76,0.15); color: var(--gold-deep); font-size: 0.78rem; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase; margin-bottom: 1rem; }
        .fc-head h1 { font-family: "Cormorant Garamond", Georgia, serif; font-size: clamp(1.9rem, 3.6vw, 2.6rem); font-weight: 600; letter-spacing: -0.5px; line-height: 1.1; margin: 0 0 0.7rem; color: var(--dark); }
        .fc-lede { color: var(--gray); margin: 0 0 1.8rem; font-size: 0.98rem; line-height: 1.6; }

        form { display: flex; flex-direction: column; gap: 15px; }
        fieldset { border: 0; padding: 0; margin: 0; }
        legend { font-size: 0.9rem; font-weight: 700; color: var(--dark); margin-bottom: 10px; padding: 0; }
        .fc-sec-label { font-size: 0.78rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--gold-deep); margin: 8px 0 -2px; }
        .fc-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .fc-toggle button { padding: 13px 10px; border-radius: 12px; border: 1.5px solid var(--border); background: var(--light); color: var(--dark); font-size: 14.5px; font-weight: 600; cursor: pointer; transition: all 0.18s; font-family: inherit; }
        .fc-toggle button:hover { border-color: var(--gold); }
        .fc-toggle button.on { background: var(--dark); color: var(--white); border-color: var(--dark); }
        .fc-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .fc-field { display: flex; flex-direction: column; gap: 6px; }
        .fc-field > span { font-size: 0.82rem; font-weight: 600; color: #4b5058; }
        .fc-field em { color: #9aa0a6; font-style: normal; font-weight: 400; }
        .fc-field input, .fc-field select, .fc-field textarea { border: 1.5px solid var(--border); border-radius: 11px; padding: 12px 14px; font-size: 15px; color: var(--dark); background: var(--white); width: 100%; box-sizing: border-box; font-family: inherit; transition: border-color 0.15s, box-shadow 0.15s; }
        .fc-field input:focus, .fc-field select:focus, .fc-field textarea:focus { outline: none; border-color: var(--gold); box-shadow: 0 0 0 3px rgba(201,168,76,0.16); }
        .fc-field textarea { resize: vertical; }

        .fc-pep { background: var(--light); border: 1.5px solid var(--border); border-radius: 14px; padding: 16px; }
        .fc-pep legend { padding: 0 6px; }
        .fc-pep-hint { color: var(--gray); font-size: 0.82rem; margin: -4px 0 10px; }
        .fc-radios { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .fc-radio { display: flex; align-items: center; gap: 9px; padding: 12px 14px; border: 1.5px solid var(--border); border-radius: 11px; background: var(--white); font-weight: 600; font-size: 15px; cursor: pointer; transition: all 0.15s; }
        .fc-radio.on { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(201,168,76,0.14); }
        .fc-radio input { accent-color: var(--gold-deep); width: 17px; height: 17px; }

        .fc-docs { display: flex; flex-direction: column; gap: 12px; }
        .fc-doc { border: 1.5px solid var(--border); border-radius: 14px; padding: 14px 16px; }
        .fc-doc-top { display: flex; align-items: center; justify-content: space-between; gap: 14px; }
        .fc-doc-label { font-weight: 600; font-size: 0.92rem; color: var(--dark); }
        .fc-req { color: var(--gold-deep); }
        .fc-doc-hint { color: #9aa0a6; font-size: 0.8rem; margin-top: 2px; }
        .fc-upload { flex-shrink: 0; display: inline-flex; align-items: center; gap: 7px; background: var(--dark); color: var(--white); border-radius: 10px; padding: 10px 18px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.18s; }
        .fc-upload:hover { background: var(--gold-deep); }
        .fc-upload input { display: none; }
        .fc-files { list-style: none; margin: 12px 0 0; padding: 0; display: flex; flex-direction: column; gap: 7px; }
        .fc-files li { display: flex; align-items: center; justify-content: space-between; gap: 10px; background: var(--light); border-radius: 9px; padding: 8px 12px; font-size: 13.5px; }
        .fc-file-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .fc-files button { border: 0; background: none; color: var(--gray); cursor: pointer; font-size: 15px; line-height: 1; padding: 2px 4px; }
        .fc-files button:hover { color: #c0392b; }

        .fc-consent { display: flex; gap: 11px; align-items: flex-start; background: var(--light); border: 1.5px solid var(--border); border-radius: 12px; padding: 14px 16px; font-size: 0.86rem; color: #4b5058; line-height: 1.5; }
        .fc-consent input { margin-top: 3px; width: 18px; height: 18px; accent-color: var(--gold-deep); flex-shrink: 0; }

        .fc-hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }
        .fc-alert { background: #fdecec; border: 1px solid #f5c2c2; color: #9b1c1c; border-radius: 11px; padding: 11px 14px; font-size: 14px; }
        .fc-info { background: rgba(201,168,76,0.14); border: 1px solid rgba(201,168,76,0.4); color: var(--gold-deep); border-radius: 11px; padding: 11px 14px; font-size: 14px; font-weight: 600; }
        .fc-submit { margin-top: 4px; padding: 15px; border: 0; border-radius: 12px; background: var(--gold); color: var(--dark); font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .fc-submit:hover:not(:disabled) { background: var(--gold-deep); color: var(--white); transform: translateY(-2px); box-shadow: 0 10px 24px rgba(201,168,76,0.3); }
        .fc-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .fc-legal { text-align: center; color: #9aa0a6; font-size: 12px; margin: 4px 0 0; }

        .fc-success { text-align: center; padding: 16px 0; }
        .fc-check { width: 60px; height: 60px; border-radius: 50%; background: rgba(201,168,76,0.16); color: var(--gold-deep); display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; }
        .fc-success h1 { font-family: "Cormorant Garamond", Georgia, serif; font-size: 2rem; font-weight: 600; margin: 0 0 10px; }
        .fc-success p { color: var(--gray); margin: 0 auto 22px; max-width: 440px; font-size: 15px; line-height: 1.65; }
        .fc-btn-gold { display: inline-block; background: var(--gold); color: var(--dark); text-decoration: none; padding: 13px 26px; border-radius: 12px; font-weight: 700; transition: all 0.2s; }
        .fc-btn-gold:hover { background: var(--gold-deep); color: var(--white); }

        .fc-footer { background: var(--dark); color: var(--white); padding: 3.4rem 6% 2.2rem; text-align: center; }
        .fc-footer-logo { height: 74px; width: auto; margin-bottom: 1rem; }
        .fc-footer-addr { color: rgba(255,255,255,0.6); font-size: 0.9rem; margin: 0 0 0.9rem; }
        .fc-footer-nospam { color: rgba(255,255,255,0.42); font-size: 0.76rem; line-height: 1.6; max-width: 640px; margin: 0 auto; }

        @media (max-width: 780px) {
          .fc-card { padding: 1.8rem 1.4rem; }
          .fc-row, .fc-radios { grid-template-columns: 1fr; }
          .fc-doc-top { flex-direction: column; align-items: stretch; gap: 10px; }
          .fc-upload { justify-content: center; }
        }
      `}</style>
    </div>
  );
}
