import { useState, useCallback, useEffect } from 'react';
import { currenciesApi } from '../api/currencies';
import type { Currency } from '../types';

export function useCurrencies() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetch = useCallback(async () => {
    setError('');
    try {
      const data = await currenciesApi.getAll();
      setCurrencies(data.sort((a, b) => a.display_order - b.display_order));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al cargar monedas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetch(); }, [fetch]);

  const refresh = useCallback(async () => {
    setLoading(true);
    await fetch();
  }, [fetch]);

  return { currencies, loading, error, refresh };
}
