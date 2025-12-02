import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, useColorScheme, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { themes } from './theme';

// Keep the splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

// Mock data - will be replaced with Supabase data later
const CATEGORIES = [
  { id: 1, name: 'Grocery', icon: '🛒' },
  { id: 2, name: 'Restaurants', icon: '🍴' },
  { id: 3, name: 'Alcohol', icon: '🍷' },
  { id: 4, name: 'Express', icon: '🚚' },
  { id: 5, name: 'Retail', icon: '🏪' },
];

const MOCK_PRODUCTS = [
  { id: 1, name: 'Tomato', price: 15.88, quantity: 'x5', image: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400' },
  { id: 2, name: 'Lettuce', price: 15.88, quantity: '', image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400' },
  { id: 3, name: 'Banana', price: 15.88, quantity: 'Bunch of 5', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400' },
  { id: 4, name: 'Broccoli', price: 15.88, quantity: '', image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400' },
  { id: 5, name: 'Grapes', price: 15.88, quantity: '', image: 'https://images.unsplash.com/photo-1599819177818-8c1e8c9f7a2e?w=400' },
  { id: 6, name: 'Mango', price: 15.88, quantity: '', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400' },
  { id: 7, name: 'Watermelon', price: 15.88, quantity: '', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784210?w=400' },
  { id: 8, name: 'Apple', price: 15.88, quantity: 'x5', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400' },
  { id: 9, name: 'Apple', price: 15.88, quantity: 'x5', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400' },
  { id: 10, name: 'Apple', price: 15.88, quantity: 'x5', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400' },
  { id: 11, name: 'Apple', price: 15.88, quantity: 'x5', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400' },
  { id: 12, name: 'Apple', price: 15.88, quantity: 'x5', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400' },
];

export default function App() {
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
              <Text style={styles.iconText}>😊</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Text style={styles.iconText}>📋</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          {CATEGORIES.map((category) => (
            <TouchableOpacity key={category.id} style={styles.categoryButton}>
              <View style={styles.categoryIconContainer}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
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

          {/* Product Grid */}
          <View style={styles.productGrid}>
            {MOCK_PRODUCTS.map((product) => (
              <TouchableOpacity key={product.id} style={styles.productCard}>
                {product.quantity && (
                  <View style={styles.quantityBadge}>
                    <Text style={styles.quantityText}>{product.quantity}</Text>
                  </View>
                )}
                <Image
                  source={{ uri: product.image }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
                <Text style={[styles.productPrice, { color: theme.text }]}>{product.price}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 24,
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
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f0ede7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 32,
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
});
