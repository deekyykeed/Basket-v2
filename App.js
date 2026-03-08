import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, useColorScheme } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { BasketProvider, useBasket } from './context/BasketContext';
import { AuthProvider } from './context/AuthContext';
import BottomTabBar from './components/BottomTabBar';
import HomeScreen from './screens/HomeScreen';
import OrdersScreen from './screens/OrdersScreen';
import ProfileScreen from './screens/ProfileScreen';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'FamiljenGrotesk-Regular': require('./assets/fonts/FamiljenGrotesk/FamiljenGrotesk-Regular.otf'),
    'FamiljenGrotesk-Medium': require('./assets/fonts/FamiljenGrotesk/FamiljenGrotesk-Medium.otf'),
    'FamiljenGrotesk-SemiBold': require('./assets/fonts/FamiljenGrotesk/FamiljenGrotesk-SemiBold.otf'),
    'FamiljenGrotesk-Bold': require('./assets/fonts/FamiljenGrotesk/FamiljenGrotesk-Bold.otf'),
    'FamiljenGrotesk-Italic': require('./assets/fonts/FamiljenGrotesk/FamiljenGrotesk-Italic.otf'),
    'Rubik-Regular': require('./assets/fonts/Rubik/Rubik-VariableFont_wght.ttf'),
    'Rubik-Italic': require('./assets/fonts/Rubik/Rubik-Italic-VariableFont_wght.ttf'),
    'Fortnite': require('./assets/fonts/Fortnite.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <AuthProvider>
          <BasketProvider>
            <AppShell />
          </BasketProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function AppShell() {
  const [activeTab, setActiveTab] = useState('home');
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { basketProducts } = useBasket();

  return (
    <View style={styles.root}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      {/* Screen content */}
      <View style={styles.screenContainer}>
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'orders' && <OrdersScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </View>

      {/* Bottom tab bar */}
      <View style={{ paddingBottom: insets.bottom }}>
        <BottomTabBar
          activeTab={activeTab}
          onTabPress={setActiveTab}
          basketCount={basketProducts.length}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fbf9f5',
  },
  screenContainer: {
    flex: 1,
  },
});
