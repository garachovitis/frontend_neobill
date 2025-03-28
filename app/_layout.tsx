import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { setupDatabase } from '@/scripts/database.old';
import {database} from "@/scripts/database";

// setupDatabase();

const test = database.get('categories');
console.log(test);

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerStyle: { backgroundColor: '#3b8193' }, headerTintColor: '#fff', headerTitleStyle: { fontSize: 20 } }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{
          title: 'Η Σελίδα Δεν Βρέθηκε',
          headerBackTitle: 'Πίσω',
          headerTitleStyle: { fontSize: 20 }
        }} />
        <Stack.Screen name="saved" options={{
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
