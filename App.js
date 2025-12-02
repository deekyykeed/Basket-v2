import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, useColorScheme, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as Haptics from 'expo-haptics';
import { themes } from './theme';
import { supabase } from './lib/supabase';
import { CATEGORY_ICONS, HEADER_ICONS, EMOJI_FALLBACKS } from './lib/icons';
import ProductCard from './components/ProductCard';

// Keep the splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

// Static categories - always available, not dependent on Supabase
const STATIC_CATEGORIES = [
  { id: 1, name: 'Grocery', icon: '🛒' },
  { id: 2, name: 'Restaurants', icon: '🍴' },
  { id: 3, name: 'Alcohol', icon: '🍷' },
  { id: 4, name: 'Express', icon: '🚚' },
  { id: 5, name: 'Retail', icon: '🏪' },
];

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Fetch products from Supabase
  useEffect(() => {
    fetchProducts();
  }, []);

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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>Basket.W</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                // Handle profile press
              }}
            >
              {HEADER_ICONS.profile ? (
                <HEADER_ICONS.profile width={20} height={20} />
              ) : (
                <Text style={{ fontSize: 20 }}>{EMOJI_FALLBACKS.profile}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                // Handle orders press
              }}
            >
              {HEADER_ICONS.orders ? (
                <HEADER_ICONS.orders width={20} height={20} />
              ) : (
                <Text style={{ fontSize: 20 }}>{EMOJI_FALLBACKS.orders}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          {STATIC_CATEGORIES.map((category) => {
            const IconComponent = CATEGORY_ICONS[category.icon];
            return (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  // Handle category press - navigate to category page
                  console.log('Category pressed:', category.name);
                }}
              >
                <View style={styles.categoryIconContainer}>
                  {IconComponent ? (
                    <IconComponent width={20} height={20} style={styles.categoryIcon} />
                  ) : (
                    <Text style={{ fontSize: 20 }}>{category.icon}</Text>
                  )}
                </View>
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Text style={styles.searchPlaceholder}>Search...</Text>
          </View>
        </View>

        {/* Fresh Finds Section */}
        <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Fresh Finds</Text>
          </View>

          {/* Loading Indicator */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.text} />
              <Text style={[styles.loadingText, { color: theme.text }]}>Loading products...</Text>
            </View>
          ) : (
            /* Product Grid */
            <View style={styles.productGrid}>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPress={(product) => {
                    // Handle product press - navigate to product detail
                    console.log('Product pressed:', product.name);
                  }}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf9f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'FamiljenGrotesk-Bold',
    color: '#000',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
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
  iconImage: {
    width: 20,
    height: 20,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingVertical: 16,
  },
  categoryButton: {
    alignItems: 'center',
    gap: 2,
  },
  categoryIconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#e9e6dc',
    borderRadius: 20,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    // Shadow for Android
    elevation: 2,
  },
  categoryIcon: {
    width: 20,
    height: 20,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'FamiljenGrotesk-Medium',
    color: 'rgba(0, 0, 0, 0.85)',
    lineHeight: 12,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  searchBar: {
    backgroundColor: '#f0ede7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchPlaceholder: {
    fontSize: 14,
    fontFamily: 'FamiljenGrotesk-Regular',
    color: '#999',
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
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
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
});
