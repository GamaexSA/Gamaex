import { Injectable, Logger, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient, QuoteMode, SnapshotSource } from "@gamaex/database";
import type { PublicRate, PublicRatesResponse } from "@gamaex/types";
import { PRISMA_TOKEN } from "../database/database.module";

// Umbral de variación permitida antes de rechazar precio del proveedor
const MAX_DELTA_PERCENT = 15;

@Injectable()
export class RatesService {
  private readonly logger = new Logger(RatesService.name);

  constructor(
    @Inject(PRISMA_TOKEN) private readonly db: PrismaClient,
    private readonly config: ConfigService,
  ) {}

  // ─── Sync desde proveedor externo ────────────────────────────────────────
  // Requiere EXCHANGE_RATES_API_KEY configurada (plan Basic o superior).
  // Para el lanzamiento inicial usar solo precios manuales desde el panel admin.

  async syncAll(): Promise<void> {
    this.logger.log("Iniciando sync de tasas...");

    try {
      const currencies = await this.db.currency.findMany({
        where: { is_active: true },
        include: { quote_config: true },
      });

      const codes = currencies.map((c) => c.code);
      const baseRates = await this.fetchFromProvider(codes);

      let updated = 0;
      let skipped = 0;

      for (const currency of currencies) {
        const config = currency.quote_config;
        if (!config) continue;

        const base = baseRates[currency.code];
        if (base === undefined) {
          this.logger.warn(`Proveedor no devolvió tasa para ${currency.code}`);
          skipped++;
          continue;
        }

        // Circuit breaker: rechazar variaciones anómalas
        if (config.last_base_price && config.last_base_price > 0) {
          const delta =
            Math.abs(base - config.last_base_price) / config.last_base_price * 100;
          if (delta > MAX_DELTA_PERCENT) {
            this.logger.error(
              `ALERTA: ${currency.code} varió ${delta.toFixed(1)}% — rechazando precio del proveedor`,
            );
            await this.db.quoteConfig.update({
              where: { id: config.id },
              data: {
                price_alert_active: true,
                price_alert_reason: `Delta anómalo: ${delta.toFixed(1)}% — esperado < ${MAX_DELTA_PERCENT}%`,
              },
            });
            skipped++;
            continue;
          }
        }

        const { buy, sell } = this.calculatePrices(config, base);

        await this.db.$transaction([
          this.db.quoteConfig.update({
            where: { id: config.id },
            data: {
              current_buy: buy,
              current_sell: sell,
              last_base_price: base,
              last_synced_at: new Date(),
              last_synced_by: "system:cron",
              price_alert_active: false,
              price_alert_reason: null,
            },
          }),
          this.db.quoteSnapshot.create({
            data: {
              currency_id: currency.id,
              base_price: base,
              buy_price: buy,
              sell_price: sell,
              buy_margin: config.buy_margin,
              sell_margin: config.sell_margin,
              mode: config.mode,
              source: SnapshotSource.CRON_AUTO,
              source_meta: "exchangeratesapi",
            },
          }),
        ]);

        updated++;
      }

      this.logger.log(`Sync OK — ${updated} actualizadas, ${skipped} omitidas`);
    } catch (err) {
      this.logger.error("Sync falló:", err);
    }
  }

  // ─── Lógica de precios ───────────────────────────────────────────────────

  calculatePrices(
    config: { mode: QuoteMode; buy_margin: number; sell_margin: number; manual_buy: number | null; manual_sell: number | null },
    basePrice: number,
  ): { buy: number; sell: number } {
    if (config.mode === QuoteMode.MANUAL) {
      if (config.manual_buy === null || config.manual_sell === null) {
        throw new Error("Modo MANUAL activo pero sin precios manuales definidos");
      }
      return { buy: config.manual_buy, sell: config.manual_sell };
    }

    return {
      buy:  parseFloat((basePrice + config.buy_margin).toFixed(2)),
      sell: parseFloat((basePrice + config.sell_margin).toFixed(2)),
    };
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
    const where = codes?.length
      ? { is_active: true, code: { in: codes.map((c) => c.toUpperCase()) } }
      : { is_active: true };

    const currencies = await this.db.currency.findMany({
      where,
      include: { quote_config: true },
    });

    if (!currencies.length) return { updated: 0, skipped: 0 };

    const allCodes = currencies.map((c) => c.code);
    const baseRates = await this.fetchFromProvider(allCodes);

    let updated = 0;
    let skipped = 0;

    for (const currency of currencies) {
      const config = currency.quote_config;
      if (!config) continue;

      const base = baseRates[currency.code];
      if (base === undefined) { skipped++; continue; }

      const { buy, sell } = this.calculatePrices(config, base);

      await this.db.$transaction([
        this.db.quoteConfig.update({
          where: { id: config.id },
          data: {
            current_buy: buy,
            current_sell: sell,
            last_base_price: base,
            last_synced_at: new Date(),
            last_synced_by: actorRef ?? "system:manual",
            price_alert_active: false,
            price_alert_reason: null,
          },
        }),
        this.db.quoteSnapshot.create({
          data: {
            currency_id: currency.id,
            base_price: base,
            buy_price: buy,
            sell_price: sell,
            buy_margin: config.buy_margin,
            sell_margin: config.sell_margin,
            mode: config.mode,
            source: SnapshotSource.API_FORCE_SYNC,
            source_meta: actorRef ?? "manual",
          },
        }),
      ]);

      updated++;
    }

    this.logger.log(`forceSync: ${updated} actualizadas, ${skipped} omitidas`);
    return { updated, skipped };
  }

  // ─── Fetch del proveedor ─────────────────────────────────────────────────

  private async fetchFromProvider(
    codes: string[],
  ): Promise<Record<string, number>> {
    const apiKey = this.config.get("EXCHANGE_RATES_API_KEY");
    if (!apiKey || apiKey === "your_key_here") {
      throw new Error(
        "ExchangeRatesAPI no configurada. Establece precios manualmente desde el panel admin.",
      );
    }
    const baseUrl = this.config.get("EXCHANGE_RATES_API_URL") ?? "https://api.exchangeratesapi.io/v1";

    // ExchangeRatesAPI devuelve tasas con base EUR por defecto.
    // Para obtener CLP como base: fetchar con base=CLP y symbols=USD,EUR,...
    const symbols = codes.filter((c) => c !== "CLP").join(",");
    const url = `${baseUrl}/latest?access_key=${apiKey}&base=CLP&symbols=${symbols}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`ExchangeRatesAPI HTTP ${response.status}`);
    }

    const data = (await response.json()) as {
      success: boolean;
      rates: Record<string, number>;
      error?: { info: string };
    };

    if (!data.success) {
      throw new Error(`ExchangeRatesAPI error: ${data.error?.info}`);
    }

    // Las tasas vienen como CLP/USD (cuántos CLP por 1 USD), necesitamos USD/CLP
    const clpRates: Record<string, number> = {};
    for (const [code, rate] of Object.entries(data.rates)) {
      // rate = CLP por 1 unidad de moneda extranjera
      clpRates[code] = parseFloat((1 / rate).toFixed(4));
    }

    return clpRates;
  }
}
