import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useCurrencies } from '../hooks/useCurrencies';
import { currenciesApi } from '../api/currencies';
import CurrencyRow from '../components/CurrencyRow';
import { useAuth } from '../auth/AuthContext';
import type { CurrencyListScreenProps } from '../navigation';
import type { Currency } from '../types';
import { colors, spacing, font, radius } from '../theme';

export default function CurrencyListScreen({ navigation }: CurrencyListScreenProps) {
  const { currencies, loading, error, refresh } = useCurrencies();
  const { logout, user } = useAuth();

  const handleEdit = useCallback(
    (currency: Currency) => {
      navigation.navigate('EditCurrency', { currency });
    },
    [navigation],
  );

  const handleToggle = useCallback(
    async (code: string) => {
      await currenciesApi.toggle(code);
      await refresh();
    },
    [refresh],
  );

  if (loading && currencies.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.gold} size="large" />
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
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.userInfo}>{user?.name ?? user?.email}</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
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
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  center: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  userInfo: {
    color: colors.textDim,
    fontSize: font.sm,
  },
  logoutText: {
    color: colors.red,
    fontSize: font.sm,
    fontWeight: '600',
  },
  list: {
    padding: spacing.md,
  },
  errorText: {
    color: colors.red,
    fontSize: font.md,
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: colors.goldDim,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.goldBorder,
  },
  retryText: {
    color: colors.gold,
    fontWeight: '600',
  },
  emptyText: {
    color: colors.textDim,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
