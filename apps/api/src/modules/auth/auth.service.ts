import { Injectable, Inject, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { PrismaClient } from "@gamaex/database";
import { PRISMA_TOKEN } from "../database/database.module";

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(PRISMA_TOKEN) private readonly db: PrismaClient,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.db.adminUser.findUnique({ where: { email } });
    if (!user || !user.is_active) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw new UnauthorizedException("Credenciales inválidas");

    await this.db.adminUser.update({
      where: { id: user.id },
      data: { last_login_at: new Date() },
    });

    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };

    const access_token = await this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow<string>("JWT_SECRET"),
      expiresIn: this.config.get<string>("JWT_EXPIRES_IN") ?? "15m",
    });

    const refresh_token = await this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow<string>("JWT_REFRESH_SECRET"),
      expiresIn: this.config.get<string>("JWT_REFRESH_EXPIRES_IN") ?? "7d",
    });

    return {
      access_token,
      refresh_token,
      expires_in: 900,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }

  async refresh(token: string) {
    try {
      const payload = await this.jwt.verifyAsync<JwtPayload>(token, {
        secret: this.config.getOrThrow<string>("JWT_REFRESH_SECRET"),
      });

      const user = await this.db.adminUser.findUnique({ where: { id: payload.sub } });
      if (!user || !user.is_active) throw new UnauthorizedException();

      const access_token = await this.jwt.signAsync(
        { sub: user.id, email: user.email, role: user.role } satisfies JwtPayload,
        {
          secret: this.config.getOrThrow<string>("JWT_SECRET"),
          expiresIn: this.config.get<string>("JWT_EXPIRES_IN") ?? "15m",
        },
      );

      return { access_token, expires_in: 900 };
    } catch {
      throw new UnauthorizedException("Token de refresco inválido o expirado");
    }
  }

  async getMe(userId: string) {
    return this.db.adminUser.findUniqueOrThrow({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, last_login_at: true },
    });
  }
}
