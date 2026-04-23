import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, radius, font } from '../theme';
import type { Currency } from '../types';

interface Props {
  currency: Currency;
  onEdit: (currency: Currency) => void;
  onToggle: (code: string) => Promise<void>;
}

function fmtCLP(n: number | null) {
  if (n === null) return '—';
  return n.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export default function CurrencyRow({ currency, onEdit, onToggle }: Props) {
  const [toggling, setToggling] = useState(false);
  const qc = currency.quote_config;
  const isManual = qc?.mode === 'MANUAL';

  async function handleToggle() {
    setToggling(true);
    try {
      await onToggle(currency.code);
    } finally {
      setToggling(false);
    }
  }

  return (
    <View style={[styles.row, !currency.is_active && styles.rowInactive]}>
      <View style={styles.left}>
        <Text style={styles.flag}>{currency.flag_emoji}</Text>
        <View>
          <View style={styles.nameRow}>
            <Text style={styles.code}>{currency.code}</Text>
            <View style={[styles.badge, isManual ? styles.badgeManual : styles.badgeAuto]}>
              <Text style={[styles.badgeText, isManual ? styles.badgeTextManual : styles.badgeTextAuto]}>
                {isManual ? 'MANUAL' : 'AUTO'}
              </Text>
            </View>
          </View>
          <Text style={styles.name}>{currency.name}</Text>
        </View>
      </View>

      <View style={styles.right}>
        <View style={styles.prices}>
          <View style={styles.priceCol}>
            <Text style={styles.priceLabel}>Compra</Text>
            <Text style={styles.priceValue}>{fmtCLP(qc?.current_buy ?? null)}</Text>
          </View>
          <View style={styles.priceCol}>
            <Text style={styles.priceLabel}>Venta</Text>
            <Text style={styles.priceValue}>{fmtCLP(qc?.current_sell ?? null)}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.toggleBtn, currency.is_active ? styles.toggleActive : styles.toggleInactive]}
            onPress={handleToggle}
            disabled={toggling}
            activeOpacity={0.7}
          >
            {toggling ? (
              <ActivityIndicator size="small" color={colors.text} />
            ) : (
              <Text style={styles.toggleText}>{currency.is_active ? 'Activa' : 'Inactiva'}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(currency)} activeOpacity={0.7}>
            <Text style={styles.editText}>Editar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: colors.bg2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rowInactive: {
    opacity: 0.5,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  flag: {
    fontSize: 28,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  code: {
    color: colors.text,
    fontSize: font.md,
    fontWeight: '700',
  },
  name: {
    color: colors.textDim,
    fontSize: font.sm,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  badgeAuto: {
    backgroundColor: colors.greenDim,
  },
  badgeManual: {
    backgroundColor: colors.goldDim,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  badgeTextAuto: {
    color: colors.green,
  },
  badgeTextManual: {
    color: colors.gold,
  },
  right: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  prices: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    color: colors.textFaint,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceValue: {
    color: colors.text,
    fontSize: font.sm,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  toggleBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    minWidth: 62,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: colors.greenDim,
    borderWidth: 1,
    borderColor: colors.green,
  },
  toggleInactive: {
    backgroundColor: colors.redDim,
    borderWidth: 1,
    borderColor: colors.red,
  },
  toggleText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '600',
  },
  editBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    backgroundColor: colors.goldDim,
    borderWidth: 1,
    borderColor: colors.goldBorder,
  },
  editText: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '600',
  },
});
