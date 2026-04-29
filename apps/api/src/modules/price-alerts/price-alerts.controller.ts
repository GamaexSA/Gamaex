import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Ip,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { PriceAlertsService } from "./price-alerts.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RatesService } from "../rates/rates.service";

@Controller("price-alerts")
export class PriceAlertsController {
  constructor(
    private readonly svc: PriceAlertsService,
    private readonly rates: RatesService,
  ) {}

  // ─── Público ──────────────────────────────────────────────────────────────

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  async create(
    @Body() body: {
      name: string;
      whatsapp: string;
      currency_code: string;
      operation: "BUY" | "SELL";
      target_price: number;
      amount?: number;
      comment?: string;
    },
    @Ip() _ip: string,
  ) {
    const ratesData = await this.rates.getPublicRates().catch(() => ({ rates: [] as { code: string; buy: number; sell: number }[] }));
    const rate = ratesData.rates.find((r) => r.code === body.currency_code?.toUpperCase());

    return this.svc.create({
      ...body,
      ...(rate?.buy  !== undefined ? { price_buy_ref:  rate.buy  } : {}),
      ...(rate?.sell !== undefined ? { price_sell_ref: rate.sell } : {}),
    });
  }

  // ─── Admin ────────────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Get()
  list(
    @Query("page")      page      = "1",
    @Query("limit")     limit     = "50",
    @Query("status")    status    = "",
    @Query("currency")  currency  = "",
    @Query("operation") operation = "",
  ) {
    const filters: { status?: string; currency?: string; operation?: string } = {};
    if (status)    filters.status    = status;
    if (currency)  filters.currency  = currency;
    if (operation) filters.operation = operation;
    return this.svc.list(parseInt(page, 10), parseInt(limit, 10), filters);
  }

  @UseGuards(JwtAuthGuard)
  @Get("stats")
  stats() {
    return this.svc.stats();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id/status")
  updateStatus(
    @Param("id") id: string,
    @Body() body: { status: string; note?: string },
  ) {
    return this.svc.updateStatus(id, body.status, body.note);
  }
}
