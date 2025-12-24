import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCROLLVIEW_PADDING = 20 * 2; // 20px padding on each side
const GAP = 10; // Gap between items
const NUM_COLUMNS = 3;
// For 3 columns with 2 gaps: (screenWidth - padding - (gaps * 2)) / 3
const CARD_WIDTH = (SCREEN_WIDTH - SCROLLVIEW_PADDING - (GAP * (NUM_COLUMNS - 1))) / NUM_COLUMNS;

const ProductCard = ({ product, theme, onPress, onLongPress }) => {
  if (!product) return null;

  return (
    <TouchableOpacity
      style={styles.productCard}
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
        {/* Shadow layer with much larger offset */}
        <Image
          source={{ uri: product.image_url }}
          style={styles.shadowImage}
          resizeMode="cover"
          blurRadius={25}
        />
        
        {/* Main product image on top */}
        <Image
          source={{ uri: product.image_url }}
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>
          ${parseFloat(product.price).toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    width: CARD_WIDTH,
    marginBottom: 30, // Extra margin for shadow visibility
    minWidth: 80,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    overflow: 'visible',
    padding: 0,
    gap: 10,
  },
  quantityBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  quantityText: {
    fontSize: 10,
    fontFamily: 'FamiljenGrotesk-SemiBold',
    color: '#000',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
    overflow: 'visible',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20, // Extra padding for shadow
  },
  shadowImage: {
    position: 'absolute',
    width: '80%',
    height: '80%',
    top: '25%', // Pushed down significantly
    opacity: 0.6,
    zIndex: 0,
  },
  productImage: {
    width: '85%',
    height: '85%',
    zIndex: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  productInfo: {
    width: '100%',
    paddingHorizontal: 10,
    paddingTop: 8,
    alignItems: 'center',
  },
  productName: {
    fontSize: 12,
    fontFamily: 'FamiljenGrotesk-Medium',
    color: '#000000',
    marginBottom: 4,
    textAlign: 'center',
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