import { NextResponse } from "next/server";

// Route handler autocontenido: recibe el formulario público de /contacto y envía
// la solicitud por email al equipo (gamaex@gmail.com) usando la API REST de Resend.
// No depende de la API NestJS (apps/api) ni agrega dependencias: usa fetch directo.
//
// Nota de infra (2026-07): la cuenta Resend NO tiene dominio verificado, así que el
// único remitente disponible es onboarding@resend.dev y SOLO puede enviar al dueño de
// la cuenta, que es gamaex@gmail.com — justo el destinatario que queremos. Si a futuro
// se verifica gamaex.cl en Resend, cambiar EMAIL_FROM a algo como cotizaciones@gamaex.cl
// y se podrá, además, mandar copia/confirmación al cliente.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NOTIFY_TO = process.env["CONTACTO_NOTIFY_EMAIL"] ?? "gamaex@gmail.com";
const EMAIL_FROM = process.env["EMAIL_FROM"] ?? "Cotizaciones Gamaex <onboarding@resend.dev>";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RX = /^\+?[\d\s()-]{7,20}$/;

type Operacion = "comprar" | "vender";

interface ContactoPayload {
  operacion?: unknown;
  moneda?: unknown;
  cantidad?: unknown;
  nombre?: unknown;
  apellido?: unknown;
  email?: unknown;
  telefono?: unknown;
  mensaje?: unknown;
  // honeypot anti-spam: los humanos no lo ven; si viene lleno, es bot.
  empresa?: unknown;
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: Request): Promise<Response> {
  let body: ContactoPayload;
  try {
    body = (await req.json()) as ContactoPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Solicitud inválida." }, { status: 400 });
  }

  // Honeypot: si el campo oculto viene lleno, respondemos ok pero descartamos (bot).
  if (str(body.empresa)) {
    return NextResponse.json({ ok: true });
  }

  const operacionRaw = str(body.operacion).toLowerCase();
  const operacion: Operacion | "" =
    operacionRaw === "comprar" || operacionRaw === "vender" ? (operacionRaw as Operacion) : "";
  const moneda = str(body.moneda).toUpperCase().slice(0, 8);
  const cantidad = str(body.cantidad).replace(/[^\d.,]/g, "").slice(0, 20);
  const nombre = str(body.nombre).slice(0, 80);
  const apellido = str(body.apellido).slice(0, 80);
  const email = str(body.email).toLowerCase().slice(0, 120);
  const telefono = str(body.telefono).slice(0, 30);
  const mensaje = str(body.mensaje).slice(0, 800);

  const errors: string[] = [];
  if (!operacion) errors.push("Indica si quieres comprar o vender.");
  if (!moneda) errors.push("Selecciona una moneda.");
  if (!cantidad || !(parseFloat(cantidad.replace(/\./g, "").replace(",", ".")) > 0))
    errors.push("Ingresa un monto válido.");
  if (nombre.length < 2) errors.push("Ingresa tu nombre.");
  if (apellido.length < 2) errors.push("Ingresa tu apellido.");
  if (!EMAIL_RX.test(email)) errors.push("Ingresa un email válido.");
  if (!PHONE_RX.test(telefono)) errors.push("Ingresa un teléfono válido.");

  if (errors.length) {
    return NextResponse.json({ ok: false, error: errors.join(" ") }, { status: 422 });
  }

  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) {
    console.error("[/api/contacto] Falta RESEND_API_KEY en el entorno");
    return NextResponse.json(
      { ok: false, error: "No pudimos enviar la solicitud. Escríbenos por WhatsApp." },
      { status: 500 },
    );
  }

  const opLabel = operacion === "comprar" ? "COMPRAR" : "VENDER";
  const nombreCompleto = `${nombre} ${apellido}`.trim();
  const subject = `Nueva solicitud: ${opLabel} ${cantidad} ${moneda} — ${nombreCompleto}`;

  const html = `
  <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#FAF8F2;padding:24px;color:#0F1419">
    <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #E8E4D6;border-radius:14px;overflow:hidden">
      <div style="background:#0F1419;padding:18px 24px">
        <div style="color:#C9A84C;font-weight:700;letter-spacing:.18em;font-size:15px">GAMAEX</div>
        <div style="color:#cbb98c;font-size:12px;margin-top:2px">Nueva solicitud del formulario web</div>
      </div>
      <div style="padding:24px">
        <div style="display:inline-block;background:${
          operacion === "comprar" ? "#0F1419" : "#C9A84C"
        };color:#fff;font-weight:700;border-radius:999px;padding:6px 16px;font-size:14px">
          El cliente quiere ${opLabel}
        </div>
        <table style="width:100%;border-collapse:collapse;margin-top:18px;font-size:15px">
          <tr><td style="padding:8px 0;color:#6b6f76;width:130px">Operación</td><td style="padding:8px 0;font-weight:600">${opLabel} divisa</td></tr>
          <tr><td style="padding:8px 0;color:#6b6f76">Moneda</td><td style="padding:8px 0;font-weight:600">${esc(moneda)}</td></tr>
          <tr><td style="padding:8px 0;color:#6b6f76">Monto</td><td style="padding:8px 0;font-weight:600">${esc(cantidad)} ${esc(moneda)}</td></tr>
          <tr><td style="padding:8px 0;color:#6b6f76;border-top:1px solid #eee">Nombre</td><td style="padding:8px 0;font-weight:600;border-top:1px solid #eee">${esc(nombreCompleto)}</td></tr>
          <tr><td style="padding:8px 0;color:#6b6f76">Email</td><td style="padding:8px 0;font-weight:600"><a href="mailto:${esc(email)}" style="color:#9C7E2E">${esc(email)}</a></td></tr>
          <tr><td style="padding:8px 0;color:#6b6f76">Teléfono</td><td style="padding:8px 0;font-weight:600"><a href="https://wa.me/${telefono.replace(/[^\d]/g, "")}" style="color:#9C7E2E">${esc(telefono)}</a></td></tr>
          ${
            mensaje
              ? `<tr><td style="padding:8px 0;color:#6b6f76;vertical-align:top">Mensaje</td><td style="padding:8px 0">${esc(mensaje)}</td></tr>`
              : ""
          }
        </table>
        <div style="margin-top:20px">
          <a href="https://wa.me/${telefono.replace(/[^\d]/g, "")}" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;font-weight:700;border-radius:10px;padding:12px 20px;font-size:15px">Responder por WhatsApp</a>
        </div>
        <p style="color:#9aa0a6;font-size:12px;margin-top:22px">Puedes responder este correo directamente para contactar al cliente (reply-to: ${esc(email)}).</p>
      </div>
    </div>
  </div>`;

  const text =
    `Nueva solicitud — ${opLabel} divisa\n\n` +
    `Operación: ${opLabel}\nMoneda: ${moneda}\nMonto: ${cantidad} ${moneda}\n` +
    `Nombre: ${nombreCompleto}\nEmail: ${email}\nTeléfono: ${telefono}\n` +
    (mensaje ? `Mensaje: ${mensaje}\n` : "");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [NOTIFY_TO],
        reply_to: email,
        subject,
        html,
        text,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[/api/contacto] Resend error", res.status, detail);
      return NextResponse.json(
        { ok: false, error: "No pudimos enviar la solicitud. Intenta de nuevo o escríbenos por WhatsApp." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/contacto] fetch error", err);
    return NextResponse.json(
      { ok: false, error: "No pudimos enviar la solicitud. Intenta de nuevo o escríbenos por WhatsApp." },
      { status: 502 },
    );
  }
}
