import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaClient, QuoteMode, SnapshotSource, AuditAction } from "@gamaex/database";
import { PRISMA_TOKEN } from "../database/database.module";
import { RatesService } from "../rates/rates.service";

@Injectable()
export class CurrenciesService {
  constructor(
    @Inject(PRISMA_TOKEN) private readonly db: PrismaClient,
    private readonly rates: RatesService,
  ) {}

  listAll() {
    return this.db.currency.findMany({
      include: { quote_config: true },
      orderBy: { display_order: "asc" },
    });
  }

  async updateMargins(
    code: string,
    dto: { buy_margin: number; sell_margin: number },
    actorRef: string,
  ) {
    const currency = await this.getByCode(code);
    const config = currency.quote_config;
    if (!config) throw new BadRequestException("Moneda sin configuración de precios");

    const before = { buy_margin: config.buy_margin, sell_margin: config.sell_margin };

    let currentBuy = config.current_buy;
    let currentSell = config.current_sell;

    if (config.mode === QuoteMode.AUTO && config.last_base_price) {
      const result = this.rates.calculatePrices(
        { ...config, buy_margin: dto.buy_margin, sell_margin: dto.sell_margin },
        config.last_base_price,
        currency.decimal_places,
      );
      currentBuy = result.buy;
      currentSell = result.sell;
    }

    const snapshotOp =
      config.mode === QuoteMode.AUTO && config.last_base_price && currentBuy && currentSell
        ? [
            this.db.quoteSnapshot.create({
              data: {
                currency_id: currency.id,
                base_price: config.last_base_price,
                buy_price: currentBuy,
                sell_price: currentSell,
                buy_margin: dto.buy_margin,
                sell_margin: dto.sell_margin,
                mode: QuoteMode.AUTO,
                source: SnapshotSource.ADMIN_PANEL,
                source_meta: actorRef,
              },
            }),
          ]
        : [];

    await this.db.$transaction([
      this.db.quoteConfig.update({
        where: { id: config.id },
        data: {
          buy_margin: dto.buy_margin,
          sell_margin: dto.sell_margin,
          current_buy: currentBuy,
          current_sell: currentSell,
          last_synced_by: actorRef,
        },
      }),
      ...snapshotOp,
      this.db.auditLog.create({
        data: {
          entity: "quote_config",
          entity_id: config.id,
          action: AuditAction.UPDATE_MARGINS,
          actor_ref: actorRef,
          before,
          after: dto,
        },
      }),
    ]);

    return { ok: true };
  }

  async setManualPrices(
    code: string,
    dto: { manual_buy: number; manual_sell: number },
    actorRef: string,
  ) {
    const currency = await this.getByCode(code);
    const config = currency.quote_config;
    if (!config) throw new BadRequestException("Moneda sin configuración de precios");

    // Auto-bump decimal_places si el precio ingresado tiene MÁS decimales
    // que los configurados. Antes truncábamos silenciosamente: usuario tipea
    // 8.7245 para yen pero como decimal_places=2 se guardaba 8.72.
    // Caso típico: yen, peso colombiano/argentino, monedas con precio bajo en CLP.
    const incomingDecimals = Math.max(
      countDecimals(dto.manual_buy),
      countDecimals(dto.manual_sell),
    );
    const d = Math.max(
      0,
      Math.min(8, Math.max(Math.trunc(currency.decimal_places), incomingDecimals)),
    );
    if (d !== currency.decimal_places) {
      await this.db.currency.update({
        where: { id: currency.id },
        data: { decimal_places: d },
      });
    }
    const manualBuy  = parseFloat(dto.manual_buy.toFixed(d));
    const manualSell = parseFloat(dto.manual_sell.toFixed(d));

    const before = {
      mode: config.mode,
      manual_buy: config.manual_buy,
      manual_sell: config.manual_sell,
      current_buy: config.current_buy,
      current_sell: config.current_sell,
    };

    await this.db.$transaction([
      this.db.quoteConfig.update({
        where: { id: config.id },
        data: {
          mode: QuoteMode.MANUAL,
          manual_buy: manualBuy,
          manual_sell: manualSell,
          current_buy: manualBuy,
          current_sell: manualSell,
          last_synced_at: new Date(),
          last_synced_by: actorRef,
        },
      }),
      this.db.quoteSnapshot.create({
        data: {
          currency_id: currency.id,
          base_price: config.last_base_price ?? 0,
          buy_price: manualBuy,
          sell_price: manualSell,
          buy_margin: config.buy_margin,
          sell_margin: config.sell_margin,
          mode: QuoteMode.MANUAL,
          source: SnapshotSource.ADMIN_PANEL,
          source_meta: actorRef,
        },
      }),
      this.db.auditLog.create({
        data: {
          entity: "quote_config",
          entity_id: config.id,
          action: AuditAction.SET_MANUAL_PRICES,
          actor_ref: actorRef,
          before,
          after: { manual_buy: manualBuy, manual_sell: manualSell, mode: "MANUAL" },
        },
      }),
    ]);

    return { ok: true };
  }

  async updateDecimalPlaces(
    code: string,
    dto: { decimal_places: number },
    actorRef: string,
  ) {
    const currency = await this.getByCode(code);
    const n = Math.trunc(dto.decimal_places);
    if (!Number.isFinite(n) || n < 0 || n > 8) {
      throw new BadRequestException("decimal_places debe ser un entero entre 0 y 8");
    }
    if (n === currency.decimal_places) {
      return { ok: true, decimal_places: n, recalculated: false };
    }

    const before = { decimal_places: currency.decimal_places };
    const config = currency.quote_config;

    let currentBuy = config?.current_buy ?? null;
    let currentSell = config?.current_sell ?? null;
    let recalculated = false;

    if (config) {
      if (config.mode === QuoteMode.AUTO && config.last_base_price) {
        const result = this.rates.calculatePrices(config, config.last_base_price, n);
        currentBuy = result.buy;
        currentSell = result.sell;
        recalculated = true;
      } else if (config.mode === QuoteMode.MANUAL && config.manual_buy != null && config.manual_sell != null) {
        currentBuy = parseFloat(config.manual_buy.toFixed(n));
        currentSell = parseFloat(config.manual_sell.toFixed(n));
        recalculated = true;
      }
    }

    const updateConfigOp =
      config && recalculated
        ? [
            this.db.quoteConfig.update({
              where: { id: config.id },
              data: { current_buy: currentBuy, current_sell: currentSell },
            }),
          ]
        : [];

    await this.db.$transaction([
      this.db.currency.update({
        where: { id: currency.id },
        data: { decimal_places: n },
      }),
      ...updateConfigOp,
      this.db.auditLog.create({
        data: {
          entity: "currency",
          entity_id: currency.id,
          action: AuditAction.UPDATE_CURRENCY,
          actor_ref: actorRef,
          before,
          after: { decimal_places: n },
        },
      }),
    ]);

    return { ok: true, decimal_places: n, recalculated };
  }

  async switchToAuto(code: string, actorRef: string) {
    const currency = await this.getByCode(code);
    const config = currency.quote_config;
    if (!config) throw new BadRequestException("Moneda sin configuración de precios");

    const before = { mode: config.mode };

    let currentBuy = config.current_buy;
    let currentSell = config.current_sell;

    if (config.last_base_price) {
      const result = this.rates.calculatePrices(
        { ...config, mode: QuoteMode.AUTO, manual_buy: null, manual_sell: null },
        config.last_base_price,
        currency.decimal_places,
      );
      currentBuy = result.buy;
      currentSell = result.sell;
    }

    await this.db.$transaction([
      this.db.quoteConfig.update({
        where: { id: config.id },
        data: {
          mode: QuoteMode.AUTO,
          manual_buy: null,
          manual_sell: null,
          current_buy: currentBuy,
          current_sell: currentSell,
          last_synced_by: actorRef,
        },
      }),
      this.db.auditLog.create({
        data: {
          entity: "quote_config",
          entity_id: config.id,
          action: AuditAction.SWITCH_TO_AUTO,
          actor_ref: actorRef,
          before,
          after: { mode: "AUTO" },
        },
      }),
    ]);

    return { ok: true };
  }

  async toggleActive(code: string, actorRef: string) {
    const currency = await this.getByCode(code);
    const newActive = !currency.is_active;

    await this.db.$transaction([
      this.db.currency.update({
        where: { id: currency.id },
        data: { is_active: newActive },
      }),
      this.db.auditLog.create({
        data: {
          entity: "currency",
          entity_id: currency.id,
          action: AuditAction.TOGGLE_CURRENCY_ACTIVE,
          actor_ref: actorRef,
          before: { is_active: currency.is_active },
          after: { is_active: newActive },
        },
      }),
    ]);

    return { ok: true, is_active: newActive };
  }

  forceSync(code: string, actorRef: string) {
    return this.rates.forceSync([code], actorRef);
  }

  private async getByCode(code: string) {
    const currency = await this.db.currency.findUnique({
      where: { code: code.toUpperCase() },
      include: { quote_config: true },
    });
    if (!currency) throw new NotFoundException(`Moneda '${code}' no encontrada`);
    return currency;
  }
}

/**
 * Cuenta cuántos decimales tiene un número, ignorando ceros al final.
 * Ej: 8.7245 → 4, 8.10 → 1, 8 → 0, 8.700 → 1.
 */
function countDecimals(value: number): number {
  if (!Number.isFinite(value)) return 0;
  // Usar toString para evitar el precision drift de exponentes (8.7245.toFixed).
  const str = value.toString();
  if (str.includes('e') || str.includes('E')) {
    // Notación científica: parsear el exponente.
    const match = /e([-+]?\d+)/i.exec(str);
    const exp = match && match[1] ? Math.abs(parseInt(match[1], 10)) : 0;
    return exp;
  }
  const dot = str.indexOf('.');
  if (dot === -1) return 0;
  return str.length - dot - 1;
}
