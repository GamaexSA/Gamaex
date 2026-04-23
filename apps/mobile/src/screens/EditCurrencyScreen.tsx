import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { currenciesApi } from '../api/currencies';
import ModeToggle from '../components/ModeToggle';
import NumericInput from '../components/NumericInput';
import Toast from '../components/Toast';
import type { EditCurrencyScreenProps } from '../navigation';
import { colors, spacing, radius, font } from '../theme';

type Mode = 'AUTO' | 'MANUAL';

interface ToastState {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
}

export default function EditCurrencyScreen({ route, navigation }: EditCurrencyScreenProps) {
  const { currency } = route.params;
  const qc = currency.quote_config;

  const initialMode: Mode = qc?.mode ?? 'AUTO';
  const [mode, setMode] = useState<Mode>(initialMode);
  const [buyMargin, setBuyMargin] = useState(String(qc?.buy_margin ?? 0));
  const [sellMargin, setSellMargin] = useState(String(qc?.sell_margin ?? 0));
  const [manualBuy, setManualBuy] = useState(String(qc?.manual_buy ?? ''));
  const [manualSell, setManualSell] = useState(String(qc?.manual_sell ?? ''));
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'success', visible: false });

  function showToast(message: string, type: 'success' | 'error') {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2700);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (mode === 'AUTO') {
        const buy = parseFloat(buyMargin);
        const sell = parseFloat(sellMargin);
        if (isNaN(buy) || isNaN(sell)) throw new Error('Ingresa valores numéricos válidos');
        if (initialMode === 'MANUAL') {
          await currenciesApi.switchAuto(currency.code);
        }
        await currenciesApi.updateMargins(currency.code, buy, sell);
      } else {
        const buy = parseFloat(manualBuy);
        const sell = parseFloat(manualSell);
        if (isNaN(buy) || isNaN(sell)) throw new Error('Ingresa valores numéricos válidos');
        await currenciesApi.setManual(currency.code, buy, sell);
      }
      showToast('Precios actualizados', 'success');
      setTimeout(() => navigation.goBack(), 1200);
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Error al guardar', 'error');
    } finally {
      setSaving(false);
    }
  }

  const currentBuy = qc?.current_buy;
  const currentSell = qc?.current_sell;

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.priceCard}>
          <Text style={styles.priceCardTitle}>Precios actuales</Text>
          <View style={styles.priceRow}>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Compra</Text>
              <Text style={styles.priceValue}>
                {currentBuy !== null && currentBuy !== undefined
                  ? currentBuy.toLocaleString('es-CL', { minimumFractionDigits: 2 })
                  : '—'}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Venta</Text>
              <Text style={styles.priceValue}>
                {currentSell !== null && currentSell !== undefined
                  ? currentSell.toLocaleString('es-CL', { minimumFractionDigits: 2 })
                  : '—'}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Modo de precio</Text>
        <ModeToggle value={mode} onChange={setMode} />

        <View style={styles.formSection}>
          {mode === 'AUTO' ? (
            <>
              <Text style={styles.modeDesc}>
                El precio se calcula automáticamente aplicando los márgenes al precio base.
              </Text>
              <NumericInput
                label="Margen Compra (%)"
                value={buyMargin}
                onChangeText={setBuyMargin}
                hint={`Precio base: ${qc?.last_base_price?.toLocaleString('es-CL') ?? '—'}`}
              />
              <NumericInput
                label="Margen Venta (%)"
                value={sellMargin}
                onChangeText={setSellMargin}
              />
            </>
          ) : (
            <>
              <Text style={styles.modeDesc}>
                Los precios se fijan manualmente sin considerar el precio de mercado.
              </Text>
              <NumericInput
                label="Precio Compra (CLP)"
                value={manualBuy}
                onChangeText={setManualBuy}
              />
              <NumericInput
                label="Precio Venta (CLP)"
                value={manualSell}
                onChangeText={setManualSell}
              />
            </>
          )}
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color={colors.bg} />
          ) : (
            <Text style={styles.saveBtnText}>Guardar cambios</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    padding: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  priceCard: {
    backgroundColor: colors.bg2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  priceCardTitle: {
    color: colors.textDim,
    fontSize: font.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  priceItem: {
    alignItems: 'center',
    flex: 1,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  priceLabel: {
    color: colors.textFaint,
    fontSize: font.sm,
    marginBottom: spacing.xs,
  },
  priceValue: {
    color: colors.text,
    fontSize: font.xl,
    fontWeight: '700',
  },
  sectionTitle: {
    color: colors.textDim,
    fontSize: font.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  formSection: {
    marginTop: spacing.lg,
  },
  modeDesc: {
    color: colors.textDim,
    fontSize: font.sm,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  saveBtn: {
    backgroundColor: colors.gold,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: colors.bg,
    fontSize: font.md,
    fontWeight: '700',
  },
});
