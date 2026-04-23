import { Controller, Get, Post, Param, UseGuards } from "@nestjs/common";
import { RatesService } from "./rates.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller("rates")
export class RatesController {
  constructor(private readonly rates: RatesService) {}

  /** Endpoint público — consumido por la web y la IA */
  @Get("public")
  getPublic() {
    return this.rates.getPublicRates();
  }

  @Get("public/:code")
  async getPublicByCode(@Param("code") code: string) {
    const r = await this.rates.getPublicRates();
    const rate = r.rates.find((x) => x.code === code.toUpperCase());
    if (!rate) return { ok: false, error: { code: "NOT_FOUND", message: `Moneda ${code} no encontrada` } };
    return { ok: true, data: rate };
  }

  /** Forzar sync inmediato de todas las monedas (requiere JWT) */
  @UseGuards(JwtAuthGuard)
  @Post("sync")
  forceSync(@CurrentUser("email") email: string) {
    return this.rates.forceSync(undefined, `user:${email}`);
  }
}
