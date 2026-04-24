import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, Switch,
} from 'react-native';
import { GX, font, spacing, radius } from '../theme';
import type { Currency } from '../types';

interface Props {
  currency: Currency;
  onEdit: (currency: Currency) => void;
  onToggle: (code: string) => Promise<void>;
}

function fmtCLP(n: number | null) {
  if (n === null) return '—';
  return new Intl.NumberFormat('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

export default function CurrencyRow({ currency, onEdit, onToggle }: Props) {
  const [toggling, setToggling] = useState(false);
  const qc = currency.quote_config;
  const isManual = qc?.mode === 'MANUAL';

  async function handleToggle() {
    setToggling(true);
    try { await onToggle(currency.code); }
    finally { setToggling(false); }
  }

  return (
    <View style={[styles.card, !currency.is_active && styles.cardInactive]}>
      {/* Top row */}
      <View style={styles.topRow}>
        <Text style={styles.flag}>{currency.flag_emoji}</Text>
        <View style={styles.nameBlock}>
          <View style={styles.nameRow}>
            <Text style={styles.code}>{currency.code}</Text>
            <View style={[styles.badge, isManual ? styles.badgeManual : styles.badgeAuto]}>
              <View style={[styles.badgeDot, { backgroundColor: isManual ? GX.orange : GX.green }]} />
              <Text style={[styles.badgeText, { color: isManual ? GX.orange : GX.green }]}>
                {isManual ? 'MANUAL' : 'AUTO'}
              </Text>
            </View>
          </View>
          <Text style={styles.name} numberOfLines={1}>{currency.name}</Text>
        </View>
        {toggling
          ? <ActivityIndicator size="small" color={GX.gold} />
          : <Switch
              value={currency.is_active}
              onValueChange={handleToggle}
              trackColor={{ false: GX.redSoft, true: GX.greenSoft }}
              thumbColor={currency.is_active ? GX.green : GX.red}
              ios_backgroundColor={GX.redSoft}
            />
        }
      </View>

      {/* Prices */}
      <View style={styles.pricesBox}>
        <View style={styles.priceCol}>
          <Text style={styles.priceLabel}>Compra</Text>
          <Text style={[styles.priceValue, { color: GX.green }]}>${fmtCLP(qc?.current_buy ?? null)}</Text>
        </View>
        <View style={styles.priceDivider} />
        <View style={styles.priceCol}>
          <Text style={styles.priceLabel}>Venta</Text>
          <Text style={styles.priceValue}>${fmtCLP(qc?.current_sell ?? null)}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.updated}>
          {qc?.last_synced_at
            ? new Date(qc.last_synced_at).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
            : '—'}
        </Text>
        <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(currency)} activeOpacity={0.7}>
          <Text style={styles.editText}>Editar ›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: GX.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: GX.border,
    padding: spacing.md,
    marginBottom: 10,
  },
  cardInactive: { opacity: 0.45 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  flag: { fontSize: 26 },
  nameBlock: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  code: { fontSize: font.md + 1, fontWeight: '600', color: GX.text, letterSpacing: 0.5 },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 9, paddingVertical: 3, borderRadius: 20,
  },
  badgeAuto:   { backgroundColor: GX.greenSoft },
  badgeManual: { backgroundColor: GX.orangeSoft },
  badgeDot: { width: 5, height: 5, borderRadius: 3 },
  badgeText: { fontSize: font.xs, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },
  name: { fontSize: font.sm - 0.5, color: GX.dim },
  pricesBox: {
    flexDirection: 'row',
    backgroundColor: GX.elem,
    borderRadius: radius.sm + 2,
    padding: spacing.sm + 2,
    marginBottom: 12,
  },
  priceCol: { flex: 1, alignItems: 'flex-start' },
  priceDivider: { width: 1, backgroundColor: GX.border, marginHorizontal: 10 },
  priceLabel: { fontSize: 9.5, letterSpacing: 1.5, color: GX.dim, textTransform: 'uppercase', marginBottom: 3 },
  priceValue: { fontFamily: 'monospace', fontWeight: '500', fontSize: font.md + 1, color: GX.text },
  footer: { flexDirection: 'row', alignItems: 'center' },
  updated: { flex: 1, fontSize: font.xs + 0.5, color: GX.dim },
  editBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.sm,
    backgroundColor: GX.goldSoft,
    borderWidth: 1,
    borderColor: GX.goldBorder,
  },
  editText: { fontSize: font.sm, fontWeight: '600', color: GX.gold, letterSpacing: 0.5 },
});
