import React, { useCallback } from 'react';
import {
  View, FlatList, Text, StyleSheet,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCurrencies } from '../hooks/useCurrencies';
import { currenciesApi } from '../api/currencies';
import CurrencyRow from '../components/CurrencyRow';
import { useAuth } from '../auth/AuthContext';
import type { CurrencyListScreenProps } from '../navigation';
import type { Currency } from '../types';
import { GX, font, spacing, radius } from '../theme';

export default function CurrencyListScreen({ navigation }: CurrencyListScreenProps) {
  const { currencies, loading, error, refresh } = useCurrencies();
  const { logout, user } = useAuth();
  const insets = useSafeAreaInsets();

  const handleEdit = useCallback(
    (currency: Currency) => navigation.navigate('EditCurrency', { currency }),
    [navigation],
  );

  const handleToggle = useCallback(async (code: string) => {
    await currenciesApi.toggle(code);
    await refresh();
  }, [refresh]);

  const activeCount = currencies.filter(c => c.is_active).length;

  if (loading && currencies.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={GX.gold} size="large" />
      </View>
    );
  }

  if (error && currencies.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={refresh}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.hello}>Hola,</Text>
          <Text style={styles.userName}>{user?.name ?? user?.email?.split('@')[0]}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user?.role}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.7}>
          <Text style={styles.logoutIcon}>⎋</Text>
        </TouchableOpacity>
      </View>

      {/* Title row */}
      <View style={styles.titleRow}>
        <Text style={styles.pageTitle}>Monedas</Text>
        <Text style={styles.activeCount}>
          <Text style={{ color: GX.green, fontWeight: '500' }}>{activeCount}</Text>
          {' '}de {currencies.length} activas
        </Text>
      </View>

      <FlatList
        data={currencies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CurrencyRow currency={item} onEdit={handleEdit} onToggle={handleToggle} />
        )}
        refreshing={loading}
        onRefresh={refresh}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay monedas disponibles</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: GX.bg },
  center: { flex: 1, backgroundColor: GX.bg, justifyContent: 'center', alignItems: 'center', gap: spacing.md },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: GX.borderSoft,
  },
  hello: { fontSize: font.xs, letterSpacing: 1.5, color: GX.dim, textTransform: 'uppercase' },
  userName: { fontSize: font.lg + 1, fontWeight: '600', color: GX.text, marginTop: 2 },
  roleBadge: { marginTop: 4 },
  roleText: { fontSize: font.xs, color: GX.gold, fontWeight: '600', letterSpacing: 1 },
  logoutBtn: {
    width: 40, height: 40, borderRadius: radius.sm,
    borderWidth: 1, borderColor: GX.border,
    alignItems: 'center', justifyContent: 'center',
  },
  logoutIcon: { fontSize: font.md, color: GX.dim },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
  },
  pageTitle: { fontSize: font.xl + 2, fontWeight: '600', color: GX.text },
  activeCount: { fontSize: font.sm, color: GX.dim },
  list: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  errorText: { color: GX.red, fontSize: font.md, textAlign: 'center' },
  retryBtn: {
    backgroundColor: GX.goldSoft, borderRadius: radius.md,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    borderWidth: 1, borderColor: GX.goldBorder,
  },
  retryText: { color: GX.gold, fontWeight: '600' },
  emptyText: { color: GX.dim, textAlign: 'center', marginTop: spacing.xl },
});
