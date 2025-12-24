import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import * as Haptics from 'expo-haptics';
import ProductCard from './ProductCard';

const ProductGrid = ({
  theme,
  loading,
  refreshing,
  onRefresh,
  products,
  searchQuery,
  onClearSearch,
  onAddToBasket,
  onProductLongPress,
}) => {
  return (
    <ScrollView
      style={styles.contentScroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.text}
          colors={[theme.text]}
        />
      }
    >
      {/* Loading Indicator */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.text} />
          <Text style={[styles.loadingText, { color: theme.text }]}>Loading products...</Text>
        </View>
      ) : products.length === 0 ? (
        /* Empty State */
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            {searchQuery ? 'No products found' : 'No products available'}
          </Text>
          <Text style={styles.emptyMessage}>
            {searchQuery
              ? `Try searching for something else`
              : 'Check back later for new products'}
          </Text>
          {searchQuery && (
            <TouchableOpacity
              style={styles.clearSearchButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onClearSearch();
              }}
            >
              <Text style={styles.clearSearchText}>Clear search</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        /* Product Grid */
        <View style={styles.productGrid}>
          {(products || []).map((product, index) => (
            <View key={product.id} style={styles.productCardWrapper}>
              <ProductCard
                product={product}
                theme={theme}
                index={index}
                onPress={() => onAddToBasket(product)}
                onLongPress={() => onProductLongPress(product)}
              />
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentScroll: {
    flex: 1,
    overflow: 'hidden',
    width: '100%',
  },
  scrollContent: {
    overflow: 'hidden',
    paddingTop: 10,
  },
  productGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    paddingBottom: 90,
  },
  productCardWrapper: {
    width: '32.5%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'FamiljenGrotesk-Regular',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'FamiljenGrotesk-Bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    fontFamily: 'FamiljenGrotesk-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  clearSearchButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  clearSearchText: {
    fontSize: 14,
    fontFamily: 'FamiljenGrotesk-Bold',
    color: '#fff',
  },
});

export default ProductGrid;