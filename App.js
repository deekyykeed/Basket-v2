import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, useColorScheme, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { themes } from './theme';
import { supabase } from './lib/supabase';
import { CATEGORY_ICONS, HEADER_ICONS, EMOJI_FALLBACKS } from './lib/icons';

// Keep the splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [categories, setCategories] = useState([]);
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

  // Fetch categories from Supabase
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products from Supabase
  useEffect(() => {
    fetchProducts();
  }, []);

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
            <TouchableOpacity style={styles.iconButton}>
              {HEADER_ICONS.profile ? (
                <Image
                  source={HEADER_ICONS.profile}
                  style={styles.iconImage}
                  resizeMode="contain"
                />
              ) : (
                <Text style={{ fontSize: 20 }}>{EMOJI_FALLBACKS.profile}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              {HEADER_ICONS.orders ? (
                <Image
                  source={HEADER_ICONS.orders}
                  style={styles.iconImage}
                  resizeMode="contain"
                />
              ) : (
                <Text style={{ fontSize: 20 }}>{EMOJI_FALLBACKS.orders}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity key={category.id} style={styles.categoryButton}>
              <View style={styles.categoryIconContainer}>
                {CATEGORY_ICONS[category.icon] ? (
                  <Image
                    source={CATEGORY_ICONS[category.icon]}
                    style={styles.categoryIcon}
                    resizeMode="contain"
                  />
                ) : (
                  <Text style={{ fontSize: 24 }}>{category.icon}</Text>
                )}
              </View>
              <Text style={[styles.categoryText, { color: theme.text }]}>{category.name}</Text>
            </TouchableOpacity>
          ))}
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
                <TouchableOpacity key={product.id} style={styles.productCard}>
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
                  <Text style={[styles.productPrice, { color: theme.text }]}>
                    {parseFloat(product.price).toFixed(2)}
                  </Text>
                </TouchableOpacity>
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
  categoryIcon: {
    width: 24,
    height: 24,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'FamiljenGrotesk-Medium',
    color: '#000',
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
  productPrice: {
    fontSize: 16,
    fontFamily: 'FamiljenGrotesk-Bold',
    color: '#000',
    textAlign: 'center',
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
