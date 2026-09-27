import { Injectable, Logger, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cron } from "@nestjs/schedule";
import { PrismaClient, QuoteMode, SnapshotSource } from "@gamaex/database";
import type { PublicRate, PublicRatesResponse } from "@gamaex/types";
import { PRISMA_TOKEN } from "../database/database.module";

// Umbral de variación permitida antes de rechazar precio de la referencia
const MAX_DELTA_PERCENT = 15;

const DEFAULT_REFERENCE_URL = "https://valoreslive.firebaseio.com/.json";

export type ReferencePrice = { buy: number; sell: number };

@Injectable()
export class RatesService {
  private readonly logger = new Logger(RatesService.name);

  constructor(
    @Inject(PRISMA_TOKEN) private readonly db: PrismaClient,
    private readonly config: ConfigService,
  ) {}

  // ─── Sync desde la pizarra de Cambios Santiago ───────────────────────────
  // Referencia: Firebase público de cstgo.cl (pizarra en vivo, 23 monedas).
  // Solo se sincronizan las monedas en modo AUTO; las MANUAL no se tocan.
  // Precio Gamaex = compra de referencia + buy_margin / venta de referencia + sell_margin
  // (con buy_margin = +1 y sell_margin = -1 Gamaex paga 1 peso más y cobra 1 peso menos).

  @Cron("0 */5 9-17 * * 1-6", { name: "sync-cambios-santiago", timeZone: "America/Santiago" })
  async syncAll(): Promise<void> {
    if (!isBusinessHours(new Date())) return;
    try {
      const { updated, skipped } = await this.syncCurrencies(undefined, "system:cron", SnapshotSource.CRON_AUTO);
      if (updated || skipped) this.logger.log(`Sync OK — ${updated} actualizadas, ${skipped} omitidas`);
    } catch (err) {
      this.logger.error("Sync falló:", err);
    }
  }

  // ─── Lógica de precios ───────────────────────────────────────────────────

  calculatePrices(
    config: { mode: QuoteMode; buy_margin: number; sell_margin: number; manual_buy: number | null; manual_sell: number | null },
    ref: ReferencePrice | null,
    decimalPlaces = 2,
  ): { buy: number; sell: number } {
    const d = Math.max(0, Math.min(8, Math.trunc(decimalPlaces)));
    if (config.mode === QuoteMode.MANUAL) {
      if (config.manual_buy === null || config.manual_sell === null) {
        throw new Error("Modo MANUAL activo pero sin precios manuales definidos");
      }
      return {
        buy:  parseFloat(config.manual_buy.toFixed(d)),
        sell: parseFloat(config.manual_sell.toFixed(d)),
      };
    }

    if (!ref) throw new Error("Modo AUTO sin precio de referencia");
    if (!(ref.buy > 0) || !(ref.sell > ref.buy)) {
      throw new Error(`Referencia inválida: compra ${ref.buy} / venta ${ref.sell}`);
    }

    const buy  = parseFloat((ref.buy + config.buy_margin).toFixed(d));
    const sell = parseFloat((ref.sell + config.sell_margin).toFixed(d));
    if (!(buy > 0) || !(buy < sell)) {
      throw new Error(`Márgenes dejan precios inválidos: compra ${buy} / venta ${sell}`);
    }
    return { buy, sell };
  }

  referenceMid(ref: ReferencePrice): number {
    return parseFloat(((ref.buy + ref.sell) / 2).toFixed(4));
  }

  // ─── Respuesta pública ───────────────────────────────────────────────────

  async getPublicRates(): Promise<PublicRatesResponse> {
    const currencies = await this.db.currency.findMany({
      where: { is_active: true },
      include: { quote_config: true },
      orderBy: { display_order: "asc" },
    });

    const rates: PublicRate[] = currencies
      .filter((c) => c.quote_config?.current_buy && c.quote_config?.current_sell)
      .map((c) => ({
        code:           c.code,
        name:           c.name,
        flag_emoji:     c.flag_emoji,
        buy:            c.quote_config!.current_buy!,
        sell:           c.quote_config!.current_sell!,
        decimal_places: c.decimal_places,
        mode:           c.quote_config!.mode as "AUTO" | "MANUAL",
        last_updated:   c.quote_config!.last_synced_at?.toISOString() ?? new Date().toISOString(),
      }));

    const lastSync = currencies
      .map((c) => c.quote_config?.last_synced_at)
      .filter(Boolean)
      .sort((a, b) => b!.getTime() - a!.getTime())[0];

    const minutesSinceSync = lastSync
      ? (Date.now() - lastSync.getTime()) / 60_000
      : Infinity;

    // Con precios manuales el admin actualiza una o dos veces al día.
    // stale > 48h, degraded > 24h, ok en cualquier otro caso.
    const status =
      minutesSinceSync > 2880 ? "stale" :
      minutesSinceSync > 1440 ? "degraded" : "ok";

    return {
      rates,
      system_status: status,
      last_sync_at: lastSync?.toISOString() ?? "",
      cache_ttl_seconds: 60,
    };
  }

  // ─── Sync forzado ────────────────────────────────────────────────────────

  async forceSync(
    codes?: string[],
    actorRef?: string,
  ): Promise<{ updated: number; skipped: number }> {
    const result = await this.syncCurrencies(codes, actorRef ?? "system:manual", SnapshotSource.API_FORCE_SYNC);
    this.logger.log(`forceSync: ${result.updated} actualizadas, ${result.skipped} omitidas`);
    return result;
  }

  // ─── Sync común (cron + forzado) ─────────────────────────────────────────

  private async syncCurrencies(
    codes: string[] | undefined,
    actorRef: string,
    source: SnapshotSource,
  ): Promise<{ updated: number; skipped: number }> {
    const where = {
      is_active: true,
      quote_config: { mode: QuoteMode.AUTO },
      ...(codes?.length ? { code: { in: codes.map((c) => c.toUpperCase()) } } : {}),
    };

    const currencies = await this.db.currency.findMany({
      where,
      include: { quote_config: true },
    });
    if (!currencies.length) return { updated: 0, skipped: 0 };

    const refs = await this.fetchReference();
    const now = new Date();

    let updated = 0;
    let skipped = 0;

    for (const currency of currencies) {
      const config = currency.quote_config;
      if (!config) continue;

      const ref = refs[currency.code];
      if (!ref) {
        this.logger.warn(`Cambios Santiago no publica ${currency.code}`);
        skipped++;
        continue;
      }

      const mid = this.referenceMid(ref);

      // Circuit breaker: rechazar variaciones anómalas (ej. error de tipeo en la pizarra)
      if (config.last_base_price && config.last_base_price > 0) {
        const delta = Math.abs(mid - config.last_base_price) / config.last_base_price * 100;
        if (delta > MAX_DELTA_PERCENT) {
          await this.flagAlert(config.id, `${currency.code} varió ${delta.toFixed(1)}% en la referencia — se mantiene el último precio`);
          skipped++;
          continue;
        }
      }

      let prices: { buy: number; sell: number };
      try {
        prices = this.calculatePrices(config, ref, currency.decimal_places);
      } catch (err) {
        await this.flagAlert(config.id, `${currency.code}: ${(err as Error).message} — se mantiene el último precio`);
        skipped++;
        continue;
      }

      const changed = prices.buy !== config.current_buy || prices.sell !== config.current_sell;

      await this.db.$transaction([
        this.db.quoteConfig.update({
          where: { id: config.id },
          data: {
            current_buy: prices.buy,
            current_sell: prices.sell,
            last_base_price: mid,
            last_synced_at: now,
            last_synced_by: actorRef,
            price_alert_active: false,
            price_alert_reason: null,
          },
        }),
        // Snapshot solo cuando cambia el precio publicado, para no llenar el historial
        ...(changed
          ? [
              this.db.quoteSnapshot.create({
                data: {
                  currency_id: currency.id,
                  base_price: mid,
                  buy_price: prices.buy,
                  sell_price: prices.sell,
                  buy_margin: config.buy_margin,
                  sell_margin: config.sell_margin,
                  mode: config.mode,
                  source,
                  source_meta: `cambiossantiago ${ref.buy}/${ref.sell} · ${actorRef}`,
                },
              }),
            ]
          : []),
      ]);

      updated++;
    }

    return { updated, skipped };
  }

  private async flagAlert(configId: string, reason: string): Promise<void> {
    this.logger.error(`ALERTA: ${reason}`);
    await this.db.quoteConfig.update({
      where: { id: configId },
      data: { price_alert_active: true, price_alert_reason: reason },
    });
  }

  // ─── Referencia: pizarra de Cambios Santiago ─────────────────────────────

  async fetchReference(): Promise<Record<string, ReferencePrice>> {
    const url = this.config.get<string>("RATES_REFERENCE_URL") ?? DEFAULT_REFERENCE_URL;
    const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!response.ok) {
      throw new Error(`Cambios Santiago HTTP ${response.status}`);
    }

    const data = (await response.json()) as Record<string, { compra?: unknown; venta?: unknown }> | null;
    if (!data || typeof data !== "object") {
      throw new Error("Cambios Santiago devolvió una respuesta vacía");
    }

    const refs: Record<string, ReferencePrice> = {};
    for (const [code, row] of Object.entries(data)) {
      const buy = Number(row?.compra);
      const sell = Number(row?.venta);
      if (Number.isFinite(buy) && Number.isFinite(sell)) {
        refs[code.toUpperCase()] = { buy, sell };
      }
    }
    return refs;
  }

  /** Referencia de una sola moneda; null si la fuente falla o no la publica. */
  async fetchReferenceFor(code: string): Promise<ReferencePrice | null> {
    try {
      const refs = await this.fetchReference();
      return refs[code.toUpperCase()] ?? null;
    } catch (err) {
      this.logger.warn(`No se pudo leer la referencia de ${code}: ${(err as Error).message}`);
      return null;
    }
  }
}

// Horario de atención Gamaex (hora Chile): L-V 9:00-17:30, Sáb 9:00-13:00.
function isBusinessHours(date: Date): boolean {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Santiago",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const weekday = get("weekday");
  const minutes = Number(get("hour")) * 60 + Number(get("minute"));

  if (weekday === "Sun") return false;
  if (weekday === "Sat") return minutes >= 9 * 60 && minutes <= 13 * 60;
  return minutes >= 9 * 60 && minutes <= 17 * 60 + 30;
}
