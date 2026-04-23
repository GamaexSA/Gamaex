import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from "@nestjs/common";
import { createHash } from "crypto";
import { PrismaClient } from "@gamaex/database";
import { PRISMA_TOKEN } from "../../database/database.module";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(@Inject(PRISMA_TOKEN) private readonly db: PrismaClient) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<{
      headers: Record<string, string | undefined>;
    }>();

    const rawKey =
      req.headers["x-api-key"] ??
      req.headers["authorization"]?.replace(/^Bearer\s+/i, "");

    if (!rawKey) throw new UnauthorizedException("API key requerida");

    const hash = createHash("sha256").update(rawKey).digest("hex");
    const apiKey = await this.db.apiKey.findUnique({ where: { key_hash: hash } });

    if (!apiKey || !apiKey.is_active) throw new UnauthorizedException("API key inválida");
    if (apiKey.expires_at && apiKey.expires_at < new Date()) {
      throw new UnauthorizedException("API key expirada");
    }

    // Fire-and-forget: actualizar last_used sin bloquear la respuesta
    void this.db.apiKey.update({
      where: { id: apiKey.id },
      data: { last_used_at: new Date() },
    });

    return true;
  }
}
