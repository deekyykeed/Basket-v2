import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { themes } from './theme';

// Keep the splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

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
        <View style={styles.topContainer}>
          <View style={styles.topHeader}>
            <View style={styles.actionBar}>
              <View style={styles.searchBar}>
                {/* Search bar content will go here */}
              </View>
            </View>
          </View>
          <View style={styles.categories}>
            {/* Categories content will go here */}
          </View>
        </View>
        <View style={[styles.card, {
          backgroundColor: theme.card,
          shadowColor: '#000',
        }]}>
          <Text style={[styles.cardText, { color: theme.text }]}>Welcome to Basket v2!</Text>
        </View>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
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
  topContainer: {
    width: '100%',
    display: 'flex',
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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    overflow: 'visible',
    alignContent: 'center',
    flexWrap: 'nowrap',
    gap: 8,
    borderRadius: 0,
  },
  actionBar: {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
    padding: 0,
    alignContent: 'center',
    flexWrap: 'nowrap',
    gap: 9,
    borderRadius: 0,
  },
  searchBar: {
    flex: 1,
    width: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    alignContent: 'center',
    flexWrap: 'nowrap',
    gap: 10,
    position: 'absolute',
    borderRadius: 20,
    borderWidth: 0,
    borderColor: 'rgba(34, 34, 34, 0.1)',
  },
  categories: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 0,
    overflow: 'hidden',
    alignContent: 'center',
    flexWrap: 'nowrap',
    borderRadius: 0,
  },
  card: {
    position: 'absolute',
    bottom: 32,
    left: '3%',
    right: '3%',
    width: '94%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    padding: 12,
    overflow: 'hidden',
    zIndex: 1,
    flexWrap: 'nowrap',
    gap: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    // Shadow for iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    // Shadow for Android
    elevation: 8,
  },
  cardText: {
    fontSize: 16,
    fontFamily: 'FamiljenGrotesk-Medium',
  },
});
