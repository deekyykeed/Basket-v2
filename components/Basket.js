import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import * as Haptics from 'expo-haptics';
import { CATEGORY_ICONS, SearchIcon, CloseIcon, CheckmarkIcon, ExpandIcon, FavoriteIcon } from '../lib/icons';

const Basket = ({
  theme,
  searchQuery,
  setSearchQuery,
  categories,
  activeCategory,
  onCategoryPress,
  basketProducts,
  onDecreaseQuantity,
  onRemoveFromBasket,
  totalPrice,
  favoriteProducts,
  onAddToBasket,
  onToggleFavorite,
  onUpdateFrequency,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('basket'); // 'basket' or 'favorites'
  const [selectedProductId, setSelectedProductId] = useState(null); // For frequency selector

  const clearSearch = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSearchQuery('');
  };

  const toggleExpand = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setActiveTab('basket'); // Reset to basket tab when expanding
    }
  };

  const handleTabChange = (tab) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tab);
  };

  return (
    <View style={[styles.basket, isExpanded && styles.basketExpanded]}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <SearchIcon size={18} color="#999" strokeWidth={1.5} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <CloseIcon size={18} color="#666" strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollContent}
        >
          {categories.map((category) => {
            const IconComponent = CATEGORY_ICONS[category.icon];
            const isActive = activeCategory === category.id;
            return (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryButton}
                onPress={() => onCategoryPress(category.id)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.categoryIconContainer,
                  isActive && styles.categoryIconContainerActive
                ]}>
                  {IconComponent ? (
                    <IconComponent
                      size={20}
                      color={isActive ? '#fff' : '#000'}
                      strokeWidth={isActive ? 2 : 1.5}
                    />
                  ) : (
                    <Text style={{ fontSize: 20 }}>{category.icon}</Text>
                  )}
                </View>
                <Text style={[
                  styles.categoryText,
                  isActive && styles.categoryTextActive
                ]}>{category.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Basket Header */}
      <View style={styles.basketHeader}>
        <View style={styles.basketTitleContainer}>
          <Text style={styles.basketTitle}>Basket</Text>
          {basketProducts.length > 0 && (
            <View style={styles.savedIndicator}>
              <CheckmarkIcon size={14} color="#22c55e" strokeWidth={2} />
              <Text style={styles.savedText}>Saved for Friday</Text>
            </View>
          )}
        </View>
        <View style={styles.basketHeaderRight}>
          <Text style={styles.basketTotal}>${totalPrice.toFixed(2)}</Text>
          {basketProducts.length > 0 && (
            <TouchableOpacity onPress={toggleExpand} style={styles.expandButton}>
              <ExpandIcon
                size={20}
                color="#000"
                strokeWidth={2}
                style={isExpanded && styles.expandIconRotated}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs (only show when expanded) */}
      {isExpanded && (
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'basket' && styles.tabActive]}
            onPress={() => handleTabChange('basket')}
          >
            <Text style={[styles.tabText, activeTab === 'basket' && styles.tabTextActive]}>
              Basket {basketProducts.length > 0 && `(${basketProducts.length})`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'favorites' && styles.tabActive]}
            onPress={() => handleTabChange('favorites')}
          >
            <Text style={[styles.tabText, activeTab === 'favorites' && styles.tabTextActive]}>
              Favorites {favoriteProducts?.length > 0 && `(${favoriteProducts.length})`}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Basket Products or Empty State */}
      {basketProducts.length > 0 || (isExpanded && activeTab === 'favorites') ? (
        isExpanded ? (
          // Grid layout when expanded
          activeTab === 'basket' ? (
            // Basket Grid
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.basketGridContainer}
            >
              <View style={styles.basketGrid}>
                {basketProducts.map((product) => {
                  const frequencyLabel = {
                    once: 'Once',
                    weekly: 'Weekly',
                    biweekly: 'Bi-weekly',
                    monthly: 'Monthly'
                  }[product.frequency || 'once'];

                  return (
                <View key={product.id} style={styles.basketGridItem}>
                  <TouchableOpacity
                    style={styles.basketGridCell}
                    onPress={() => onDecreaseQuantity(product.id)}
                    onLongPress={() => onRemoveFromBasket(product.id)}
                    delayLongPress={300}
                    activeOpacity={0.7}
                  >
                    <Image
                      source={{ uri: product.image_url }}
                      style={styles.basketGridImage}
                      resizeMode="cover"
                    />
                    {product.quantity > 1 && (
                      <View style={styles.basketQuantityBadge}>
                        <Text style={styles.basketQuantityText}>{product.quantity}</Text>
                      </View>
                    )}
                    <View style={styles.basketGridInfo}>
                      <Text style={styles.basketGridName} numberOfLines={2}>
                        {product.name}
                      </Text>
                      <Text style={styles.basketGridPrice}>
                        ${(parseFloat(product.price) * product.quantity).toFixed(2)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {/* Frequency Selector */}
                  <View style={styles.frequencyContainer}>
                    <TouchableOpacity
                      style={[
                        styles.frequencyButton,
                        product.frequency === 'once' && styles.frequencyButtonActive
                      ]}
                      onPress={() => onUpdateFrequency(product.id, 'once')}
                    >
                      <Text style={[
                        styles.frequencyButtonText,
                        product.frequency === 'once' && styles.frequencyButtonTextActive
                      ]}>Once</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.frequencyButton,
                        product.frequency === 'weekly' && styles.frequencyButtonActive
                      ]}
                      onPress={() => onUpdateFrequency(product.id, 'weekly')}
                    >
                      <Text style={[
                        styles.frequencyButtonText,
                        product.frequency === 'weekly' && styles.frequencyButtonTextActive
                      ]}>Weekly</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.frequencyButton,
                        product.frequency === 'biweekly' && styles.frequencyButtonActive
                      ]}
                      onPress={() => onUpdateFrequency(product.id, 'biweekly')}
                    >
                      <Text style={[
                        styles.frequencyButtonText,
                        product.frequency === 'biweekly' && styles.frequencyButtonTextActive
                      ]}>Bi-weekly</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.frequencyButton,
                        product.frequency === 'monthly' && styles.frequencyButtonActive
                      ]}
                      onPress={() => onUpdateFrequency(product.id, 'monthly')}
                    >
                      <Text style={[
                        styles.frequencyButtonText,
                        product.frequency === 'monthly' && styles.frequencyButtonTextActive
                      ]}>Monthly</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}))}
            </View>
            </ScrollView>
          ) : (
            // Favorites Grid
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.basketGridContainer}
            >
              {favoriteProducts && favoriteProducts.length > 0 ? (
                <View style={styles.basketGrid}>
                  {favoriteProducts.map((product) => (
                    <TouchableOpacity
                      key={product.id}
                      style={styles.basketGridCell}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        onAddToBasket(product);
                      }}
                      onLongPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                        onToggleFavorite(product.id);
                      }}
                      delayLongPress={500}
                      activeOpacity={0.7}
                    >
                      <Image
                        source={{ uri: product.image_url }}
                        style={styles.basketGridImage}
                        resizeMode="cover"
                      />
                      {/* Heart icon indicator */}
                      <View style={styles.favoriteIconContainer}>
                        <FavoriteIcon size={18} color="#ef4444" strokeWidth={2} variant="solid" />
                      </View>
                      <View style={styles.basketGridInfo}>
                        <Text style={styles.basketGridName} numberOfLines={2}>
                          {product.name}
                        </Text>
                        <Text style={styles.basketGridPrice}>
                          ${parseFloat(product.price).toFixed(2)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyFavoritesContainer}>
                  <View style={styles.emptyFavoritesIconContainer}>
                    <FavoriteIcon size={64} color="#ddd" strokeWidth={1.5} />
                  </View>
                  <Text style={styles.emptyFavoritesText}>No favorites yet</Text>
                  <Text style={styles.emptyFavoritesSubtext}>
                    Tap the heart icon on products to save them here
                  </Text>
                  <Text style={styles.emptyFavoritesHint}>
                    Tap = Add to basket • Long press = Remove
                  </Text>
                </View>
              )}
            </ScrollView>
          )
        ) : (
          // Horizontal scroll when collapsed
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.basketScrollContent}
          >
            {basketProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.basketProductCell}
                onPress={() => onDecreaseQuantity(product.id)}
                onLongPress={() => onRemoveFromBasket(product.id)}
                delayLongPress={300}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: product.image_url }}
                  style={styles.basketProductImage}
                  resizeMode="cover"
                />
                {product.quantity > 1 && (
                  <View style={styles.basketQuantityBadge}>
                    <Text style={styles.basketQuantityText}>{product.quantity}</Text>
                  </View>
                )}
                <View style={styles.basketItemPrice}>
                  <Text style={styles.basketItemPriceText}>
                    ${(parseFloat(product.price) * product.quantity).toFixed(2)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )
      ) : (
        <View style={styles.basketEmpty}>
          <Text style={styles.basketEmptyText}>Tap products to add to your basket</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  basket: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    right: 14,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 25,
    zIndex: 1000,
  },
  basketExpanded: {
    top: 60,
    bottom: 14,
    height: 'auto',
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f0ede7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'FamiljenGrotesk-Regular',
    color: '#000',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  categoriesContainer: {
    marginBottom: 12,
  },
  categoriesScrollContent: {
    gap: 12,
    paddingHorizontal: 4,
  },
  categoryButton: {
    alignItems: 'center',
    gap: 6,
  },
  categoryIconContainer: {
    width: 'auto',
    height: 'auto',
    minWidth: 'auto',
    minHeight: 'auto',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#e9e6dc',
    overflow: 'hidden',
    borderRadius: 16,
    borderWidth: 0,
  },
  categoryIconContainerActive: {
    backgroundColor: '#000',
  },
  categoryText: {
    fontSize: 11,
    fontFamily: 'FamiljenGrotesk-Medium',
    color: '#000',
  },
  categoryTextActive: {
    fontFamily: 'FamiljenGrotesk-Bold',
  },
  basketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  basketTitleContainer: {
    flexDirection: 'column',
    gap: 4,
  },
  basketTitle: {
    fontSize: 18,
    fontFamily: 'FamiljenGrotesk-Bold',
    color: '#000',
  },
  basketHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  expandButton: {
    padding: 4,
  },
  expandIconRotated: {
    transform: [{ rotate: '45deg' }],
  },
  savedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  savedText: {
    fontSize: 11,
    fontFamily: 'FamiljenGrotesk-Medium',
    color: '#22c55e',
  },
  basketTotal: {
    fontSize: 20,
    fontFamily: 'FamiljenGrotesk-Bold',
    color: '#000',
  },
  basketScrollContent: {
    gap: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  basketProductCell: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e9e6dc',
    overflow: 'hidden',
    position: 'relative',
  },
  basketProductImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  basketQuantityBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#000',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  basketQuantityText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'FamiljenGrotesk-Bold',
  },
  basketItemPrice: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    right: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  basketItemPriceText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'FamiljenGrotesk-Bold',
    textAlign: 'center',
  },
  basketEmpty: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  basketEmptyText: {
    fontSize: 13,
    fontFamily: 'FamiljenGrotesk-Medium',
    color: '#999',
  },
  basketGridContainer: {
    paddingBottom: 12,
  },
  basketGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  basketGridItem: {
    width: '48%',
    marginBottom: 16,
  },
  basketGridCell: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e9e6dc',
    overflow: 'hidden',
    marginBottom: 8,
  },
  basketGridImage: {
    width: '100%',
    height: 120,
    borderRadius: 16,
  },
  basketGridInfo: {
    padding: 12,
    gap: 4,
  },
  basketGridName: {
    fontSize: 14,
    fontFamily: 'FamiljenGrotesk-SemiBold',
    color: '#000',
    lineHeight: 18,
  },
  basketGridPrice: {
    fontSize: 16,
    fontFamily: 'FamiljenGrotesk-Bold',
    color: '#000',
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#f0ede7',
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: '#000',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'FamiljenGrotesk-SemiBold',
    color: '#666',
  },
  tabTextActive: {
    color: '#fff',
  },
  favoriteIconContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    zIndex: 1,
  },
  emptyFavoritesContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyFavoritesIconContainer: {
    marginBottom: 16,
    opacity: 0.3,
  },
  emptyFavoritesText: {
    fontSize: 18,
    fontFamily: 'FamiljenGrotesk-Bold',
    color: '#000',
    marginBottom: 8,
  },
  emptyFavoritesSubtext: {
    fontSize: 14,
    fontFamily: 'FamiljenGrotesk-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyFavoritesHint: {
    fontSize: 12,
    fontFamily: 'FamiljenGrotesk-Medium',
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  frequencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  frequencyButton: {
    flex: 1,
    minWidth: '48%',
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#f0ede7',
    borderRadius: 8,
    alignItems: 'center',
  },
  frequencyButtonActive: {
    backgroundColor: '#000',
  },
  frequencyButtonText: {
    fontSize: 10,
    fontFamily: 'FamiljenGrotesk-SemiBold',
    color: '#666',
  },
  frequencyButtonTextActive: {
    color: '#fff',
  },
});

export default Basket;
