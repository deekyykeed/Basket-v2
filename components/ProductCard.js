import React, { useMemo, useState } from 'react';
import { Image, Text, View, StyleSheet, TouchableOpacity } from 'react-native';

const ProductCard = ({ product, onPress, onLongPress, basketQuantity = 0 }) => {
  const [imageError, setImageError] = useState(false);
  
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

  // Generate random percentage between 0.5 and 1.2, stable per product
  const randomPercentage = useMemo(() => {
    // Create a pseudo-random number from product ID for consistency
    const idString = product.id ? String(product.id) : String(Math.random());
    let hash = 0;
    for (let i = 0; i < idString.length; i++) {
      hash = ((hash << 5) - hash) + idString.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    const random = Math.abs(hash % 10000) / 10000; // Convert to 0-1 range
    const percentage = 0.5 + (random * (1.2 - 0.5)); // Scale to 0.5-1.2 range
    return `+${percentage.toFixed(1)}%`;
  }, [product.id]);

  return (
    <TouchableOpacity
      style={styles.productCard}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={500}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        {product.image_url && !imageError ? (
          <Image
            source={{ 
              uri: encodeURI(product.image_url).replace(/%20/g, '%20')
            }}
            style={styles.productImage}
            resizeMode="cover"
            onError={(error) => {
              console.error('Image load error for product:', product.name);
              console.error('Image URL:', product.image_url);
              console.error('Error details:', error.nativeEvent?.error || 'Unknown error');
              setImageError(true);
            }}
            onLoadStart={() => setImageError(false)}
          />
        ) : (
          <View style={[styles.productImage, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>📦</Text>
          </View>
        )}
        <Text style={styles.discountLabel}>{randomPercentage}</Text>
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
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 12,
  },
  productPrice: {
    fontSize: 18,
    fontFamily: 'Fortnite',
    color: '#000',
    textAlign: 'center',
  },
  priceInBasket: {
    color: '#D97655',
  },
  quantityLabel: {
    fontSize: 16,
    fontFamily: 'Fortnite',
    color: 'rgba(0, 0, 0, 0.6)',
    textAlign: 'center',
  },
  quantityInBasket: {
    color: '#D97655',
  },
  discountLabel: {
    position: 'absolute',
    top: 14,
    right: 14,
    fontSize: 14,
    fontFamily: 'Fortnite',
    color: '#16a34a',
    textAlign: 'center',
  },
  placeholderImage: {
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
  },
});

export default ProductCard;
