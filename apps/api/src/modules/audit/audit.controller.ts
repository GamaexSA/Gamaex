import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AuditService } from "./audit.service";

@UseGuards(JwtAuthGuard)
@Controller("audit")
export class AuditController {
  constructor(private readonly audit: AuditService) {}

  @Get()
  getLogs(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query("action") action?: string,
    @Query("entity") entity?: string,
    @Query("actor") actor?: string,
  ) {
    const filters: { action?: string; entity?: string; actor?: string } = {};
    if (action !== undefined) filters.action = action;
    if (entity !== undefined) filters.entity = entity;
    if (actor !== undefined) filters.actor = actor;
    return this.audit.getLogs(page, Math.min(limit, 100), filters);
  }
}
