import { Injectable, Inject } from "@nestjs/common";
import { PrismaClient, AuditAction, AuditLog, Prisma } from "@gamaex/database";
import { PRISMA_TOKEN } from "../database/database.module";

@Injectable()
export class AuditService {
  constructor(@Inject(PRISMA_TOKEN) private readonly db: PrismaClient) {}

  async getLogs(
    page = 1,
    limit = 50,
    filters?: { action?: string; entity?: string; actor?: string },
  ): Promise<{ items: AuditLog[]; total: number; page: number; limit: number; pages: number }> {
    const where = {
      ...(filters?.action ? { action: filters.action as AuditAction } : {}),
      ...(filters?.entity ? { entity: filters.entity } : {}),
      ...(filters?.actor
        ? { actor_ref: { contains: filters.actor, mode: "insensitive" as const } }
        : {}),
    };

    const [items, total] = await this.db.$transaction([
      this.db.auditLog.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.db.auditLog.count({ where }),
    ]);

    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  logAction(data: {
    entity: string;
    entity_id: string;
    action: AuditAction;
    actor_ref: string;
    actor_id?: string;
    before?: Prisma.InputJsonValue;
    after?: Prisma.InputJsonValue;
    ip_address?: string;
  }): Promise<AuditLog> {
    return this.db.auditLog.create({ data });
  }
}
