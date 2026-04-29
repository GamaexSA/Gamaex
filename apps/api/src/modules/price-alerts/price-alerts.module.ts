import { Module } from "@nestjs/common";
import { PriceAlertsService } from "./price-alerts.service";
import { PriceAlertsController } from "./price-alerts.controller";
import { RatesModule } from "../rates/rates.module";

@Module({
  imports: [RatesModule],
  controllers: [PriceAlertsController],
  providers: [PriceAlertsService],
})
export class PriceAlertsModule {}
