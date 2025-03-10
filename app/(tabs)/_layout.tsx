import React from 'react';
import { Image, Pressable, Platform } from 'react-native';
import { Tabs, router } from 'expo-router';
import Colors from '@/constants/Colors.ts';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import HomeIcon from '@/assets/images/Home.png';
import CalendarIcon from '@/assets/images/calend.png';
import SettingsIcon from '@/assets/images/set.png';
import CategoriesIcon from '@/assets/images/categ.png';
import logo from '@/assets/images/logo.png';
import savedIcon from '@/assets/images/saved.png';
import { Title } from 'react-native-paper';
import App from './calendar';
import Index from '@/app/(tabs)/index';
import SavedBills from '@/app/saved';

function TabBarIcon({ source, color }: { source: any; color?: string }) {
  return <Image source={source} style={{ width: 28, height: 28, tintColor: color }} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3b8193',
        tabBarStyle: { 
          height: 100,
          paddingBottom: 20,
          paddingTop: 15,
        },
        tabBarLabelStyle: {
          marginTop: 10,
          fontSize: 14,
        },
        headerShown: useClientOnlyValue(false, true),
        headerTitleAlign: 'center', 
        headerTitleStyle: { fontSize: 20 },
        headerStyle: {
          height: Platform.OS === 'ios' ? 120 : 90,
          backgroundColor: '#fff',
        },
        headerLeft: () => (
            <Pressable
            onPress={() => {
              router.push(Index);
            }}
            style={{ padding: 10, marginLeft: 10 }}
            >
            <Image
              source={logo}
              style={{ width: 65, height: 65, resizeMode: 'contain' }}
            />
            </Pressable>
        ),
        headerRight: () => (
          <Pressable
            onPress={() => {
              router.push('/saved'); 
            }}
            style={{ padding: 10, marginRight: 10 }}
          >
            <Image
              source={savedIcon}
              style={{ width: 45, height: 45, resizeMode: 'contain' }}
            />
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Aρχική',
          tabBarIcon: ({ color }) => <TabBarIcon source={HomeIcon} color={color} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Κατηγορίες',
          tabBarIcon: ({ color }) => <TabBarIcon source={CategoriesIcon} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Ημερολόγιο',
          tabBarIcon: ({ color }) => <TabBarIcon source={CalendarIcon} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ρυθμίσεις',
          tabBarIcon: ({ color }) => <TabBarIcon source={SettingsIcon} color={color} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Εξοφλημενοι',
          tabBarIcon: ({ color }) => <TabBarIcon source={savedIcon} color={color} />,
        }}
      />
    </Tabs>
  );
}
