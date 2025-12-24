import React from 'react';
import { Image, Text, StyleSheet, TouchableOpacity } from 'react-native';

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
      <Text style={styles.productPrice}>
        ${parseFloat(product.price).toFixed(2)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    width: '100%',
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 2,
    overflow: 'hidden',
    paddingBottom: 4,
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
  },
  productPrice: {
    fontSize: 12,
    fontFamily: 'FamiljenGrotesk-SemiBold',
    color: '#000',
    marginLeft: 4,
    textAlign: 'left',
  },
});

export default ProductCard;
