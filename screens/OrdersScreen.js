import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useBasket } from '../context/BasketContext';

const OrdersScreen = () => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { basketProducts, total } = useBasket();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 14 }]}>
      <Text style={styles.title}>Orders</Text>

      {basketProducts.length > 0 ? (
        <View style={styles.pendingOrder}>
          <Text style={styles.pendingLabel}>Current Basket</Text>
          <View style={styles.orderCard}>
            <Text style={styles.orderItemCount}>
              {basketProducts.length} {basketProducts.length === 1 ? 'item' : 'items'}
            </Text>
            <Text style={styles.orderTotal}>${total.toFixed(2)}</Text>
          </View>
          <View style={styles.itemsList}>
            {basketProducts.map((product) => (
              <View key={product.id} style={styles.itemRow}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {product.name}
                </Text>
                <Text style={styles.itemQty}>x{product.quantity}</Text>
                <Text style={styles.itemPrice}>
                  ${(parseFloat(product.price) * product.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {/* Past orders placeholder */}
      <View style={styles.emptySection}>
        <Text style={styles.emptyIcon}>📦</Text>
        <Text style={styles.emptyTitle}>
          {user ? 'No past orders yet' : 'Sign in to see your orders'}
        </Text>
        <Text style={styles.emptyMessage}>
          {user
            ? 'Your order history will appear here after your first delivery.'
            : 'Create an account to track deliveries and reorder favorites.'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf9f5',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'FamiljenGrotesk-Bold',
    color: '#000',
    marginBottom: 24,
  },
  pendingOrder: {
    marginBottom: 24,
  },
  pendingLabel: {
    fontSize: 14,
    fontFamily: 'FamiljenGrotesk-SemiBold',
    color: '#d97655',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  orderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9e6dc',
    marginBottom: 8,
  },
  orderItemCount: {
    fontSize: 16,
    fontFamily: 'FamiljenGrotesk-Medium',
    color: '#000',
  },
  orderTotal: {
    fontSize: 20,
    fontFamily: 'FamiljenGrotesk-Bold',
    color: '#000',
  },
  itemsList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e9e6dc',
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'FamiljenGrotesk-Regular',
    color: '#000',
  },
  itemQty: {
    fontSize: 14,
    fontFamily: 'FamiljenGrotesk-Medium',
    color: '#666',
    width: 30,
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: 'FamiljenGrotesk-SemiBold',
    color: '#000',
    width: 60,
    textAlign: 'right',
  },
  emptySection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    fontFamily: 'FamiljenGrotesk-Regular',
    color: '#666',
    textAlign: 'center',
  },
});

export default OrdersScreen;
