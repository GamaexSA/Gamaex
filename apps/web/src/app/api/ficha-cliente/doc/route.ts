import { get } from "@vercel/blob";
import { verifyDoc } from "@/lib/ficha-link";

// Entrega privada de un documento de la Ficha Cliente. El store es PRIVADO: el blob
// NO es accesible por su URL. Esta ruta valida la firma HMAC + expiración del enlace
// (ver ficha-link.ts) y recién ahí lee el blob con el token del servidor y lo transmite.
// Sin firma válida y vigente, responde 403 — nadie fuera del email del dueño accede.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const pathname = url.searchParams.get("p") ?? "";
  const exp = Number(url.searchParams.get("e") ?? "0");
  const sig = url.searchParams.get("s") ?? "";

  if (!verifyDoc(pathname, exp, sig)) {
    return new Response("Enlace inválido o expirado.", { status: 403 });
  }

  let result;
  try {
    result = await get(pathname, { access: "private" });
  } catch {
    return new Response("No se pudo leer el documento.", { status: 502 });
  }
  if (!result || result.statusCode !== 200) {
    return new Response("Documento no encontrado.", { status: 404 });
  }

  const filename = (pathname.split("/").pop() ?? "documento").replace(/["\\]/g, "");
  return new Response(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType || "application/octet-stream",
      "Content-Disposition": `inline; filename="${filename}"`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
