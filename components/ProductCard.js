import React from 'react';
import { Image, Text, View, StyleSheet, TouchableOpacity } from 'react-native';

const ProductCard = ({ product, onPress, onLongPress, basketQuantity = 0 }) => {
  if (!product) return null;

  const priceNumber = Number(product?.price ?? 0);
  const safePrice = Number.isFinite(priceNumber) ? priceNumber : 0;
  
  // Get bundle size from product (e.g., 6 for eggs)
  let bundleSize = 1;
  if (product.quantity_label) {
    const match = product.quantity_label.match(/\d+/);
    if (match) {
      bundleSize = parseInt(match[0], 10);
    }
  }
  
  const isInBasket = basketQuantity > 0;
  
  // Show price based on number of packs in basket
  // If in basket: multiply base price by number of packs (basketQuantity / bundleSize)
  // If not in basket: show base price
  const numberOfPacks = isInBasket ? basketQuantity / bundleSize : 1;
  const displayPrice = safePrice * numberOfPacks;
  const price = displayPrice.toFixed(1); // always one decimal digit
  const [whole, decimals] = price.split('.');
  
  // Determine what quantity to show
  // When in basket: show basket quantity (e.g., x6, x12)
  // When not in basket but has bundle: show bundle size (e.g., x6)
  const showQuantityLabel = isInBasket || bundleSize > 1;
  const quantityToShow = isInBasket ? basketQuantity : bundleSize;

  return (
    <TouchableOpacity
      style={styles.productCard}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={500}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image_url }}
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.priceContainer}>
        <Text style={[styles.productPrice, isInBasket && styles.priceInBasket]}>
          {whole}.<Text>{decimals}</Text>
        </Text>
        {showQuantityLabel && (
          <Text style={[styles.quantityLabel, isInBasket && styles.quantityInBasket]}>
            x{quantityToShow}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    width: '100%',
    flexDirection: 'column',
    backgroundColor: '#fff',
    paddingBottom: 4,
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  productPrice: {
    fontSize: 16,
    fontFamily: 'Fortnite',
    color: '#000',
    textAlign: 'center',
  },
  priceInBasket: {
    color: '#D97655',
  },
  quantityLabel: {
    fontSize: 18,
    fontFamily: 'Fortnite',
    color: 'rgba(0, 0, 0, 0.6)',
    textAlign: 'center',
  },
  quantityInBasket: {
    color: '#D97655',
  },
});

export default ProductCard;
