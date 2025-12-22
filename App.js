import React, { useEffect, useState, useRef, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, useColorScheme, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, RefreshControl } from 'react-native';
import { ProfileIcon as UserIcon } from './lib/icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes } from './theme';
import { supabase } from './lib/supabase';
import { onAuthStateChange } from './lib/auth';
import ProductDetailsSheet from './components/ProductDetailsSheet';
import ProductCard from './components/ProductCard';
import Basket from './components/Basket';
import AuthSheet from './components/AuthSheet';
import Profile from './components/Profile';

// Keep the splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

// AsyncStorage key for basket persistence
// TODO: Sync baskets to Supabase for authenticated users
// For now, baskets are stored locally per device
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
  const [user, setUser] = useState(null);
  const bottomSheetRef = useRef(null);
  const authSheetRef = useRef(null);
  const profileSheetRef = useRef(null);
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

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);

      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session.user.email);
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
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

      if (error) {
        console.error('Error fetching categories:', error.message);
        if (error.message.includes('relation') || error.message.includes('does not exist')) {
          console.error('💡 Database tables not found! Please run supabase-setup.sql in your Supabase dashboard.');
        }
        setCategories([]);
        throw error;
      }
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      // Fallback to empty array
      setCategories([]);
      // Re-throw to propagate error to onRefresh's Promise.all catch block
      throw error;
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

      if (error) {
        console.error('Error fetching products:', error.message);
        if (error.message.includes('relation') || error.message.includes('does not exist')) {
          console.error('💡 Database tables not found! Please run supabase-setup.sql in your Supabase dashboard.');
        }
        setProducts([]);
        setLoading(false);
        throw error;
      }
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error.message);
      // Fallback to empty array
      setProducts([]);
      // Re-throw to propagate error to onRefresh's Promise.all catch block
      throw error;
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
    const existingProductIndex = (basketProducts || []).findIndex(p => p.id === product.id);

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
    setBasketProducts((basketProducts || []).filter(p => p.id !== productId));
  };

  // Decrease quantity or remove from basket
  const decreaseQuantity = (productId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const currentBasket = basketProducts || [];
    const existingProductIndex = currentBasket.findIndex(p => p.id === productId);

    if (existingProductIndex !== -1) {
      const product = currentBasket[existingProductIndex];
      if (product.quantity > 1) {
        // Decrease quantity
        const updatedBasket = [...currentBasket];
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
    return (basketProducts || []).reduce((total, product) => {
      return total + (parseFloat(product.price) * product.quantity);
    }, 0);
  };

  // Filter products based on search query and category
  const filteredProducts = useMemo(() => {
    try {
      const productList = Array.isArray(products) ? products : [];
      return productList.filter(product => {
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
    } catch (error) {
      console.error('Error filtering products:', error);
      return [];
    }
  }, [products, activeCategory, searchQuery]);

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

  // Handle auth success
  const handleAuthSuccess = (newUser) => {
    setUser(newUser);
  };

  // Handle sign out
  const handleSignOut = () => {
    setUser(null);
  };

  // Handle profile button press
  const handleProfilePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (user) {
      profileSheetRef.current?.snapToIndex(0);
    } else {
      authSheetRef.current?.snapToIndex(0);
    }
  };

  // Handle bottom sheet close
  const handleAuthSheetClose = () => {
    // Nothing to do on close
  };

  // Handle profile sheet close
  const handleProfileSheetClose = () => {
    // Nothing to do on close
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.background }}>
      <SafeAreaProvider>
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

          {/* Profile Button */}
          <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
            <UserIcon size={24} color={theme.text} strokeWidth={2} />
            {user && <View style={styles.profileDot} />}
          </TouchableOpacity>

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
                ? (categories || []).find(c => c.id === activeCategory)?.name || 'Products'
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
                <TouchableOpacity
                  style={styles.clearSearchButton}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSearchQuery('');
                  }}
                >
                  <Text style={styles.clearSearchText}>Clear search</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            /* Product Grid */
            <View style={styles.productGrid}>
              {(filteredProducts || []).map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  theme={theme}
                  index={index}
                  onPress={() => addToBasket(product)}
                  onLongPress={() => handleProductLongPress(product)}
                />
              ))}
            </View>
          )}
        </ScrollView>

        {/* Basket Control Center */}
        <Basket
          theme={theme}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categories={categories}
          activeCategory={activeCategory}
          onCategoryPress={handleCategoryPress}
          basketProducts={basketProducts}
          onDecreaseQuantity={decreaseQuantity}
          onRemoveFromBasket={removeFromBasket}
          totalPrice={calculateTotal()}
        />
        </SafeAreaView>

        {/* Product Details Bottom Sheet */}
        <ProductDetailsSheet
          ref={bottomSheetRef}
          product={selectedProduct}
          onAddToBasket={addToBasket}
          onClose={handleBottomSheetClose}
        />

        {/* Auth Sheet */}
        <AuthSheet
          ref={authSheetRef}
          onAuthSuccess={handleAuthSuccess}
          onClose={handleAuthSheetClose}
        />

        {/* Profile Sheet */}
        <Profile
          ref={profileSheetRef}
          user={user}
          onSignOut={handleSignOut}
          onClose={handleProfileSheetClose}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileButton: {
    position: 'absolute',
    top: 10,
    right: 20,
    zIndex: 100,
    padding: 8,
    backgroundColor: '#f0ede7',
    borderRadius: 20,
  },
  profileDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#f0ede7',
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
    padding: 14,
    paddingBottom: 80,
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
