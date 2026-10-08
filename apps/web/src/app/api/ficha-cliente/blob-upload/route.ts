import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

// Autoriza las subidas directas del navegador al store PRIVADO de Vercel Blob.
// El cliente (ficha-cliente-form) llama a upload() con handleUploadUrl apuntando acá;
// esta ruta emite un token de subida acotado (tipos y tamaño permitidos) sin exponer
// el BLOB_READ_WRITE_TOKEN. Los archivos NO pasan por esta función (van directo al
// storage), así evitamos el límite de ~4.5 MB de las funciones serverless.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_CONTENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];
const MAX_BYTES = 15 * 1024 * 1024; // 15 MB por archivo

export async function POST(req: Request): Promise<Response> {
  const body = (await req.json()) as HandleUploadBody;
  try {
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ALLOWED_CONTENT_TYPES,
        maximumSizeInBytes: MAX_BYTES,
        addRandomSuffix: true, // pathname no adivinable (defensa en profundidad)
      }),
      onUploadCompleted: async () => {
        // El store es privado; no hay nada que hacer al completar. Se deja vacío.
      },
    });
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "No se pudo autorizar la subida." },
      { status: 400 },
    );
  }
}
