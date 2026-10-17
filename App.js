import React, { useEffect, useState } from 'react';
import {ActivityIndicator, View, TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator, BottomTabBar} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from './firebase';
import Login from './screens/Login';
import FolderScreen from './screens/FolderScreen';
import HomeScreen from './screens/HomeScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ProfileScreen from './screens/ProfileScreen';
import PerfilScreen from './screens/PerfilScreen';
import TopHeader from './components/TopHeader';
import NovoPost from './screens/NovoPost';

const Tab = createBottomTabNavigator();

export default function App() {
  const [verificando, setVerificando] = useState(true);
  const [logado, setLogado] = useState(false);

  useEffect(() => {
    const cancelar = onAuthStateChanged(auth, (user) => {
      setLogado(!!user && user.emailVerified);
      setVerificando(false);
    });
    return cancelar;
  }, []);

  if (verificando) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffda73'}}>
        <ActivityIndicator size="large" color="#8607cf" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        key={logado ? 'app' : 'auth'}
        initialRouteName={logado ? 'Home' : 'Login'}
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
            width: '100%',
            left: 0,                             
            borderRadius: 70,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
            marginBottom: 40,
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
          name="NovoPost"
          component={NovoPost}
          options={{
            tabBarButton: (props) => (
              <TouchableOpacity
                onPress={props.onPress}
                activeOpacity={0.8}
                style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: '#9e2ad3',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="add" size={30} color="#fff" />
                </View>
              </TouchableOpacity>
            ),
          }}
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
            tabBarStyle: { display: 'none' }
          }}
        />

      </Tab.Navigator>
    </NavigationContainer>
  );
}