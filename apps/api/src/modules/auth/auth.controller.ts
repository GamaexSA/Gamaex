import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  login(@Body() body: { email: string; password: string }) {
    return this.auth.login(body.email, body.password);
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  refresh(@Body() body: { refresh_token: string }) {
    if (!body.refresh_token) throw new UnauthorizedException("Token requerido");
    return this.auth.refresh(body.refresh_token);
  }

  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  logout() {
    // Stateless JWT — el cliente descarta los tokens localmente
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@CurrentUser("sub") userId: string) {
    return this.auth.getMe(userId);
  }
}
