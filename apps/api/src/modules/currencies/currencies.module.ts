import { Module } from "@nestjs/common";
import { CurrenciesService } from "./currencies.service";
import { CurrenciesController } from "./currencies.controller";
import { RatesModule } from "../rates/rates.module";

@Module({
  imports: [RatesModule],
  controllers: [CurrenciesController],
  providers: [CurrenciesService],
  exports: [CurrenciesService],
})
export class CurrenciesModule {}
