import { createHmac, timingSafeEqual } from "node:crypto";

// Firma de enlaces de descarga para los documentos de la Ficha Cliente.
// Los blobs viven en un store PRIVADO de Vercel (no accesibles por URL). El único
// modo de leerlos es la ruta /api/ficha-cliente/doc, que exige esta firma HMAC +
// expiración. Así el email al dueño lleva links "no adivinables y que expiran":
// si alguien altera el pathname, la firma no cuaja; si pasó la fecha, se rechaza.

const SECRET = process.env["FICHA_LINK_SECRET"] ?? "";
const DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

export function signDoc(pathname: string, expMs: number): string {
  return createHmac("sha256", SECRET).update(`${pathname}.${expMs}`).digest("base64url");
}

export function verifyDoc(pathname: string, expMs: number, sig: string): boolean {
  if (!SECRET || !pathname || !sig) return false;
  if (!Number.isFinite(expMs) || Date.now() > expMs) return false;
  const expected = Buffer.from(signDoc(pathname, expMs));
  const given = Buffer.from(sig);
  if (expected.length !== given.length) return false;
  return timingSafeEqual(expected, given);
}

export function buildDocUrl(base: string, pathname: string, ttlMs: number = DEFAULT_TTL_MS): string {
  const exp = Date.now() + ttlMs;
  const sig = signDoc(pathname, exp);
  return `${base}/api/ficha-cliente/doc?p=${encodeURIComponent(pathname)}&e=${exp}&s=${sig}`;
}
