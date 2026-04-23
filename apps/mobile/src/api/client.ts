import * as SecureStore from 'expo-secure-store';

const BASE = process.env['EXPO_PUBLIC_API_URL'] ?? 'http://localhost:3001';

let onUnauthenticated: (() => void) | null = null;

export function registerUnauthenticatedHandler(cb: () => void) {
  onUnauthenticated = cb;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await SecureStore.getItemAsync('access_token');

  const res = await fetch(`${BASE}/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> | undefined),
    },
  });

  if (res.status === 401) {
    const refresh = await SecureStore.getItemAsync('refresh_token');
    if (refresh) {
      const rr = await fetch(`${BASE}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refresh }),
      });
      if (rr.ok) {
        const data = (await rr.json()) as { access_token: string };
        await SecureStore.setItemAsync('access_token', data.access_token);
        return request<T>(path, options);
      }
    }
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
    onUnauthenticated?.();
    throw new Error('Sesión expirada');
  }

  if (!res.ok) {
    const err = (await res.json().catch(() => ({ message: 'Error de red' }))) as {
      message?: string;
    };
    throw new Error(err.message ?? 'Error desconocido');
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export { request };
