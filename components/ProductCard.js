import React from 'react';
import { StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import GlassView from './GlassView';

export default function ProductCard({ product, onPress }) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onPress) {
      onPress(product);
    }
  };

  return (
    <TouchableOpacity
      style={styles.productCard}
      onPress={handlePress}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image_url }}
          style={styles.productImage}
          resizeMode="cover"
        />
        <GlassView
          style={styles.glassOverlay}
          glassEffectStyle="clear"
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  productCard: {
    width: '23%',
    aspectRatio: 1,
    marginBottom: 12,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  glassOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
});
