import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';

import FolderScreen from './screens/FolderScreen';
import HomeScreen from './screens/HomeScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,

          tabBarActiveTintColor: '#BC72DE',
          tabBarInactiveTintColor: '#888',

          tabBarStyle: {
            height: 65,
            paddingBottom: 8,
            paddingTop: 8,
          },

          tabBarLabelStyle: {
            fontSize: 12,
          },

          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Folder') {
              iconName = 'folder-outline';
            } else if (route.name === 'Home') {
              iconName = 'home-outline';
            } else if (route.name === 'Notifications') {
              iconName = 'notifications-outline';
            } else if (route.name === 'Profile') {
              iconName = 'person-outline';
            }

            return (
              <Ionicons
                name={iconName}
                size={size}
                color={color}
              />
            );
          },
        })}
      >

        <Tab.Screen
          name="Folder"
          component={FolderScreen}
        />

        <Tab.Screen
          name="Home"
          component={HomeScreen}
        />

        <Tab.Screen
          name="Notifications"
          component={NotificationsScreen}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
        />

      </Tab.Navigator>
    </NavigationContainer>
  );
}