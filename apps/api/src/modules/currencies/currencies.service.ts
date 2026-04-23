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
          manual_buy: dto.manual_buy,
          manual_sell: dto.manual_sell,
          current_buy: dto.manual_buy,
          current_sell: dto.manual_sell,
          last_synced_at: new Date(),
          last_synced_by: actorRef,
        },
      }),
      this.db.quoteSnapshot.create({
        data: {
          currency_id: currency.id,
          base_price: config.last_base_price ?? 0,
          buy_price: dto.manual_buy,
          sell_price: dto.manual_sell,
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
          after: { ...dto, mode: "MANUAL" },
        },
      }),
    ]);

    return { ok: true };
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
