import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, font } from '../theme';

interface Props {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
}

export default function Toast({ message, type, visible }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.delay(2000),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, message, opacity]);

  return (
    <Animated.View style={[styles.toast, type === 'error' ? styles.error : styles.success, { opacity }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 40,
    left: spacing.xl,
    right: spacing.xl,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    zIndex: 999,
  },
  success: {
    backgroundColor: colors.green,
  },
  error: {
    backgroundColor: colors.red,
  },
  text: {
    color: colors.white,
    fontWeight: '600',
    fontSize: font.md,
  },
});
