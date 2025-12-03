import React from 'react';
import { GlassView as ExpoGlassView } from 'expo-glass-effect';

/**
 * GlassView - A wrapper component for expo-glass-effect's GlassView
 * Provides iOS 26+ native liquid glass effect
 * Falls back to regular View on unsupported platforms
 */
export default function GlassView({
  children,
  style,
  glassEffectStyle = 'regular',
  isInteractive = false,
  tintColor
}) {
  return (
    <ExpoGlassView
      style={style}
      glassEffectStyle={glassEffectStyle}
      isInteractive={isInteractive}
      tintColor={tintColor}
    >
      {children}
    </ExpoGlassView>
  );
}
