import { Controller, Get, Post, Patch, Body, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard, Roles } from "../auth/guards/roles.guard";
import { UsersService, CreateUserDto, UpdateUserDto } from "./users.service";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("SUPER_ADMIN")
@Controller("users")
export class UsersController {
  constructor(private readonly svc: UsersService) {}

  @Get()
  listAll() {
    return this.svc.listAll();
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.svc.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateUserDto) {
    return this.svc.update(id, dto);
  }

  @Patch(":id/toggle")
  toggle(@Param("id") id: string) {
    return this.svc.toggle(id);
  }

  @Post(":id/reset-password")
  resetPassword(@Param("id") id: string, @Body() dto: { password: string }) {
    return this.svc.resetPassword(id, dto.password);
  }
}
