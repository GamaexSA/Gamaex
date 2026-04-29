import {
  Injectable,
  Inject,
  Logger,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient, PriceAlertStatus, PriceAlertOperation } from "@gamaex/database";
import { PRISMA_TOKEN } from "../database/database.module";

interface CreateDto {
  name: string;
  whatsapp: string;
  currency_code: string;
  operation: "BUY" | "SELL";
  target_price: number;
  amount?: number;
  comment?: string;
  price_buy_ref?: number;
  price_sell_ref?: number;
}

@Injectable()
export class PriceAlertsService {
  private readonly logger = new Logger(PriceAlertsService.name);

  constructor(
    @Inject(PRISMA_TOKEN) private readonly db: PrismaClient,
    private readonly config: ConfigService,
  ) {}

  async create(dto: CreateDto): Promise<{ id: string }> {
    this.validate(dto);

    const existing = await this.db.priceAlert.count({
      where: { whatsapp: dto.whatsapp, status: PriceAlertStatus.PENDING },
    });
    if (existing >= 3) {
      throw new BadRequestException("Ya tienes 3 alertas activas para este número. Espera a que venzan o contacta a Gamaex.");
    }

    const expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + 7);

    const alert = await this.db.priceAlert.create({
      data: {
        name:           dto.name.trim(),
        whatsapp:       this.normalizePhone(dto.whatsapp),
        currency_code:  dto.currency_code.toUpperCase(),
        operation:      dto.operation as PriceAlertOperation,
        target_price:   dto.target_price,
        amount:         dto.amount ?? null,
        comment:        dto.comment?.trim().slice(0, 200) ?? null,
        price_buy_ref:  dto.price_buy_ref ?? null,
        price_sell_ref: dto.price_sell_ref ?? null,
        expires_at,
      },
    });

    this.notifyTeam(alert).catch(() => {});

    return { id: alert.id };
  }

  async list(page = 1, limit = 50, filters: {
    status?: string;
    currency?: string;
    operation?: string;
  }) {
    const where: Record<string, unknown> = {};
    if (filters.status)    where["status"]        = filters.status;
    if (filters.currency)  where["currency_code"] = filters.currency.toUpperCase();
    if (filters.operation) where["operation"]     = filters.operation;

    const [items, total] = await Promise.all([
      this.db.priceAlert.findMany({
        where,
        orderBy: { created_at: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
      this.db.priceAlert.count({ where }),
    ]);

    return { items, total, page, pages: Math.ceil(total / limit) };
  }

  async stats() {
    const pending = await this.db.priceAlert.groupBy({
      by: ["currency_code"],
      where: { status: PriceAlertStatus.PENDING },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });
    const total_pending = pending.reduce((s, r) => s + r._count.id, 0);
    return { by_currency: pending.map((r) => ({ currency: r.currency_code, count: r._count.id })), total_pending };
  }

  async updateStatus(id: string, status: string, note?: string) {
    const valid: PriceAlertStatus[] = [
      PriceAlertStatus.PENDING,
      PriceAlertStatus.CONTACTED,
      PriceAlertStatus.CLOSED,
      PriceAlertStatus.EXPIRED,
    ];
    if (!valid.includes(status as PriceAlertStatus)) {
      throw new BadRequestException(`Estado inválido: ${status}`);
    }

    const alert = await this.db.priceAlert.findUnique({ where: { id } });
    if (!alert) throw new NotFoundException("Alerta no encontrada");

    return this.db.priceAlert.update({
      where: { id },
      data: {
        status:      status as PriceAlertStatus,
        status_note: note?.trim() ?? null,
      },
    });
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private validate(dto: CreateDto) {
    if (!dto.name?.trim()) throw new BadRequestException("El nombre es requerido");
    if (!dto.whatsapp?.trim()) throw new BadRequestException("El WhatsApp es requerido");
    if (!["BUY", "SELL"].includes(dto.operation)) throw new BadRequestException("Operación inválida");
    if (!dto.currency_code?.trim()) throw new BadRequestException("La moneda es requerida");
    if (!dto.target_price || dto.target_price <= 0) throw new BadRequestException("El precio objetivo debe ser mayor a 0");

    const normalized = this.normalizePhone(dto.whatsapp);
    if (!/^\+\d{10,15}$/.test(normalized)) {
      throw new BadRequestException("Formato de WhatsApp inválido. Ejemplo: +56 9 1234 5678");
    }
  }

  private normalizePhone(phone: string): string {
    const digits = phone.replace(/\s/g, "");
    if (!digits.startsWith("+")) return "+" + digits.replace(/\D/g, "");
    return "+" + digits.slice(1).replace(/\D/g, "");
  }

  private async notifyTeam(alert: {
    name: string;
    whatsapp: string;
    currency_code: string;
    operation: PriceAlertOperation;
    target_price: number;
    amount: number | null;
    comment: string | null;
    expires_at: Date;
    price_buy_ref: number | null;
    price_sell_ref: number | null;
  }) {
    const token    = this.config.get("WHATSAPP_API_TOKEN");
    const phoneId  = this.config.get("WHATSAPP_PHONE_NUMBER_ID");
    const teamNum  = this.config.get("WHATSAPP_TEAM_NUMBER");
    if (!token || !phoneId || !teamNum) return;

    const opLabel  = alert.operation === PriceAlertOperation.BUY ? "COMPRAR" : "VENDER";
    const refPrice = alert.operation === PriceAlertOperation.BUY
      ? (alert.price_sell_ref ? `$${alert.price_sell_ref.toLocaleString("es-CL")} (venta actual)` : "—")
      : (alert.price_buy_ref  ? `$${alert.price_buy_ref.toLocaleString("es-CL")} (compra actual)` : "—");

    const lines = [
      `🔔 *Nueva Alerta de Precio — Gamaex*`,
      ``,
      `👤 ${alert.name}`,
      `📱 ${alert.whatsapp}`,
      `💱 ${alert.currency_code} · quiere *${opLabel}*`,
      `🎯 Objetivo: $${alert.target_price.toLocaleString("es-CL")}`,
      `📊 Precio actual: ${refPrice}`,
      alert.amount  ? `💵 Monto aprox.: ${alert.amount.toLocaleString("es-CL")}` : null,
      alert.comment ? `💬 Nota: ${alert.comment}` : null,
      ``,
      `Expira: ${alert.expires_at.toLocaleDateString("es-CL")}`,
    ].filter(Boolean).join("\n");

    try {
      const res = await fetch(
        `https://graph.facebook.com/v18.0/${phoneId}/messages`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: teamNum.replace(/\D/g, ""),
            type: "text",
            text: { body: lines },
          }),
        },
      );
      if (!res.ok) this.logger.warn(`WA outbound error: ${res.status}`);
    } catch (err) {
      this.logger.warn("No se pudo notificar al equipo por WhatsApp:", err);
    }
  }
}
