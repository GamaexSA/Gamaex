import { Injectable, CanActivate, ExecutionContext, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

export const Roles = (...roles: string[]) => SetMetadata("roles", roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>("roles", [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!required) return true;
    const { user } = ctx.switchToHttp().getRequest<{ user: { role: string } }>();
    return required.includes(user.role);
  }
}
