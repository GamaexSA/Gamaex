import { Injectable, Inject, NotFoundException, ConflictException } from "@nestjs/common";
import { PrismaClient, AdminRole } from "@gamaex/database";
import { PRISMA_TOKEN } from "../database/database.module";
import * as bcrypt from "bcrypt";

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
  role: AdminRole;
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
  role?: AdminRole;
}

@Injectable()
export class UsersService {
  constructor(@Inject(PRISMA_TOKEN) private readonly db: PrismaClient) {}

  listAll() {
    return this.db.adminUser.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        is_active: true,
        last_login_at: true,
        created_at: true,
      },
      orderBy: { created_at: "asc" },
    });
  }

  async create(dto: CreateUserDto) {
    const existing = await this.db.adminUser.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException("Ya existe un usuario con ese email");

    const password_hash = await bcrypt.hash(dto.password, 12);
    return this.db.adminUser.create({
      data: { email: dto.email, name: dto.name, password_hash, role: dto.role },
      select: { id: true, email: true, name: true, role: true, is_active: true, created_at: true },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOrFail(id);
    if (dto.email) {
      const conflict = await this.db.adminUser.findFirst({
        where: { email: dto.email, NOT: { id } },
      });
      if (conflict) throw new ConflictException("Ya existe un usuario con ese email");
    }
    return this.db.adminUser.update({
      where: { id },
      data: dto,
      select: { id: true, email: true, name: true, role: true, is_active: true },
    });
  }

  async toggle(id: string) {
    const user = await this.findOrFail(id);
    return this.db.adminUser.update({
      where: { id },
      data: { is_active: !user.is_active },
      select: { id: true, email: true, name: true, is_active: true },
    });
  }

  async resetPassword(id: string, newPassword: string) {
    await this.findOrFail(id);
    const password_hash = await bcrypt.hash(newPassword, 12);
    await this.db.adminUser.update({ where: { id }, data: { password_hash } });
    return { ok: true };
  }

  private async findOrFail(id: string) {
    const user = await this.db.adminUser.findUnique({ where: { id } });
    if (!user) throw new NotFoundException("Usuario no encontrado");
    return user;
  }
}
