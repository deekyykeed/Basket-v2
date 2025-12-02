import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as Haptics from 'expo-haptics';

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
      <Image
        source={{ uri: product.image_url }}
        style={styles.productImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  productCard: {
    width: '23%',
    aspectRatio: 1,
    marginBottom: 12,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
});
