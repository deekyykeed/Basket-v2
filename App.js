import React, { useEffect, useState, useRef, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, useColorScheme, TouchableOpacity, Image } from 'react-native';
import { NotificationIcon } from './lib/icons';
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
import Basket from './components/Basket';
import AuthSheet from './components/AuthSheet';
import Profile from './components/Profile';
import CategoryFilter from './components/CategoryFilter';
import SearchBar from './components/SearchBar';
import ProductGrid from './components/ProductGrid';

// Keep the splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

// AsyncStorage key for basket persistence
// TODO: Sync baskets to Supabase for authenticated users
// For now, baskets are stored locally per device
const BASKET_STORAGE_KEY = '@basket_products';

// Hardcoded categories
const CATEGORIES = [
  { id: 'produce', name: 'Produce', icon: '🥕', slug: 'produce' },
  { id: 'restaurants', name: 'Restaurants', icon: '🍴', slug: 'restaurants' },
  { id: 'drinks', name: 'Drinks', icon: '🍷', slug: 'drinks' },
  { id: 'snacks', name: 'Snacks', icon: '🍿', slug: 'snacks' },
  { id: 'retail', name: 'Retail', icon: '🏪', slug: 'retail' },
];

export default function App() {
  const [categories] = useState(CATEGORIES);
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

  // Categories are now hardcoded, no need to fetch

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

  // Handle pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Fetch products only (categories are hardcoded)
      await fetchProducts();
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
    <GestureHandlerRootView style={[styles.appContainer, { backgroundColor: theme.background }]}>
      <SafeAreaProvider>
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

          {/* Header */}
          <View style={styles.header}>
            {/* Top Header */}
            <View style={styles.topHeader}>
              {/* App Title */}
              <Text style={[styles.appTitle, { color: theme.text }]} numberOfLines={1}>
                Basket.Plans
              </Text>
              {/* Notification Icon */}
              <TouchableOpacity style={styles.iconButton}>
                <NotificationIcon size={20} color={theme.text} strokeWidth={1.5} />
              </TouchableOpacity>
              {/* Profile Button */}
              <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
                <Image
                  source={require('./assets/images/profile/Moody Portrait with Headphones.png')}
                  style={styles.profileImage}
                />
                {user && <View style={styles.profileDot} />}
              </TouchableOpacity>
            </View>

            {/* Section Header */}
            <View style={styles.sectionHeaderContainer}>
              {/* Search Bar */}
              <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

              {/* Categories */}
              <CategoryFilter
                activeCategory={activeCategory}
                onCategoryPress={setActiveCategory}
              />
            </View>
          </View>

        {/* Products Section */}
        <ProductGrid
          theme={theme}
          loading={loading}
          refreshing={refreshing}
          onRefresh={onRefresh}
          products={filteredProducts}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
          onAddToBasket={addToBasket}
          onProductLongPress={handleProductLongPress}
        />

        {/* Basket Control Center */}
        <Basket
          theme={theme}
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
  appContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    overflow: 'hidden',
    padding: 0,
    alignContent: 'center',
    flexWrap: 'nowrap',
    gap: 0,
    borderRadius: 0,
  },
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    overflow: 'hidden',
    padding: 0,
    alignContent: 'center',
    flexWrap: 'nowrap',
    gap: 0,
    borderRadius: 0,
  },
  header: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    padding: 0,
    alignContent: 'center',
    flexWrap: 'nowrap',
    gap: 0,
    borderRadius: 0,
  },
  topHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 14,
    paddingRight: 14,
    paddingBottom: 0,
    paddingLeft: 14,
    overflow: 'visible',
    alignContent: 'center',
    flexWrap: 'nowrap',
    gap: 14,
    borderRadius: 0,
  },
  sectionHeaderContainer: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 14,
    paddingRight: 0,
    paddingBottom: 14,
    paddingLeft: 0,
    overflow: 'visible',
    alignContent: 'center',
    flexWrap: 'nowrap',
    gap: 14,
    borderRadius: 0,
  },
  appTitle: {
    flex: 1,
    width: 1,
    fontWeight: '600',
    fontStyle: 'normal',
    fontFamily: 'FamiljenGrotesk-SemiBold',
    fontSize: 22,
    letterSpacing: 0,
    textAlign: 'left',
    lineHeight: 22 * 1.2,
  },
  iconButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    flexWrap: 'nowrap',
    padding: 10,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  profileButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
  },
  profileDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
    borderWidth: 1.5,
    borderColor: '#f0ede7',
  },
});
