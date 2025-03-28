import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';


import { setupDatabase } from '@/scripts/database';
import { registerBackgroundTask } from '@/scripts/autoScrape';

export const startApp = async () => {
    console.log('Starting app...');
  
    await setupDatabase();
    await registerBackgroundTask();
  
    console.log('App started!');
  };
  
startApp();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({});

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    console.log('🚀 Database setup');
    setupDatabase();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerStyle: { backgroundColor: '#3b8193' }, headerTintColor: '#fff', headerTitleStyle: { fontSize: 20 } }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{
          title: 'Η Σελίδα Δεν Βρέθηκε',
          headerBackTitle: 'Πίσω',
          headerTitleStyle: { fontSize: 20 }
        }} />
        <Stack.Screen name="@/saved/saved" options={{
          title: 'Εξοφλημένοι',
          headerBackTitle: 'Πίσω',
          headerStyle: { backgroundColor: '#3b8193' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontSize: 20 }
        }} />
      </Stack>
    </ThemeProvider>
  );
}
