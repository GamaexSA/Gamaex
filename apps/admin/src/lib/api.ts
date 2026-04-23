const BASE = process.env["NEXT_PUBLIC_ADMIN_API_URL"] ?? "http://localhost:3001";

// ─── Tipos locales ────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "SUPER_ADMIN" | "OPERATOR";
  is_active?: boolean;
  last_login_at?: string | null;
  created_at?: string;
}

export interface QuoteConfig {
  id: string;
  mode: "AUTO" | "MANUAL";
  buy_margin: number;
  sell_margin: number;
  manual_buy: number | null;
  manual_sell: number | null;
  current_buy: number | null;
  current_sell: number | null;
  last_base_price: number | null;
  last_synced_at: string | null;
  price_alert_active: boolean;
  price_alert_reason: string | null;
}

export interface Currency {
  id: string;
  code: string;
  name: string;
  flag_emoji: string;
  is_active: boolean;
  display_order: number;
  quote_config: QuoteConfig | null;
}

export interface AuditItem {
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

export interface PaginatedAudit {
  items: AuditItem[];
  total: number;
  page: number;
  pages: number;
}

export interface PublicRate {
  code: string;
  name: string;
  flag_emoji: string;
  buy: number;
  sell: number;
  mode: string;
  last_updated: string;
}

export interface PublicRatesResponse {
  rates: PublicRate[];
  system_status: "ok" | "degraded" | "stale";
  last_sync_at: string;
  cache_ttl_seconds: number;
}

// ─── HTTP helpers ─────────────────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const res = await fetch(`${BASE}/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> | undefined),
    },
  });

  if (res.status === 401) {
    const refresh = localStorage.getItem("refresh_token");
    if (refresh) {
      const rr = await fetch(`${BASE}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refresh }),
      });
      if (rr.ok) {
        const data = (await rr.json()) as { access_token: string };
        localStorage.setItem("access_token", data.access_token);
        return request<T>(path, options); // reintentar
      }
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
    throw new Error("Sesión expirada");
  }

  if (!res.ok) {
    const err = (await res.json().catch(() => ({ message: "Error de red" }))) as {
      message?: string;
    };
    throw new Error(err.message ?? "Error desconocido");
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ─── API client ───────────────────────────────────────────────────────────────

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ access_token: string; refresh_token: string; expires_in: number; user: AdminUser }>(
      "/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) },
    ),

  me: () => request<AdminUser>("/auth/me"),

  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },

  // Rates
  getRates: () => request<PublicRatesResponse>("/rates/public"),
  forceSyncAll: () => request<{ updated: number; skipped: number }>("/rates/sync", { method: "POST" }),

  // Currencies
  getCurrencies: () => request<Currency[]>("/currencies"),
  updateMargins: (code: string, buy_margin: number, sell_margin: number) =>
    request("/currencies/" + code + "/margins", {
      method: "PATCH",
      body: JSON.stringify({ buy_margin, sell_margin }),
    }),
  setManualPrices: (code: string, manual_buy: number, manual_sell: number) =>
    request("/currencies/" + code + "/manual", {
      method: "PATCH",
      body: JSON.stringify({ manual_buy, manual_sell }),
    }),
  switchToAuto: (code: string) =>
    request("/currencies/" + code + "/switch-auto", { method: "PATCH" }),
  toggleActive: (code: string) =>
    request("/currencies/" + code + "/toggle", { method: "PATCH" }),
  forceSync: (code: string) =>
    request<{ updated: number; skipped: number }>("/currencies/" + code + "/force-sync", { method: "POST" }),

  // Users
  getUsers: () => request<AdminUser[]>("/users"),
  createUser: (data: { email: string; name: string; password: string; role: "SUPER_ADMIN" | "OPERATOR" }) =>
    request<AdminUser>("/users", { method: "POST", body: JSON.stringify(data) }),
  updateUser: (id: string, data: { email?: string; name?: string; role?: "SUPER_ADMIN" | "OPERATOR" }) =>
    request<AdminUser>(`/users/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  toggleUser: (id: string) =>
    request<AdminUser>(`/users/${id}/toggle`, { method: "PATCH" }),
  resetPassword: (id: string, password: string) =>
    request<{ ok: boolean }>(`/users/${id}/reset-password`, { method: "POST", body: JSON.stringify({ password }) }),

  // Audit
  getAuditLogs: (page = 1, limit = 50, filters?: { action?: string; entity?: string; actor?: string }) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (filters?.action) params.set("action", filters.action);
    if (filters?.entity) params.set("entity", filters.entity);
    if (filters?.actor) params.set("actor", filters.actor);
    return request<PaginatedAudit>(`/audit?${params.toString()}`);
  },
};
