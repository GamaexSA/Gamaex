import { NextResponse } from "next/server";

// Route handler del formulario "Hazte cliente": recibe la solicitud de registro y la
// envía por email a Gamaex (gamaex@gmail.com) vía la API REST de Resend. Mismo patrón
// que /api/contacto. NO almacena documentos — el KYC/validación lo hace Gamaex al
// contactar al cliente (igual que la referencia More Exchange).

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NOTIFY_TO = process.env["CONTACTO_NOTIFY_EMAIL"] ?? "gamaex@gmail.com";
const EMAIL_FROM = process.env["EMAIL_FROM"] ?? "Nuevos clientes Gamaex <onboarding@resend.dev>";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RX = /^\+?[\d\s()-]{7,20}$/;

interface Payload {
  tipo?: unknown; // "persona" | "empresa"
  nombre?: unknown;
  rut?: unknown;
  email?: unknown;
  telefono?: unknown;
  interes?: unknown;
  mensaje?: unknown;
  empresa?: unknown; // honeypot
}

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function POST(req: Request): Promise<Response> {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Solicitud inválida." }, { status: 400 });
  }

  if (str(body.empresa)) return NextResponse.json({ ok: true }); // honeypot

  const tipoRaw = str(body.tipo).toLowerCase();
  const tipo = tipoRaw === "empresa" ? "empresa" : "persona";
  const nombre = str(body.nombre).slice(0, 120);
  const rut = str(body.rut).slice(0, 20);
  const email = str(body.email).toLowerCase().slice(0, 120);
  const telefono = str(body.telefono).slice(0, 30);
  const interes = str(body.interes).slice(0, 60);
  const mensaje = str(body.mensaje).slice(0, 800);

  const errors: string[] = [];
  if (nombre.length < 2) errors.push(tipo === "empresa" ? "Ingresa la razón social." : "Ingresa tu nombre.");
  if (rut.length < 6) errors.push("Ingresa un RUT válido.");
  if (!EMAIL_RX.test(email)) errors.push("Ingresa un email válido.");
  if (!PHONE_RX.test(telefono)) errors.push("Ingresa un teléfono válido.");
  if (errors.length) return NextResponse.json({ ok: false, error: errors.join(" ") }, { status: 422 });

  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) {
    console.error("[/api/hazte-cliente] Falta RESEND_API_KEY");
    return NextResponse.json(
      { ok: false, error: "No pudimos enviar la solicitud. Escríbenos por WhatsApp." },
      { status: 500 },
    );
  }

  const tipoLabel = tipo === "empresa" ? "Empresa" : "Persona";
  const subject = `Nuevo cliente (${tipoLabel}): ${nombre}`;
  const html = `
  <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#FAF8F2;padding:24px;color:#0F1419">
    <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #E8E4D6;border-radius:14px;overflow:hidden">
      <div style="background:#0F1419;padding:18px 24px">
        <div style="color:#C9A84C;font-weight:700;letter-spacing:.18em;font-size:15px">GAMAEX</div>
        <div style="color:#cbb98c;font-size:12px;margin-top:2px">Nueva solicitud para hacerse cliente</div>
      </div>
      <div style="padding:24px">
        <div style="display:inline-block;background:#C9A84C;color:#0F1419;font-weight:700;border-radius:999px;padding:6px 16px;font-size:14px">${tipoLabel}</div>
        <table style="width:100%;border-collapse:collapse;margin-top:18px;font-size:15px">
          <tr><td style="padding:8px 0;color:#6b6f76;width:150px">${tipo === "empresa" ? "Razón social" : "Nombre"}</td><td style="padding:8px 0;font-weight:600">${esc(nombre)}</td></tr>
          <tr><td style="padding:8px 0;color:#6b6f76">RUT</td><td style="padding:8px 0;font-weight:600">${esc(rut)}</td></tr>
          <tr><td style="padding:8px 0;color:#6b6f76">Email</td><td style="padding:8px 0;font-weight:600"><a href="mailto:${esc(email)}" style="color:#9C7E2E">${esc(email)}</a></td></tr>
          <tr><td style="padding:8px 0;color:#6b6f76">Teléfono</td><td style="padding:8px 0;font-weight:600"><a href="https://wa.me/${telefono.replace(/[^\d]/g, "")}" style="color:#9C7E2E">${esc(telefono)}</a></td></tr>
          ${interes ? `<tr><td style="padding:8px 0;color:#6b6f76">Interés</td><td style="padding:8px 0;font-weight:600">${esc(interes)}</td></tr>` : ""}
          ${mensaje ? `<tr><td style="padding:8px 0;color:#6b6f76;vertical-align:top">Mensaje</td><td style="padding:8px 0">${esc(mensaje)}</td></tr>` : ""}
        </table>
        <div style="margin-top:20px">
          <a href="https://wa.me/${telefono.replace(/[^\d]/g, "")}" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;font-weight:700;border-radius:10px;padding:12px 20px;font-size:15px">Contactar por WhatsApp</a>
        </div>
        <p style="color:#9aa0a6;font-size:12px;margin-top:22px">Puedes responder este correo para escribirle al cliente (reply-to: ${esc(email)}). La validación de identidad/antecedentes se coordina al contactarlo.</p>
      </div>
    </div>
  </div>`;
  const text =
    `Nuevo cliente — ${tipoLabel}\n\n${tipo === "empresa" ? "Razón social" : "Nombre"}: ${nombre}\nRUT: ${rut}\n` +
    `Email: ${email}\nTeléfono: ${telefono}\n` + (interes ? `Interés: ${interes}\n` : "") + (mensaje ? `Mensaje: ${mensaje}\n` : "");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: EMAIL_FROM, to: [NOTIFY_TO], reply_to: email, subject, html, text }),
    });
    if (!res.ok) {
      console.error("[/api/hazte-cliente] Resend error", res.status, await res.text());
      return NextResponse.json(
        { ok: false, error: "No pudimos enviar la solicitud. Intenta de nuevo o escríbenos por WhatsApp." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/hazte-cliente] fetch error", err);
    return NextResponse.json(
      { ok: false, error: "No pudimos enviar la solicitud. Intenta de nuevo o escríbenos por WhatsApp." },
      { status: 502 },
    );
  }
}
