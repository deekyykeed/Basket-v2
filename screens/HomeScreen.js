import React, { useEffect, useState, useRef, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { filterProducts } from '../lib/basketUtils';
import { useBasket } from '../context/BasketContext';
import { useTheme } from '../context/ThemeContext';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import ProductGrid from '../components/ProductGrid';
import ProductDetailsSheet from '../components/ProductDetailsSheet';
import Basket from '../components/Basket';
import * as Haptics from 'expo-haptics';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const bottomSheetRef = useRef(null);
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const { basketProducts, addToBasket, decreaseQuantity, removeFromBasket, total } = useBasket();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*, store:stores(name, slug)')
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error.message);
        setProducts([]);
        throw error;
      }
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(
    () => filterProducts(products, searchQuery, activeCategory),
    [products, searchQuery, activeCategory]
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchProducts();
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleProductLongPress = (product) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setSelectedProduct(product);
    bottomSheetRef.current?.snapToIndex(0);
  };

  return (
    <>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 14, backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
          <View style={styles.searchBarWrapper}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              totalPrice={total}
            />
          </View>
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryPress={setActiveCategory}
          />
        </View>

        {/* Product Grid */}
        <View style={[styles.body, { backgroundColor: theme.surface }]}>
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
            basketProducts={basketProducts}
            sectionTitle="Fresh Finds"
          />
        </View>

        {/* Floating Basket */}
        <Basket
          theme={theme}
          basketProducts={basketProducts}
          onDecreaseQuantity={decreaseQuantity}
          onRemoveFromBasket={removeFromBasket}
          totalPrice={total}
        />
      </View>

      {/* Product Details Sheet */}
      <ProductDetailsSheet
        ref={bottomSheetRef}
        product={selectedProduct}
        onAddToBasket={addToBasket}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    zIndex: 1,
    gap: 14,
    borderBottomWidth: 2,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    flex: 1,
  },
});

export default HomeScreen;
