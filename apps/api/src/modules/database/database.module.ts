import { Module, Global, OnApplicationShutdown } from "@nestjs/common";
import { prisma } from "@gamaex/database";

export const PRISMA_TOKEN = "PRISMA_CLIENT";

@Global()
@Module({
  providers: [
    {
      provide: PRISMA_TOKEN,
      useValue: prisma,
    },
  ],
  exports: [PRISMA_TOKEN],
})
export class DatabaseModule implements OnApplicationShutdown {
  async onApplicationShutdown() {
    await prisma.$disconnect();
  }
}
