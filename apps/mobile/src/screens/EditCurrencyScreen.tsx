import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, ActivityIndicator, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { currenciesApi } from '../api/currencies';
import type { EditCurrencyScreenProps } from '../navigation';
import { GX, font, spacing, radius } from '../theme';

type Tab = 'auto' | 'manual';

function fmtCLP(n: number | null) {
  if (n === null) return '—';
  return new Intl.NumberFormat('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  hint?: string;
  hintColor?: string;
}

function Field({ label, value, onChange, suffix, hint, hintColor }: FieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={fieldStyles.wrap}>
      <Text style={fieldStyles.label}>{label}</Text>
      <View style={[fieldStyles.row, focused && fieldStyles.rowFocused]}>
        <TextInput
          style={fieldStyles.input}
          value={value}
          onChangeText={onChange}
          keyboardType="decimal-pad"
          placeholderTextColor={GX.faint}
          placeholder="0"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {suffix && (
          <View style={fieldStyles.suffix}>
            <Text style={fieldStyles.suffixText}>{suffix}</Text>
          </View>
        )}
      </View>
      {hint !== undefined && (
        <Text style={[fieldStyles.hint, hintColor ? { color: hintColor } : {}]}>{hint}</Text>
      )}
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  label: { fontSize: font.xs, letterSpacing: 2, color: GX.dim, fontWeight: '500', marginBottom: 7 },
  row: {
    flexDirection: 'row',
    backgroundColor: GX.elem,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: GX.border,
    overflow: 'hidden',
  },
  rowFocused: { borderColor: GX.gold },
  input: {
    flex: 1,
    color: GX.text,
    fontSize: font.md,
    fontFamily: 'monospace',
    fontWeight: '500',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
  },
  suffix: {
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderLeftWidth: 1,
    borderLeftColor: GX.border,
  },
  suffixText: { fontSize: font.sm, color: GX.dim, letterSpacing: 1 },
  hint: { fontSize: font.sm - 1, color: GX.dim, marginTop: 6, paddingLeft: 2 },
});

export default function EditCurrencyScreen({ route, navigation }: EditCurrencyScreenProps) {
  const { currency } = route.params;
  const qc = currency.quote_config;
  const insets = useSafeAreaInsets();

  const [tab, setTab] = useState<Tab>(qc?.mode === 'MANUAL' ? 'manual' : 'auto');
  const [mBuy, setMBuy] = useState(String(qc?.buy_margin ?? 0));
  const [mSell, setMSell] = useState(String(qc?.sell_margin ?? 0));
  const [pBuy, setPBuy] = useState(String(qc?.manual_buy ?? qc?.current_buy ?? ''));
  const [pSell, setPSell] = useState(String(qc?.manual_sell ?? qc?.current_sell ?? ''));
  const [saving, setSaving] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const toastOpacity = useRef(new Animated.Value(0)).current;

  const refRate = qc?.last_base_price ?? null;

  function showToast() {
    setToastVisible(true);
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(1200),
      Animated.timing(toastOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start(() => { setToastVisible(false); navigation.goBack(); });
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (tab === 'auto') {
        const buy = parseFloat(mBuy);
        const sell = parseFloat(mSell);
        if (isNaN(buy) || isNaN(sell)) throw new Error('Ingresá valores numéricos');
        if (qc?.mode === 'MANUAL') await currenciesApi.switchAuto(currency.code);
        await currenciesApi.updateMargins(currency.code, buy, sell);
      } else {
        const buy = parseFloat(pBuy);
        const sell = parseFloat(pSell);
        if (isNaN(buy) || isNaN(sell)) throw new Error('Ingresá valores numéricos');
        await currenciesApi.setManual(currency.code, buy, sell);
      }
      showToast();
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  const buyFinal  = refRate !== null ? refRate - Number(mBuy  || 0) : null;
  const sellFinal = refRate !== null ? refRate + Number(mSell || 0) : null;
  const spread    = Number(pSell || 0) - Number(pBuy || 0);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerSub}>Editar moneda</Text>
          <View style={styles.headerTitle}>
            <Text style={styles.flagText}>{currency.flag_emoji}</Text>
            <Text style={styles.codeText}>{currency.code}</Text>
            <Text style={styles.nameText}>· {currency.name}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Current prices */}
        <View style={styles.pricesCard}>
          <View style={styles.pricesCardHeader}>
            <Text style={styles.sectionLabel}>Precios actuales</Text>
            <View style={[styles.modeBadge, qc?.mode === 'MANUAL' ? styles.modeBadgeManual : styles.modeBadgeAuto]}>
              <View style={[styles.modeBadgeDot, { backgroundColor: qc?.mode === 'MANUAL' ? GX.orange : GX.green }]} />
              <Text style={[styles.modeBadgeText, { color: qc?.mode === 'MANUAL' ? GX.orange : GX.green }]}>
                {qc?.mode ?? '—'}
              </Text>
            </View>
          </View>
          <View style={styles.pricesRow}>
            <View style={styles.priceItem}>
              <Text style={styles.priceItemLabel}>Compra</Text>
              <Text style={[styles.priceItemValue, { color: GX.green }]}>${fmtCLP(qc?.current_buy ?? null)}</Text>
            </View>
            <View style={styles.priceDivider} />
            <View style={styles.priceItem}>
              <Text style={styles.priceItemLabel}>Venta</Text>
              <Text style={styles.priceItemValue}>${fmtCLP(qc?.current_sell ?? null)}</Text>
            </View>
          </View>
        </View>

        {/* Mode label */}
        <Text style={styles.sectionLabel}>Modo de cálculo</Text>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['auto', 'manual'] as Tab[]).map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, tab === t && styles.tabActive]}
              onPress={() => setTab(t)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, tab === t && { color: t === 'auto' ? GX.green : GX.orange }]}>
                {t.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === 'auto' ? (
          <>
            {refRate !== null && (
              <View style={styles.refCard}>
                <View>
                  <Text style={styles.refLabel}>Tasa de referencia (BCCh)</Text>
                  <Text style={styles.refValue}>${fmtCLP(refRate)}</Text>
                </View>
                <View style={[styles.liveBadge]}>
                  <View style={[styles.modeBadgeDot, { backgroundColor: GX.green }]} />
                  <Text style={[styles.modeBadgeText, { color: GX.green }]}>En vivo</Text>
                </View>
              </View>
            )}
            <Field
              label="MARGEN COMPRA"
              value={mBuy}
              onChange={setMBuy}
              suffix="CLP"
              hint={buyFinal !== null ? `Compra final: $${fmtCLP(buyFinal)}` : undefined}
              hintColor={GX.green}
            />
            <Field
              label="MARGEN VENTA"
              value={mSell}
              onChange={setMSell}
              suffix="CLP"
              hint={sellFinal !== null ? `Venta final: $${fmtCLP(sellFinal)}` : undefined}
            />
          </>
        ) : (
          <>
            <View style={styles.manualWarning}>
              <Text style={styles.manualWarningIcon}>⚠</Text>
              <Text style={styles.manualWarningText}>
                Modo manual — los precios no se sincronizarán con BCCh hasta volver a AUTO.
              </Text>
            </View>
            <Field label="PRECIO COMPRA FIJO" value={pBuy}  onChange={setPBuy}  suffix="CLP" />
            <Field label="PRECIO VENTA FIJO"  value={pSell} onChange={setPSell} suffix="CLP"
              hint={`Spread: $${fmtCLP(spread)}`}
            />
          </>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          {saving
            ? <ActivityIndicator color="#1A1405" />
            : <Text style={styles.saveBtnText}>Guardar cambios</Text>
          }
        </TouchableOpacity>
      </View>

      {/* Toast */}
      {toastVisible && (
        <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
          <View style={styles.toastCheck}>
            <Text style={{ color: GX.green, fontWeight: '700', fontSize: font.sm }}>✓</Text>
          </View>
          <Text style={styles.toastText}>Cambios guardados · {currency.code}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: GX.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: GX.borderSoft,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: radius.sm,
    borderWidth: 1, borderColor: GX.border,
    alignItems: 'center', justifyContent: 'center',
  },
  backIcon: { fontSize: 22, color: GX.text, lineHeight: 28 },
  headerInfo: { flex: 1 },
  headerSub: { fontSize: font.xs, color: GX.dim, letterSpacing: 1.5, textTransform: 'uppercase' },
  headerTitle: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  flagText: { fontSize: font.lg + 2 },
  codeText: { fontSize: font.lg, fontWeight: '600', color: GX.text },
  nameText: { fontSize: font.sm, color: GX.dim },
  scroll: { padding: spacing.md, paddingBottom: spacing.xl * 2 },
  pricesCard: {
    backgroundColor: GX.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: GX.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  pricesCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: font.xs,
    letterSpacing: 1.5,
    color: GX.dim,
    textTransform: 'uppercase',
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  modeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 9, paddingVertical: 3, borderRadius: 20,
  },
  modeBadgeAuto:   { backgroundColor: GX.greenSoft },
  modeBadgeManual: { backgroundColor: GX.orangeSoft },
  modeBadgeDot: { width: 5, height: 5, borderRadius: 3 },
  modeBadgeText: { fontSize: font.xs, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 9, paddingVertical: 3, borderRadius: 20,
    backgroundColor: GX.greenSoft,
  },
  pricesRow: { flexDirection: 'row' },
  priceItem: { flex: 1 },
  priceDivider: { width: 1, backgroundColor: GX.border, marginHorizontal: 12 },
  priceItemLabel: { fontSize: font.xs, letterSpacing: 1.5, color: GX.dim, textTransform: 'uppercase', marginBottom: 4 },
  priceItemValue: { fontFamily: 'monospace', fontSize: font.xl, fontWeight: '500', color: GX.text },
  tabs: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    backgroundColor: GX.elem,
    borderWidth: 1,
    borderColor: GX.border,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1, paddingVertical: 10, borderRadius: radius.sm,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: GX.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
  tabText: { fontSize: font.sm, fontWeight: '700', letterSpacing: 1.5, color: GX.dim },
  refCard: {
    backgroundColor: GX.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: GX.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  refLabel: { fontSize: font.xs, letterSpacing: 1.5, color: GX.dim, textTransform: 'uppercase', marginBottom: 3 },
  refValue: { fontFamily: 'monospace', fontSize: font.lg, fontWeight: '500', color: GX.text },
  manualWarning: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'rgba(243,156,18,0.06)',
    borderWidth: 1,
    borderColor: GX.orangeBorder,
    borderRadius: radius.sm,
    padding: spacing.sm + 2,
    marginBottom: spacing.lg,
  },
  manualWarningIcon: { fontSize: font.sm, color: '#f0b866' },
  manualWarningText: { flex: 1, fontSize: font.sm - 0.5, color: '#f0b866', lineHeight: 18 },
  footer: {
    paddingHorizontal: spacing.md,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: GX.borderSoft,
    backgroundColor: GX.bg,
  },
  saveBtn: {
    backgroundColor: GX.gold,
    borderRadius: radius.md,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#1A1405', fontSize: font.md, fontWeight: '600', letterSpacing: 0.5 },
  toast: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: 100,
    backgroundColor: 'rgba(46,204,113,0.95)',
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 10,
  },
  toastCheck: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#07291A',
    alignItems: 'center', justifyContent: 'center',
  },
  toastText: { color: '#07291A', fontSize: font.sm, fontWeight: '600' },
});
