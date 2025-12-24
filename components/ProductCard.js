import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

const ProductCard = ({ product, onPress, onLongPress }) => {
  if (!product) return null;

  return (
    <TouchableOpacity
      style={styles.productCard}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={500}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: product.image_url }}
        style={styles.productImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    width: '100%',
    aspectRatio: 1,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});

export default ProductCard;
