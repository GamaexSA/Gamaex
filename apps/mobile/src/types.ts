export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'OPERATOR';
  is_active?: boolean;
  last_login_at?: string | null;
  created_at?: string;
}

export interface QuoteConfig {
  id: string;
  mode: 'AUTO' | 'MANUAL';
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

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: AdminUser;
}
