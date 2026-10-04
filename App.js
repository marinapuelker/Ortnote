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
        initialRouteName='Login'
        backBehavior="history"
        tabBar={(props) =>
          props.state.routes[props.state.index].name === 'Login'
            ? null
            : <BottomTabBar {...props} />
        }
        screenOptions={({ route, navigation }) => ({
          headerShown: true,
          header: () => <TopHeader navigation={navigation} />,

          tabBarActiveTintColor: '#9e2ad3',
          tabBarInactiveTintColor: '#a5a5a5',
          tabBarShowLabel: false,

          tabBarStyle: {
            position: 'absolute',       
            backgroundColor: '#ffb84d', 
            borderTopWidth: 0,          
            elevation: 0,              
            shadowColor: 'transparent', 
            width: '90%',
            left: 25,                   
            borderRadius: 70,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
            marginBottom: 20,
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