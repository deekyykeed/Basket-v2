import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';

/**
 * GlassView - A reusable component that provides a liquid glass effect
 * Uses BlurView from expo-blur for cross-platform support
 */
export default function GlassView({
  children,
  style,
  intensity = 20,
  tint = 'light',
  containerStyle
}) {
  return (
    <View style={[styles.container, containerStyle]}>
      <BlurView
        intensity={intensity}
        tint={tint}
        style={[styles.blurView, style]}
      >
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  blurView: {
    overflow: 'hidden',
  },
});
