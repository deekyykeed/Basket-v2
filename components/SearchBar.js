import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MicrophoneIcon } from '../lib/icons';

const SearchBar = ({ value, onChangeText, placeholder = "Search..." }) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor="rgba(0, 0, 0, 0.4)"
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.micButton}>
          <MicrophoneIcon size={18} color="#999" strokeWidth={1.5} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  searchBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    overflow: 'hidden',
    gap: 10,
    borderBottomWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'FamiljenGrotesk-Medium',
    fontWeight: '500',
    color: '#000',
    paddingVertical: 0,
  },
  micButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchBar;

