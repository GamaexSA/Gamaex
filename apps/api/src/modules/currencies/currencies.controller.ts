import { Controller, Get, Patch, Post, Body, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrenciesService } from "./currencies.service";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@UseGuards(JwtAuthGuard)
@Controller("currencies")
export class CurrenciesController {
  constructor(private readonly svc: CurrenciesService) {}

  @Get()
  listAll() {
    return this.svc.listAll();
  }

  @Patch(":code/margins")
  updateMargins(
    @Param("code") code: string,
    @Body() dto: { buy_margin: number; sell_margin: number },
    @CurrentUser("email") email: string,
  ) {
    return this.svc.updateMargins(code, dto, `user:${email}`);
  }

  @Patch(":code/manual")
  setManual(
    @Param("code") code: string,
    @Body() dto: { manual_buy: number; manual_sell: number },
    @CurrentUser("email") email: string,
  ) {
    return this.svc.setManualPrices(code, dto, `user:${email}`);
  }

  @Patch(":code/switch-auto")
  switchAuto(
    @Param("code") code: string,
    @CurrentUser("email") email: string,
  ) {
    return this.svc.switchToAuto(code, `user:${email}`);
  }

  @Patch(":code/toggle")
  toggle(
    @Param("code") code: string,
    @CurrentUser("email") email: string,
  ) {
    return this.svc.toggleActive(code, `user:${email}`);
  }

  @Post(":code/force-sync")
  forceSync(
    @Param("code") code: string,
    @CurrentUser("email") email: string,
  ) {
    return this.svc.forceSync(code, `user:${email}`);
  }
}
