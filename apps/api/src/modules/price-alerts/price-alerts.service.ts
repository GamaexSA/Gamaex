import {
  Injectable,
  Inject,
  Logger,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Resend } from "resend";
import { PrismaClient, PriceAlertStatus, PriceAlertOperation } from "@gamaex/database";
import { PRISMA_TOKEN } from "../database/database.module";
import { RatesService } from "../rates/rates.service";

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

interface TriggeredAlert {
  alert: {
    id: string;
    name: string;
    whatsapp: string;
    currency_code: string;
    operation: PriceAlertOperation;
    target_price: number;
    amount: number | null;
  };
  current_price: number;
  diff: number;
}

@Injectable()
export class PriceAlertsService {
  private readonly logger = new Logger(PriceAlertsService.name);

  constructor(
    @Inject(PRISMA_TOKEN) private readonly db: PrismaClient,
    private readonly config: ConfigService,
    private readonly rates: RatesService,
  ) {}

  // ─── Crear alerta ─────────────────────────────────────────────────────────

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

    return { id: alert.id };
  }

  // ─── Listar / stats ───────────────────────────────────────────────────────

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
    return {
      by_currency: pending.map((r) => ({ currency: r.currency_code, count: r._count.id })),
      total_pending,
    };
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

  // ─── Cron: verificar precios cada 5 minutos ───────────────────────────────

  @Cron(CronExpression.EVERY_5_MINUTES)
  async checkPriceAlerts(): Promise<void> {
    const now = new Date();
    const cooldownCutoff = new Date(now.getTime() - 6 * 60 * 60 * 1000);

    const pending = await this.db.priceAlert.findMany({
      where: {
        status:     PriceAlertStatus.PENDING,
        expires_at: { gt: now },
        OR: [
          { last_notified_at: null },
          { last_notified_at: { lt: cooldownCutoff } },
        ],
      },
    });

    if (!pending.length) return;

    let ratesData: { rates: { code: string; buy: number; sell: number }[] };
    try {
      ratesData = await this.rates.getPublicRates();
    } catch {
      this.logger.warn("checkPriceAlerts: no se pudo obtener tasas");
      return;
    }

    const rateMap = new Map(ratesData.rates.map((r) => [r.code, r]));
    const triggered: TriggeredAlert[] = [];

    for (const alert of pending) {
      const rate = rateMap.get(alert.currency_code);
      if (!rate) continue;

      const currentPrice = alert.operation === PriceAlertOperation.BUY ? rate.sell : rate.buy;
      const reached =
        alert.operation === PriceAlertOperation.BUY
          ? currentPrice <= alert.target_price
          : currentPrice >= alert.target_price;

      if (reached) {
        triggered.push({ alert, current_price: currentPrice, diff: currentPrice - alert.target_price });
      }
    }

    if (!triggered.length) return;

    this.logger.log(`checkPriceAlerts: ${triggered.length} alerta(s) activada(s)`);
    await this.sendEmailTriggered(triggered);
    await this.db.priceAlert.updateMany({
      where: { id: { in: triggered.map((t) => t.alert.id) } },
      data:  { last_notified_at: now },
    });
  }

  // ─── Cron: expirar alertas vencidas a medianoche ──────────────────────────

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async expireOldAlerts(): Promise<void> {
    const { count } = await this.db.priceAlert.updateMany({
      where: { status: PriceAlertStatus.PENDING, expires_at: { lt: new Date() } },
      data:  { status: PriceAlertStatus.EXPIRED },
    });
    if (count > 0) this.logger.log(`expireOldAlerts: ${count} alerta(s) expirada(s)`);
  }

  // ─── Emails ───────────────────────────────────────────────────────────────

  private async sendEmailTriggered(triggered: TriggeredAlert[]) {
    const adminUrl = `${this.config.get("ADMIN_URL") ?? "https://admin.gamaex.cl"}/price-alerts`;
    const count    = triggered.length;

    const alertRows = triggered.map((t) => {
      const op      = t.alert.operation === PriceAlertOperation.BUY ? "Comprar" : "Vender";
      const diffStr = t.diff === 0
        ? "exacto"
        : `${t.diff > 0 ? "+" : ""}${t.diff.toLocaleString("es-CL")} del objetivo`;

      return `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #1e2e2a;font-weight:600">${t.alert.name}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #1e2e2a">${t.alert.whatsapp}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #1e2e2a;font-weight:600">${t.alert.currency_code}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #1e2e2a">${op}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #1e2e2a;font-family:monospace">$${t.alert.target_price.toLocaleString("es-CL")}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #1e2e2a;font-family:monospace;color:#C9A84C">$${t.current_price.toLocaleString("es-CL")}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #1e2e2a;font-size:12px;color:#8A8780">${diffStr}</td>
        </tr>`;
    }).join("");

    const html = this.wrapEmail(
      `🎯 ${count} alerta${count > 1 ? "s" : ""} activada${count > 1 ? "s" : ""} — precio objetivo alcanzado`,
      `<p style="color:#C8C6C0;margin:0 0 20px">
        ${count > 1 ? `Estos ${count} clientes` : "Este cliente"} registró un precio objetivo que ya fue alcanzado.
        Contactalos por WhatsApp para coordinar la operación.
      </p>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <thead>
            <tr style="background:#141e1b">
              <th style="padding:10px 12px;text-align:left;color:#8A8780;font-size:11px;text-transform:uppercase;letter-spacing:.05em">Cliente</th>
              <th style="padding:10px 12px;text-align:left;color:#8A8780;font-size:11px;text-transform:uppercase;letter-spacing:.05em">WhatsApp</th>
              <th style="padding:10px 12px;text-align:left;color:#8A8780;font-size:11px;text-transform:uppercase;letter-spacing:.05em">Moneda</th>
              <th style="padding:10px 12px;text-align:left;color:#8A8780;font-size:11px;text-transform:uppercase;letter-spacing:.05em">Op.</th>
              <th style="padding:10px 12px;text-align:left;color:#8A8780;font-size:11px;text-transform:uppercase;letter-spacing:.05em">Objetivo</th>
              <th style="padding:10px 12px;text-align:left;color:#8A8780;font-size:11px;text-transform:uppercase;letter-spacing:.05em">Actual</th>
              <th style="padding:10px 12px;text-align:left;color:#8A8780;font-size:11px;text-transform:uppercase;letter-spacing:.05em">Diferencia</th>
            </tr>
          </thead>
          <tbody style="color:#E8E6E1">${alertRows}</tbody>
        </table>
      </div>
      <div style="margin-top:24px;text-align:center">
        <a href="${adminUrl}" style="display:inline-block;background:#C9A84C;color:#0A0F0D;padding:12px 28px;border-radius:10px;font-weight:700;text-decoration:none;font-size:14px">
          Gestionar alertas →
        </a>
      </div>`,
    );

    await this.sendEmail({
      subject: `🎯 ${count} alerta${count > 1 ? "s" : ""} de precio activada${count > 1 ? "s" : ""} — Gamaex`,
      html,
    });
  }

  // ─── Email helpers ────────────────────────────────────────────────────────

  private async sendEmail(opts: {
    subject: string;
    html?: string;
    title?: string;
    intro?: string;
    rows?: [string, string][];
    cta?: { label: string; url: string };
  }) {
    const apiKey = this.config.get("RESEND_API_KEY");
    const to     = this.config.get("TEAM_EMAIL") ?? "gamaex@gmail.com";
    const from   = this.config.get("EMAIL_FROM") ?? "alertas@gamaex.cl";

    if (!apiKey) {
      this.logger.warn("RESEND_API_KEY no configurado — email no enviado");
      return;
    }

    let html = opts.html;

    if (!html && opts.title) {
      const rowsHtml = (opts.rows ?? []).map(([label, value]) => `
        <tr>
          <td style="padding:8px 0;color:#8A8780;font-size:13px;width:140px">${label}</td>
          <td style="padding:8px 0;color:#E8E6E1;font-size:13px;font-weight:500">${value}</td>
        </tr>`).join("");

      const ctaHtml = opts.cta
        ? `<div style="text-align:center;margin-top:28px">
            <a href="${opts.cta.url}" style="display:inline-block;background:#C9A84C;color:#0A0F0D;padding:12px 28px;border-radius:10px;font-weight:700;text-decoration:none;font-size:14px">
              ${opts.cta.label} →
            </a>
           </div>`
        : "";

      html = this.wrapEmail(
        opts.title,
        `${opts.intro ? `<p style="color:#C8C6C0;margin:0 0 20px">${opts.intro}</p>` : ""}
         <table style="width:100%;border-collapse:collapse">${rowsHtml}</table>
         ${ctaHtml}`,
      );
    }

    try {
      const resend = new Resend(apiKey);
      const { error } = await resend.emails.send({
        from,
        to,
        subject: opts.subject,
        html:    html ?? "",
      });
      if (error) this.logger.warn("Resend error:", error);
    } catch (err) {
      this.logger.warn("Email falló:", err);
    }
  }

  private wrapEmail(title: string, body: string): string {
    return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0A0F0D;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0F0D;padding:32px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">
        <!-- Header -->
        <tr>
          <td style="background:#111916;border:1px solid #2A3330;border-radius:14px 14px 0 0;padding:24px 32px;border-bottom:1px solid rgba(201,168,76,0.25)">
            <span style="font-size:20px;font-weight:700;letter-spacing:.15em;color:#C9A84C">GAMAEX</span>
            <span style="font-size:11px;color:#6A6860;margin-left:12px;text-transform:uppercase;letter-spacing:.1em">Casa de cambio</span>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="background:#111916;border:1px solid #2A3330;border-top:none;padding:28px 32px">
            <h2 style="margin:0 0 20px;font-size:18px;font-weight:600;color:#E8E6E1;letter-spacing:-.01em">${title}</h2>
            ${body}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#0D1511;border:1px solid #2A3330;border-top:none;border-radius:0 0 14px 14px;padding:16px 32px;text-align:center">
            <p style="margin:0;font-size:11px;color:#4A5350">Gamaex · Av. Pedro de Valdivia 020, Providencia · gamaex@gmail.com</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private validate(dto: CreateDto) {
    if (!dto.name?.trim())          throw new BadRequestException("El nombre es requerido");
    if (!dto.whatsapp?.trim())      throw new BadRequestException("El WhatsApp es requerido");
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
}
