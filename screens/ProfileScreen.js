import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { signOut } from '../lib/auth';
import { useAuth } from '../context/AuthContext';
import { useBasket } from '../context/BasketContext';
import { CheckmarkIcon } from '../lib/icons';
import AuthSheet from '../components/AuthSheet';

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const { user, setUser } = useAuth();
  const { total } = useBasket();
  const authSheetRef = useRef(null);

  const handleSignOut = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await signOut();
    setUser(null);
  };

  const handleSignIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    authSheetRef.current?.snapToIndex(0);
  };

  if (!user) {
    return (
      <>
        <View style={[styles.container, { paddingTop: insets.top + 14 }]}>
          <Text style={styles.title}>Profile</Text>
          <View style={styles.signedOutContainer}>
            <Text style={styles.signedOutIcon}>👤</Text>
            <Text style={styles.signedOutTitle}>Sign in to your account</Text>
            <Text style={styles.signedOutMessage}>
              Save your baskets, track orders, and get personalized recommendations.
            </Text>
            <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
        <AuthSheet
          ref={authSheetRef}
          onAuthSuccess={(newUser) => setUser(newUser)}
          onClose={() => {}}
        />
      </>
    );
  }

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

  return (
    <View style={[styles.container, { paddingTop: insets.top + 14 }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profile</Text>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.verifiedBadge}>
            <CheckmarkIcon size={14} color="#22c55e" strokeWidth={2} />
            <Text style={styles.verifiedText}>Verified Account</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>${total.toFixed(0)}</Text>
            <Text style={styles.statLabel}>In Basket</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
        </View>

        {/* Account Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          <MenuItem icon="📍" label="Delivery Addresses" />
          <MenuItem icon="📦" label="Order History" />
          <MenuItem icon="💳" label="Payment Methods" />
          <MenuItem icon="❤️" label="Favorites" />
        </View>

        {/* Settings Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <MenuItem icon="🔔" label="Notifications" />
          <MenuItem icon="🔒" label="Privacy & Security" />
          <MenuItem icon="❓" label="Help & Support" />
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const MenuItem = ({ icon, label }) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
    activeOpacity={0.7}
  >
    <View style={styles.menuItemLeft}>
      <Text style={styles.menuItemIcon}>{icon}</Text>
      <Text style={styles.menuItemText}>{label}</Text>
    </View>
    <Text style={styles.menuItemArrow}>›</Text>
  </TouchableOpacity>
);

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
  // Signed out state
  signedOutContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  signedOutIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  signedOutTitle: {
    fontSize: 20,
    fontFamily: 'FamiljenGrotesk-Bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  signedOutMessage: {
    fontSize: 14,
    fontFamily: 'FamiljenGrotesk-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  signInButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
  },
  signInButtonText: {
    fontSize: 16,
    fontFamily: 'FamiljenGrotesk-Bold',
    color: '#fff',
  },
  // Profile header
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#d97655',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontFamily: 'FamiljenGrotesk-Bold',
    color: '#fff',
  },
  name: {
    fontSize: 24,
    fontFamily: 'FamiljenGrotesk-Bold',
    color: '#000',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    fontFamily: 'FamiljenGrotesk-Regular',
    color: '#666',
    marginBottom: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    fontFamily: 'FamiljenGrotesk-SemiBold',
    color: '#22c55e',
  },
  // Stats
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9e6dc',
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'FamiljenGrotesk-Bold',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'FamiljenGrotesk-Medium',
    color: '#666',
  },
  // Menu
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'FamiljenGrotesk-Bold',
    color: '#000',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9e6dc',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemIcon: {
    fontSize: 20,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'FamiljenGrotesk-Medium',
    color: '#000',
  },
  menuItemArrow: {
    fontSize: 24,
    fontFamily: 'FamiljenGrotesk-Regular',
    color: '#999',
  },
  // Sign out
  signOutButton: {
    backgroundColor: '#fee',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
  signOutButtonText: {
    fontSize: 16,
    fontFamily: 'FamiljenGrotesk-Bold',
    color: '#c00',
  },
});

export default ProfileScreen;
