import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius, font } from '../theme';

type Mode = 'AUTO' | 'MANUAL';

interface Props {
  value: Mode;
  onChange: (mode: Mode) => void;
}

export default function ModeToggle({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      {(['AUTO', 'MANUAL'] as Mode[]).map((mode) => (
        <TouchableOpacity
          key={mode}
          style={[styles.tab, value === mode && styles.tabActive]}
          onPress={() => onChange(mode)}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, value === mode && styles.tabTextActive]}>{mode}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.bg3,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  tabActive: {
    backgroundColor: colors.goldDim,
    borderWidth: 1,
    borderColor: colors.goldBorder,
  },
  tabText: {
    color: colors.textDim,
    fontSize: font.sm,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: colors.gold,
  },
});
