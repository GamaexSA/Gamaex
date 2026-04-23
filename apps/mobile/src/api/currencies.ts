import { request } from './client';
import type { Currency } from '../types';

export const currenciesApi = {
  getAll: () => request<Currency[]>('/currencies'),

  updateMargins: (code: string, buy_margin: number, sell_margin: number) =>
    request<void>(`/currencies/${code}/margins`, {
      method: 'PATCH',
      body: JSON.stringify({ buy_margin, sell_margin }),
    }),

  setManual: (code: string, manual_buy: number, manual_sell: number) =>
    request<void>(`/currencies/${code}/manual`, {
      method: 'PATCH',
      body: JSON.stringify({ manual_buy, manual_sell }),
    }),

  switchAuto: (code: string) =>
    request<void>(`/currencies/${code}/switch-auto`, { method: 'PATCH' }),

  toggle: (code: string) =>
    request<void>(`/currencies/${code}/toggle`, { method: 'PATCH' }),
};
