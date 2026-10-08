import { NextResponse } from "next/server";
import { buildDocUrl } from "@/lib/ficha-link";

// Recibe la Ficha Cliente (datos + pathnames de los documentos ya subidos al store
// privado) y le manda a Gamaex un email con todo + enlaces de descarga firmados que
// expiran (7 días). Mismo canal que /api/contacto (Resend → gamaex@gmail.com), con
// honeypot anti-spam. No adjunta archivos: los documentos se leen bajo demanda desde
// el store privado a través de /api/ficha-cliente/doc.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NOTIFY_TO = process.env["CONTACTO_NOTIFY_EMAIL"] ?? "gamaex@gmail.com";
const EMAIL_FROM = process.env["EMAIL_FROM"] ?? "Fichas Gamaex <onboarding@resend.dev>";
const SITE_URL = process.env["NEXT_PUBLIC_SITE_URL"] ?? "https://www.gamaex.cl";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RX = /^\+?[\d\s()-]{7,20}$/;

interface DocIn {
  label?: unknown;
  pathname?: unknown;
  filename?: unknown;
  size?: unknown;
}

interface FichaPayload {
  tipo?: unknown;
  nombre?: unknown;
  rut?: unknown;
  nacionalidad?: unknown;
  actividad?: unknown;
  rutSociedad?: unknown;
  razonSocial?: unknown;
  fantasia?: unknown;
  giro?: unknown;
  tipoSociedad?: unknown;
  repNombre?: unknown;
  repRut?: unknown;
  direccion?: unknown;
  comuna?: unknown;
  email?: unknown;
  telefono?: unknown;
  pep?: unknown;
  pepDetalle?: unknown;
  origenFondos?: unknown;
  consent?: unknown;
  docs?: unknown;
  website?: unknown; // honeypot
}

function str(v: unknown, max = 200): string {
  return (typeof v === "string" ? v.trim() : "").slice(0, max);
}
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function fmtSize(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "";
  return n < 1024 * 1024 ? `${Math.round(n / 1024)} KB` : `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export async function POST(req: Request): Promise<Response> {
  let body: FichaPayload;
  try {
    body = (await req.json()) as FichaPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Solicitud inválida." }, { status: 400 });
  }

  // Honeypot: si el campo oculto viene lleno, es un bot → respondemos ok y descartamos.
  if (str(body.website)) return NextResponse.json({ ok: true });

  const tipo = str(body.tipo).toLowerCase() === "empresa" ? "empresa" : "persona";
  const email = str(body.email, 120).toLowerCase();
  const telefono = str(body.telefono, 30);
  const direccion = str(body.direccion, 200);
  const comuna = str(body.comuna, 80);
  const pep = str(body.pep).toLowerCase() === "si" ? "si" : str(body.pep).toLowerCase() === "no" ? "no" : "";
  const pepDetalle = str(body.pepDetalle, 500);
  const origenFondos = str(body.origenFondos, 500);
  const consent = body.consent === true;

  // Documentos ya subidos al store privado. Aceptamos solo pathnames del prefijo "ficha/".
  const rawDocs = Array.isArray(body.docs) ? (body.docs as DocIn[]) : [];
  const docs = rawDocs
    .map((d) => ({
      label: str(d.label, 80) || "Documento",
      pathname: str(d.pathname, 300),
      filename: str(d.filename, 200) || "documento",
      size: typeof d.size === "number" ? d.size : 0,
    }))
    .filter((d) => d.pathname.startsWith("ficha/"))
    .slice(0, 12);

  // Campos según tipo.
  const nombre = str(body.nombre, 120);
  const rut = str(body.rut, 20);
  const nacionalidad = str(body.nacionalidad, 60);
  const actividad = str(body.actividad, 160);
  const rutSociedad = str(body.rutSociedad, 20);
  const razonSocial = str(body.razonSocial, 160);
  const fantasia = str(body.fantasia, 160);
  const giro = str(body.giro, 160);
  const tipoSociedad = str(body.tipoSociedad, 60);
  const repNombre = str(body.repNombre, 120);
  const repRut = str(body.repRut, 20);

  const errors: string[] = [];
  if (!consent) errors.push("Falta autorizar el tratamiento de datos.");
  if (!EMAIL_RX.test(email)) errors.push("Email inválido.");
  if (!PHONE_RX.test(telefono)) errors.push("Teléfono inválido.");
  if (!direccion) errors.push("Falta la dirección.");
  if (!pep) errors.push("Falta la declaración PEP.");
  if (!docs.length) errors.push("Faltan los documentos.");
  if (tipo === "empresa") {
    if (!rutSociedad) errors.push("Falta el RUT de la sociedad.");
    if (!razonSocial) errors.push("Falta la razón social.");
    if (!giro) errors.push("Falta el giro.");
    if (!tipoSociedad) errors.push("Falta el tipo de sociedad.");
    if (!repNombre || !repRut) errors.push("Faltan datos del representante legal.");
  } else {
    if (!nombre) errors.push("Falta el nombre.");
    if (!rut) errors.push("Falta el RUT.");
    if (!actividad) errors.push("Falta la actividad/profesión.");
  }
  if (errors.length) {
    return NextResponse.json({ ok: false, error: errors.join(" ") }, { status: 422 });
  }

  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) {
    console.error("[/api/ficha-cliente] Falta RESEND_API_KEY");
    return NextResponse.json(
      { ok: false, error: "No pudimos enviar la ficha. Escríbenos por WhatsApp." },
      { status: 500 },
    );
  }

  const titular = tipo === "empresa" ? razonSocial : nombre;
  const subject = `Nueva ficha de cliente (${tipo === "empresa" ? "empresa" : "persona"}): ${titular}`;

  const row = (k: string, v: string) =>
    v
      ? `<tr><td style="padding:7px 0;color:#6b6f76;width:190px;vertical-align:top">${esc(k)}</td><td style="padding:7px 0;font-weight:600">${esc(v)}</td></tr>`
      : "";

  const datosRows =
    tipo === "empresa"
      ? [
          row("RUT sociedad", rutSociedad),
          row("Razón social", razonSocial),
          row("Nombre de fantasía", fantasia),
          row("Giro comercial", giro),
          row("Tipo de sociedad", tipoSociedad),
          row("Representante legal", repNombre),
          row("RUT rep. legal", repRut),
        ].join("")
      : [
          row("Nombre", nombre),
          row("RUT", rut),
          row("Nacionalidad", nacionalidad),
          row("Profesión / actividad", actividad),
        ].join("");

  const comunesRows = [
    row("Dirección", `${direccion}${comuna ? `, ${comuna}` : ""}`),
    row("Email", email),
    row("Teléfono", telefono),
    row("¿Es PEP?", pep === "si" ? "Sí — Persona Expuesta Políticamente" : "No"),
    pep === "si" ? row("Detalle del vínculo PEP", pepDetalle) : "",
    row("Origen de los fondos", origenFondos),
  ].join("");

  const docsHtml = docs
    .map((d) => {
      const link = buildDocUrl(SITE_URL, d.pathname);
      const meta = fmtSize(d.size);
      return `<tr>
        <td style="padding:9px 0;border-top:1px solid #eee;vertical-align:top">
          <div style="font-weight:600">${esc(d.label)}</div>
          <div style="color:#9aa0a6;font-size:12px">${esc(d.filename)}${meta ? ` · ${meta}` : ""}</div>
        </td>
        <td style="padding:9px 0;border-top:1px solid #eee;text-align:right;vertical-align:top">
          <a href="${link}" style="display:inline-block;background:#0F1419;color:#fff;text-decoration:none;font-weight:700;border-radius:8px;padding:9px 16px;font-size:13px">Descargar</a>
        </td>
      </tr>`;
    })
    .join("");

  const html = `
  <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#FAF8F2;padding:24px;color:#0F1419">
    <div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #E8E4D6;border-radius:14px;overflow:hidden">
      <div style="background:#0F1419;padding:18px 24px">
        <div style="color:#C9A84C;font-weight:700;letter-spacing:.18em;font-size:15px">GAMAEX</div>
        <div style="color:#cbb98c;font-size:12px;margin-top:2px">Nueva ficha de cliente para evaluar</div>
      </div>
      <div style="padding:24px">
        <div style="display:inline-block;background:${tipo === "empresa" ? "#0F1419" : "#C9A84C"};color:#fff;font-weight:700;border-radius:999px;padding:6px 16px;font-size:14px">
          ${tipo === "empresa" ? "Persona jurídica (empresa)" : "Persona natural"}
        </div>
        <table style="width:100%;border-collapse:collapse;margin-top:18px;font-size:15px">
          ${datosRows}
          <tr><td colspan="2" style="padding-top:6px;border-top:1px solid #eee"></td></tr>
          ${comunesRows}
        </table>

        <div style="margin-top:22px;color:#6b6f76;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">Documentos</div>
        <table style="width:100%;border-collapse:collapse;margin-top:6px;font-size:15px">
          ${docsHtml}
        </table>
        <p style="color:#9aa0a6;font-size:12px;margin-top:16px">Los enlaces de descarga son privados y expiran en 7 días. Si expiran, el cliente puede reenviar la ficha. Puedes responder este correo para escribirle al cliente (reply-to: ${esc(email)}).</p>
      </div>
    </div>
  </div>`;

  const textLines = [
    `Nueva ficha de cliente — ${tipo === "empresa" ? "EMPRESA" : "PERSONA"}: ${titular}`,
    "",
    ...(tipo === "empresa"
      ? [`RUT sociedad: ${rutSociedad}`, `Razón social: ${razonSocial}`, fantasia ? `Fantasía: ${fantasia}` : "", `Giro: ${giro}`, `Tipo de sociedad: ${tipoSociedad}`, `Rep. legal: ${repNombre} (${repRut})`]
      : [`Nombre: ${nombre}`, `RUT: ${rut}`, nacionalidad ? `Nacionalidad: ${nacionalidad}` : "", `Actividad: ${actividad}`]),
    `Dirección: ${direccion}${comuna ? `, ${comuna}` : ""}`,
    `Email: ${email}`,
    `Teléfono: ${telefono}`,
    `¿PEP?: ${pep === "si" ? `Sí — ${pepDetalle}` : "No"}`,
    origenFondos ? `Origen de fondos: ${origenFondos}` : "",
    "",
    "Documentos (enlaces privados, expiran en 7 días):",
    ...docs.map((d) => `- ${d.label} (${d.filename}): ${buildDocUrl(SITE_URL, d.pathname)}`),
  ].filter(Boolean);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [NOTIFY_TO],
        reply_to: email,
        subject,
        html,
        text: textLines.join("\n"),
      }),
    });
    if (!res.ok) {
      console.error("[/api/ficha-cliente] Resend error", res.status, await res.text());
      return NextResponse.json(
        { ok: false, error: "No pudimos enviar la ficha. Intenta de nuevo o escríbenos por WhatsApp." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/ficha-cliente] fetch error", err);
    return NextResponse.json(
      { ok: false, error: "Problema de conexión. Intenta de nuevo." },
      { status: 502 },
    );
  }
}
