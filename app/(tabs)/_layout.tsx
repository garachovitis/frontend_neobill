import React from 'react';
import { Image, Pressable, Platform } from 'react-native';
import { Tabs, router } from 'expo-router';
import { NavigationContainer } from '@react-navigation/native';

// Images must be imported through require()
const HomeIcon = require('@/assets/images/Home.png');
const CalendarIcon = require('@/assets/images/calend.png');
const SettingsIcon = require('@/assets/images/set.png');
const CategoriesIcon = require('@/assets/images/categ.png');
const logo = require('@/assets/images/logo.png');
const savedIcon = require('@/assets/images/saved.png');

function TabBarIcon({ source, color }: { source: any; color?: string }) {
  return <Image source={source} style={{ width: 28, height: 28, tintColor: color }} />;
}

export default function TabLayout() {

  return (
    <NavigationContainer>
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
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 20 },
          headerStyle: {
            height: Platform.OS === 'ios' ? 120 : 90,
            backgroundColor: '#fff',
          },
          headerLeft: () => (
            <Pressable
              onPress={() => {
                router.replace('/'); 
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
          name="(home)"
          options={{
            title: 'Aρχική',
            tabBarIcon: ({ color }) => <TabBarIcon source={HomeIcon} color={color} />,
          }}
        />
        <Tabs.Screen
          name="(categories)"
          options={{
            title: 'Κατηγορίες',
            tabBarIcon: ({ color }) => <TabBarIcon source={CategoriesIcon} color={color} />,
          }}
        />
        <Tabs.Screen
          name="(calendar)"
          options={{
            title: 'Ημερολόγιο',
            tabBarIcon: ({ color }) => <TabBarIcon source={CalendarIcon} color={color} />,
          }}
        />
        <Tabs.Screen
          name="(settings)"
          options={{
            title: 'Ρυθμίσεις',
            tabBarIcon: ({ color }) => <TabBarIcon source={SettingsIcon} color={color} />,
          }}
        />
        <Tabs.Screen
          name="saved"
          options={{
            title: 'Εξοφλημένοι',
            tabBarIcon: ({ color }) => <TabBarIcon source={savedIcon} color={color} />,
          }}
        />
      </Tabs>
    </NavigationContainer>
  );
}