import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCROLLVIEW_PADDING = 20 * 2; // 20px on each side from ScrollView (contentScroll)
const GRID_PADDING = 14 * 2; // 14px on each side from productGrid
const GAP = 14;
const GAPS_TOTAL = GAP * 2; // 2 gaps between 3 items
// Calculate card width: (screen width - all padding - gaps) / 3
const CARD_WIDTH = (SCREEN_WIDTH - SCROLLVIEW_PADDING - GRID_PADDING - GAPS_TOTAL) / 3;

const ProductCard = ({ product, theme, onPress, onLongPress, index }) => {
  if (!product) return null;

  // Remove right margin from every 3rd item (index 2, 5, 8, etc.)
  const isLastInRow = (index + 1) % 3 === 0;
  const cardStyle = [
    styles.productCard,
    isLastInRow && styles.productCardLastInRow
  ];

  return (
    <TouchableOpacity
      style={cardStyle}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={500}
      activeOpacity={0.7}
    >
      {product.quantity_label && (
        <View style={styles.quantityBadge}>
          <Text style={styles.quantityText}>{product.quantity_label}</Text>
        </View>
      )}
      <View style={styles.imageContainer}>
        <View style={styles.productImageShadow}>
          <Image
            source={{ uri: product.image_url }}
            style={styles.shadowImage}
            resizeMode="cover"
          />
          <BlurView intensity={5} style={StyleSheet.absoluteFill} tint="light" />
        </View>
        <Image
          source={{ uri: product.image_url }}
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.productPrice}>
        ${parseFloat(product.price).toFixed(2)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    width: CARD_WIDTH,
    marginRight: GAP,
    marginBottom: GAP,
    minWidth: 80,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
    padding: 0,
    alignContent: 'center',
    flexWrap: 'nowrap',
    gap: 10,
    borderRadius: 0,
  },
  productCardLastInRow: {
    marginRight: 0,
  },
  quantityBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 1,
  },
  quantityText: {
    fontSize: 10,
    fontFamily: 'FamiljenGrotesk-SemiBold',
    color: '#000',
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  productImageShadow: {
    width: '100%',
    aspectRatio: 1,
    position: 'absolute',
    top: 10,
    opacity: 0.25,
    zIndex: -1,
    borderRadius: 0,
    overflow: 'hidden',
  },
  shadowImage: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 0,
    position: 'relative',
  },
  productPrice: {
    fontWeight: '700',
    fontStyle: 'normal',
    fontFamily: 'FamiljenGrotesk-Bold',
    color: '#000000',
    fontSize: 10,
    letterSpacing: 0,
    lineHeight: 1.2,
  },
});

export default ProductCard;

