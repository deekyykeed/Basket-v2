import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

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
      <Image
        source={{ uri: product.image_url }}
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productInfo}>
        <Text
          style={[styles.productName, { color: theme.text }]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {product.name}
        </Text>
        <Text style={[styles.productPrice, { color: theme.text }]}>
          ${parseFloat(product.price).toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    width: CARD_WIDTH,
    marginRight: GAP,
    marginBottom: GAP,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
  },
  productInfo: {
    flex: 1,
    gap: 4,
  },
  productName: {
    fontSize: 14,
    fontFamily: 'FamiljenGrotesk-SemiBold',
    color: '#000',
    lineHeight: 18,
    minHeight: 36,
  },
  productPrice: {
    fontSize: 16,
    fontFamily: 'FamiljenGrotesk-Bold',
    color: '#000',
  },
});

export default ProductCard;

