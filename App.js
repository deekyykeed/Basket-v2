import React, { useEffect, useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, useColorScheme, ScrollView, TouchableOpacity, Image, ActivityIndicator, TextInput, RefreshControl } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes } from './theme';
import { supabase } from './lib/supabase';
import { CATEGORY_ICONS, BOTTOM_NAV_ICONS, SearchIcon, CloseIcon, CheckmarkIcon } from './lib/icons';
import ProductDetailsSheet from './components/ProductDetailsSheet';

// Keep the splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

// AsyncStorage key for basket persistence
const BASKET_STORAGE_KEY = '@basket_products';

export default function App() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [basketProducts, setBasketProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const bottomSheetRef = useRef(null);
  const colorScheme = useColorScheme();
  const theme = themes[colorScheme === 'dark' ? 'dark' : 'light'];

  const [fontsLoaded] = useFonts({
    'FamiljenGrotesk-Regular': require('./assets/fonts/FamiljenGrotesk-Regular.otf'),
    'FamiljenGrotesk-Medium': require('./assets/fonts/FamiljenGrotesk-Medium.otf'),
    'FamiljenGrotesk-SemiBold': require('./assets/fonts/FamiljenGrotesk-SemiBold.otf'),
    'FamiljenGrotesk-Bold': require('./assets/fonts/FamiljenGrotesk-Bold.otf'),
    'FamiljenGrotesk-Italic': require('./assets/fonts/FamiljenGrotesk-Italic.otf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Fetch categories from Supabase
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products from Supabase
  useEffect(() => {
    fetchProducts();
  }, []);

  // Load basket from storage on mount
  useEffect(() => {
    loadBasket();
  }, []);

  // Save basket whenever it changes
  useEffect(() => {
    if (basketProducts.length >= 0) {
      saveBasket();
    }
  }, [basketProducts]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      // Fallback to empty array
      setCategories([]);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_available', true)
        .eq('featured', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error.message);
      // Fallback to empty array
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Load basket from AsyncStorage
  const loadBasket = async () => {
    try {
      const savedBasket = await AsyncStorage.getItem(BASKET_STORAGE_KEY);
      if (savedBasket) {
        const parsedBasket = JSON.parse(savedBasket);
        setBasketProducts(parsedBasket);
      }
    } catch (error) {
      console.error('Error loading basket:', error);
    }
  };

  // Save basket to AsyncStorage
  const saveBasket = async () => {
    try {
      await AsyncStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(basketProducts));
    } catch (error) {
      console.error('Error saving basket:', error);
    }
  };

  // Add product to basket with haptic feedback
  const addToBasket = (product) => {
    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Check if product already exists in basket
    const existingProductIndex = basketProducts.findIndex(p => p.id === product.id);

    if (existingProductIndex !== -1) {
      // Product exists, increase quantity
      const updatedBasket = [...basketProducts];
      updatedBasket[existingProductIndex] = {
        ...updatedBasket[existingProductIndex],
        quantity: (updatedBasket[existingProductIndex].quantity || 1) + 1
      };
      setBasketProducts(updatedBasket);
    } else {
      // New product, add to basket
      setBasketProducts([...basketProducts, { ...product, quantity: 1 }]);
    }
  };

  // Handle long press for product details
  const handleProductLongPress = (product) => {
    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // Set selected product and open bottom sheet
    setSelectedProduct(product);
    bottomSheetRef.current?.snapToIndex(0);
  };

  // Handle bottom sheet close
  const handleBottomSheetClose = () => {
    setSelectedProduct(null);
  };

  // Remove product from basket
  const removeFromBasket = (productId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setBasketProducts(basketProducts.filter(p => p.id !== productId));
  };

  // Decrease quantity or remove from basket
  const decreaseQuantity = (productId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const existingProductIndex = basketProducts.findIndex(p => p.id === productId);

    if (existingProductIndex !== -1) {
      const product = basketProducts[existingProductIndex];
      if (product.quantity > 1) {
        // Decrease quantity
        const updatedBasket = [...basketProducts];
        updatedBasket[existingProductIndex] = {
          ...product,
          quantity: product.quantity - 1
        };
        setBasketProducts(updatedBasket);
      } else {
        // Remove product if quantity is 1
        removeFromBasket(productId);
      }
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    return basketProducts.reduce((total, product) => {
      return total + (parseFloat(product.price) * product.quantity);
    }, 0);
  };

  // Filter products based on search query and category
  const filteredProducts = products.filter(product => {
    // Category filter
    if (activeCategory && product.category_id !== activeCategory) {
      return false;
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const name = product.name?.toLowerCase() || '';
      const description = product.description?.toLowerCase() || '';

      return name.includes(query) || description.includes(query);
    }

    return true;
  });

  // Handle category selection
  const handleCategoryPress = (categoryId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Toggle category: if already active, deactivate it (show all)
    if (activeCategory === categoryId) {
      setActiveCategory(null);
    } else {
      setActiveCategory(categoryId);
    }
  };

  // Clear search
  const clearSearch = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSearchQuery('');
  };

  // Handle pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Fetch both categories and products
      await Promise.all([
        fetchCategories(),
        fetchProducts()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          {categories.map((category) => {
            const IconComponent = CATEGORY_ICONS[category.icon];
            const isActive = activeCategory === category.id;
            return (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryButton}
                onPress={() => handleCategoryPress(category.id)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.categoryIconContainer,
                  isActive && styles.categoryIconContainerActive
                ]}>
                  {IconComponent ? (
                    <IconComponent
                      size={24}
                      color={isActive ? '#fff' : '#000'}
                      strokeWidth={isActive ? 2 : 1.5}
                    />
                  ) : (
                    <Text style={{ fontSize: 24 }}>{category.icon}</Text>
                  )}
                </View>
                <Text style={[
                  styles.categoryText,
                  { color: theme.text },
                  isActive && styles.categoryTextActive
                ]}>{category.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

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

        {/* Products Section */}
        <ScrollView
          style={styles.contentScroll}
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
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {searchQuery
                ? `Results for "${searchQuery}"`
                : activeCategory
                ? categories.find(c => c.id === activeCategory)?.name || 'Products'
                : 'Fresh Finds'}
            </Text>
            {(searchQuery || activeCategory) && filteredProducts.length > 0 && (
              <Text style={[styles.resultCount, { color: theme.text }]}>
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </Text>
            )}
          </View>

          {/* Loading Indicator */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.text} />
              <Text style={[styles.loadingText, { color: theme.text }]}>Loading products...</Text>
            </View>
          ) : filteredProducts.length === 0 ? (
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
                <TouchableOpacity style={styles.clearSearchButton} onPress={clearSearch}>
                  <Text style={styles.clearSearchText}>Clear search</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            /* Product Grid */
            <View style={styles.productGrid}>
              {filteredProducts.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.productCard}
                  onPress={() => addToBasket(product)}
                  onLongPress={() => handleProductLongPress(product)}
                  delayLongPress={500}
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
              ))}
            </View>
          )}
        </ScrollView>

        {/* Basket */}
        {basketProducts.length > 0 && (
          <View style={styles.basket}>
            <View style={styles.basketHeader}>
              <View style={styles.basketTitleContainer}>
                <Text style={styles.basketTitle}>Basket</Text>
                <View style={styles.savedIndicator}>
                  <CheckmarkIcon size={14} color="#22c55e" strokeWidth={2} />
                  <Text style={styles.savedText}>Saved for Friday</Text>
                </View>
              </View>
              <Text style={styles.basketTotal}>${calculateTotal().toFixed(2)}</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.basketScrollContent}
            >
              {basketProducts.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.basketProductCell}
                  onPress={() => decreaseQuantity(product.id)}
                  onLongPress={() => removeFromBasket(product.id)}
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
          </View>
        )}
        </SafeAreaView>

        {/* Product Details Bottom Sheet */}
        <ProductDetailsSheet
          ref={bottomSheetRef}
          product={selectedProduct}
          onAddToBasket={addToBasket}
          onClose={handleBottomSheetClose}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf9f5',
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingVertical: 20,
    paddingTop: 10,
  },
  categoryButton: {
    alignItems: 'center',
    gap: 8,
  },
  categoryIconContainer: {
    width: 'auto',
    height: 'auto',
    minWidth: 'auto',
    minHeight: 'auto',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#e9e6dc',
    overflow: 'hidden',
    borderRadius: 20,
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  categoryIconContainerActive: {
    backgroundColor: '#000',
  },
  categoryIcon: {
    width: 24,
    height: 24,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'FamiljenGrotesk-Medium',
    color: '#000',
  },
  categoryTextActive: {
    fontFamily: 'FamiljenGrotesk-Bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
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
  contentScroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'FamiljenGrotesk-SemiBold',
    color: '#000',
  },
  resultCount: {
    fontSize: 14,
    fontFamily: 'FamiljenGrotesk-Medium',
    color: '#666',
    marginTop: 4,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 80,
  },
  productCard: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
});
