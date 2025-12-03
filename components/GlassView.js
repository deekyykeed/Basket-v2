import React from 'react';
import { StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

/**
 * GlassView - A reusable component that provides a glass effect
 * Uses BlurView from expo-blur for cross-platform support (iOS & Android)
 */
export default function GlassView({
  children,
  style,
  glassEffectStyle = 'regular',
  tintColor
}) {
  // Map glassEffectStyle to expo-blur properties
  const intensity = glassEffectStyle === 'clear' ? 15 : 30;
  const tint = tintColor || 'light';

  return (
    <BlurView
      intensity={intensity}
      tint={tint}
      style={[styles.blurView, style]}
    >
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  blurView: {
    overflow: 'hidden',
  },
});
