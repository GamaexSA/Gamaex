import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerModule } from "@nestjs/throttler";
import { DatabaseModule } from "./modules/database/database.module";
import { RatesModule } from "./modules/rates/rates.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CurrenciesModule } from "./modules/currencies/currencies.module";
import { AuditModule } from "./modules/audit/audit.module";
import { WhatsAppModule } from "./modules/whatsapp/whatsapp.module";
import { AiModule } from "./modules/ai/ai.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env", "../../.env.local", "../../.env"],
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{ name: "public", ttl: 60_000, limit: 60 }]),
    DatabaseModule,
    RatesModule,
    AuthModule,
    CurrenciesModule,
    AuditModule,
    WhatsAppModule,
    AiModule,
    UsersModule,
  ],
})
export class AppModule {}
