import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { CATEGORY_ICONS } from '../lib/icons';

const CATEGORIES = [
  { id: 'produce', name: 'Farm', icon: '🥕', slug: 'produce' },
  { id: 'restaurants', name: 'Meals', icon: '🍴', slug: 'restaurants' },
  { id: 'drinks', name: 'Drinks', icon: '🍷', slug: 'drinks' },
  { id: 'snacks', name: 'Express', icon: '🥫', slug: 'snacks' },
  { id: 'retail', name: 'Retail', icon: '🛍️', slug: 'retail' },
];

const CategoryFilter = ({ activeCategory, onCategoryPress }) => {
  const handlePress = (categoryId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCategoryPress(activeCategory === categoryId ? null : categoryId);
  };

  return (
    <View style={styles.container}>
      {CATEGORIES.map((category) => {
        const IconComponent = CATEGORY_ICONS[category.icon];
        const isActive = activeCategory === category.id;
        
        return (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryButton}
            onPress={() => handlePress(category.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
              <View style={styles.iconWrapper}>
                {IconComponent ? (
                  <View style={isActive && styles.iconShadow}>
                    <IconComponent
                      isActive={isActive}
                      size={20}
                      color={isActive ? '#fff' : '#000'}
                    />
                  </View>
                ) : (
                  <Text style={styles.fallbackIcon}>{category.icon || '📦'}</Text>
                )}
              </View>
            </View>
            <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  categoryButton: {
    alignItems: 'center',
    gap: 4,
  },
  iconContainer: {
    width: 42,
    height: 42,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 10,
    backgroundColor: '#fafafa',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  iconContainerActive: {
    backgroundColor: '#d97655',
    shadowColor: '#d97655',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  iconWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 2,
  },
  fallbackIcon: {
    fontSize: 20,
  },
  categoryText: {
    fontFamily: 'FamiljenGrotesk-Medium',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
    textAlign: 'center',
  },
  categoryTextActive: {
    color: '#000000',
  },
});

export default CategoryFilter;