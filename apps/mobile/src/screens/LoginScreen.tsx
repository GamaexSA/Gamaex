import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { GX, font, spacing, radius } from '../theme';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusField, setFocusField] = useState<'email' | 'pw' | null>(null);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setError('Ingresá email y contraseña');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(email.trim(), password);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        {/* Logo */}
        <View style={styles.logoBlock}>
          <View style={styles.logoRow}>
            <Text style={styles.logoText}>GAMAEX</Text>
            <View style={styles.logoDot} />
          </View>
          <Text style={styles.logoSub}>Casa de cambio · Chile</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.title}>Panel de administración</Text>
          <Text style={styles.subtitle}>Ingresá con tus credenciales corporativas</Text>

          {error !== '' && (
            <View style={styles.errorBox}>
              <Text style={styles.errorIcon}>⚠</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.fields}>
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>EMAIL</Text>
              <View style={[styles.fieldInput, focusField === 'email' && styles.fieldFocused]}>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="nombre@gamaex.cl"
                  placeholderTextColor={GX.faint}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  returnKeyType="next"
                  onFocus={() => setFocusField('email')}
                  onBlur={() => setFocusField(null)}
                />
              </View>
            </View>

            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>CONTRASEÑA</Text>
              <View style={[styles.fieldInput, focusField === 'pw' && styles.fieldFocused]}>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={GX.faint}
                  secureTextEntry
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  onFocus={() => setFocusField('pw')}
                  onBlur={() => setFocusField(null)}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#1A1405" />
              : <Text style={styles.btnText}>Ingresar</Text>
            }
          </TouchableOpacity>

          <Text style={styles.footer}>GAMAEX · Todos los accesos son auditados</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: GX.bg,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  logoBlock: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: font.xxxl,
    fontWeight: '700',
    color: GX.gold,
    letterSpacing: 6,
  },
  logoDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: GX.gold,
  },
  logoSub: {
    fontSize: font.xs,
    color: GX.dim,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: 10,
  },
  card: {
    backgroundColor: GX.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: GX.border,
    padding: spacing.xl,
  },
  title: {
    fontSize: font.xl,
    fontWeight: '600',
    color: GX.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: font.sm,
    color: GX.dim,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: GX.redSoft,
    borderWidth: 1,
    borderColor: GX.redBorder,
    borderRadius: radius.sm,
    padding: spacing.sm + 2,
    marginBottom: spacing.md,
  },
  errorIcon: {
    fontSize: font.sm,
    color: '#f8a69c',
  },
  errorText: {
    fontSize: font.sm,
    color: '#f8a69c',
    flex: 1,
  },
  fields: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  fieldWrap: {
    gap: spacing.xs,
  },
  fieldLabel: {
    fontSize: font.xs,
    letterSpacing: 2,
    color: GX.dim,
    fontWeight: '500',
  },
  fieldInput: {
    backgroundColor: GX.elem,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: GX.border,
    overflow: 'hidden',
  },
  fieldFocused: {
    borderColor: GX.gold,
  },
  input: {
    color: GX.text,
    fontSize: font.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
  },
  btn: {
    backgroundColor: GX.gold,
    borderRadius: radius.md,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: '#1A1405',
    fontSize: font.md,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  footer: {
    fontSize: font.xs,
    color: GX.dim,
    textAlign: 'center',
    letterSpacing: 1,
  },
});
