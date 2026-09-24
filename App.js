import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';

import Login from './screens/Login';
import FolderScreen from './screens/FolderScreen';
import HomeScreen from './screens/HomeScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ProfileScreen from './screens/ProfileScreen';
import PerfilScreen from './screens/PerfilScreen';
import TopHeader from './components/TopHeader';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Login"
        backBehavior="history"
        tabBar={(props) =>
          props.state.routes[props.state.index].name === 'Login'
            ? null
            : <BottomTabBar {...props} />
        }
        screenOptions={({ route, navigation }) => ({
          headerShown: true,
          header: () => <TopHeader navigation={navigation} />,

          tabBarActiveTintColor: '#BC72DE',
          tabBarInactiveTintColor: '#888',

          
          tabBarShowLabel: false,

          tabBarStyle: {
           
            width: '100%',
            left: 0,
            right: 0,
            paddingHorizontal: 0,
            
            backgroundColor: '#FFB74D',

            height: 65,
            paddingBottom: 8,
            paddingTop: 8,
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
                size={30}
                color={color}
              />
            );
          },
        })}
      >

        <Tab.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
            tabBarButton: () => null,
            tabBarItemStyle: { flex: 0 },
          }}
        />

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

        <Tab.Screen
          name="Perfil"
          component={PerfilScreen}
          options={{
            headerShown: false,
            tabBarButton: () => null,
            tabBarItemStyle: { flex: 0 },
          }}
        />

      </Tab.Navigator>
    </NavigationContainer>
  );
}