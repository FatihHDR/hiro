import { Tabs } from 'expo-router';
import React from 'react';
import { BottomMenuBar } from '../../components/ui/bottom-menu';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomMenuBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'War Room',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Missions',
        }}
      />
      <Tabs.Screen
        name="raids"
        options={{
          title: 'Guild Raids',
        }}
      />
      <Tabs.Screen
        name="vault"
        options={{
          title: 'Vault & Shop',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
