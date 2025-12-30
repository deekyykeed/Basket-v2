import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import MicIcon from '../assets/icons/search/Mic-Line--Streamline-Mingcute.svg';
import SearchIconSvg from '../assets/icons/search/Search-2-Fill--Streamline-Mingcute-Fill (1).svg';

const SearchBar = ({ value, onChangeText, placeholder = "Search...", totalPrice = 0 }) => {
  const formatPrice = (price) => {
    if (price >= 1000) {
      return (price / 1000).toFixed(1) + 'k';
    }
    return price.toFixed(1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <View style={styles.searchIconContainer}>
          <SearchIconSvg width={20} height={20} />
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor="hsl(0, 0.00%, 0.00%)"
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          numberOfLines={1}
        />
        <TouchableOpacity style={styles.micButton}>
          <MicIcon width={20} height={20} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.basketButton}>
        <Text style={styles.basketButtonText}>
          {formatPrice(totalPrice)}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: '#fafafa',
    overflow: 'hidden',
    gap: 10,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  searchIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Rubik-Bold',
    fontStyle: 'normal',
    color: '#000000',
    letterSpacing: 0,
    textAlign: 'left',
    lineHeight: 19.2,
    paddingVertical: 0,
  },
  micButton: {
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  basketButton: {
    width: 40,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#d97655',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
    backgroundColor: '#d97655',
    overflow: 'visible',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  basketButtonText: {
    fontSize: 16,
    fontFamily: 'Fortnite',
    fontWeight: '400',
    fontStyle: 'normal',
    color: '#ffffff',
    letterSpacing: 0,
    lineHeight: 19.2,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    includeFontPadding: false,
  },
});

export default SearchBar;

