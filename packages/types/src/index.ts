// ─────────────────────────────────────────────────────────────────────────────
// @gamaex/types — Contratos compartidos entre backend, web y admin
//
// Regla: estos tipos representan lo que viaja por la API (DTOs, responses).
// NO son los tipos de Prisma (esos se importan desde @gamaex/database).
// ─────────────────────────────────────────────────────────────────────────────

// ─── Enums compartidos ───────────────────────────────────────────────────────

export type QuoteMode = "AUTO" | "MANUAL";
export type AdminRole = "SUPER_ADMIN" | "OPERATOR";
export type ApiKeyScope = "READ_ONLY" | "WEBHOOK";
export type SnapshotSource =
  | "CRON_AUTO"
  | "ADMIN_PANEL"
  | "WHATSAPP_CMD"
  | "API_FORCE_SYNC";

// ─── Respuestas públicas (sin auth) ──────────────────────────────────────────

/** Lo que devuelve GET /api/rates/public */
export interface PublicRate {
  code: string;         // "USD"
  name: string;         // "Dólar USA"
  flag_emoji: string;   // "🇺🇸"
  buy: number;          // precio de compra final en CLP
  sell: number;         // precio de venta final en CLP
  decimal_places: number;
  mode: QuoteMode;
  last_updated: string; // ISO 8601
}

export interface PublicRatesResponse {
  rates: PublicRate[];
  system_status: "ok" | "degraded" | "stale"; // stale = último sync hace >15 min
  last_sync_at: string;
  cache_ttl_seconds: number;
}

/** Lo que devuelve GET /api/rates/public/:code */
export interface PublicRateDetail extends PublicRate {
  alert_active: boolean;
}

// ─── Admin — Monedas ─────────────────────────────────────────────────────────

export interface AdminCurrencyListItem {
  id: string;
  code: string;
  name: string;
  flag_emoji: string;
  is_active: boolean;
  display_order: number;
  config: AdminQuoteConfig;
}

export interface AdminQuoteConfig {
  id: string;
  mode: QuoteMode;
  buy_margin: number;
  sell_margin: number;
  manual_buy: number | null;
  manual_sell: number | null;
  current_buy: number | null;
  current_sell: number | null;
  last_base_price: number | null;
  last_synced_at: string | null;
  last_synced_by: string | null;
  price_alert_active: boolean;
  price_alert_reason: string | null;
}

// ─── Admin — DTOs de actualización ───────────────────────────────────────────

export interface UpdateMarginsDto {
  buy_margin: number;
  sell_margin: number;
}

export interface SetManualPricesDto {
  manual_buy: number;
  manual_sell: number;
}

export interface UpdateCurrencyConfigDto {
  mode?: QuoteMode;
  buy_margin?: number;
  sell_margin?: number;
  manual_buy?: number;
  manual_sell?: number;
}

// ─── Admin — Historial ───────────────────────────────────────────────────────

export interface QuoteSnapshotItem {
  id: string;
  currency_code: string;
  base_price: number;
  buy_price: number;
  sell_price: number;
  buy_margin: number;
  sell_margin: number;
  mode: QuoteMode;
  source: SnapshotSource;
  source_meta: string | null;
  captured_at: string;
}

// ─── Admin — Audit ───────────────────────────────────────────────────────────

export interface AuditLogItem {
  id: string;
  entity: string;
  entity_id: string;
  action: string;
  actor_ref: string;
  before: unknown;
  after: unknown;
  ip_address: string | null;
  created_at: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  expires_in: number; // seconds
  user: {
    id: string;
    email: string;
    name: string;
    role: AdminRole;
  };
}

// ─── WhatsApp — Comandos parseados ───────────────────────────────────────────

export type WhatsAppCommandType =
  | "SET_MARGINS"
  | "SET_MANUAL"
  | "SET_AUTO"
  | "GET_STATUS"
  | "LIST_CURRENCIES"
  | "UNKNOWN";

export interface ParsedWhatsAppCommand {
  type: WhatsAppCommandType;
  currency?: string;
  buy_margin?: number;
  sell_margin?: number;
  manual_buy?: number;
  manual_sell?: number;
  raw: string;
}

// ─── IA — endpoints de solo lectura ──────────────────────────────────────────

export interface AiRatesResponse {
  rates: PublicRate[];
  context: string; // resumen en texto para que la IA lo procese
  generated_at: string;
}

export interface AiBusinessContext {
  name: string;
  address: string;
  commune: string;
  city: string;
  metro_station: string;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  phone: string;
  whatsapp: string;
  email: string;
  services: string[];
}

// ─── Paginación genérica ─────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// ─── Respuestas estándar de la API ───────────────────────────────────────────

export interface ApiSuccessResponse<T = void> {
  ok: true;
  data: T;
  timestamp: string;
}

export interface ApiErrorResponse {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}
