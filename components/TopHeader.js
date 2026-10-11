import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Text, Animated, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Logo from '../screens/logo2.png';
import { sair } from '../services/auth';

const { width, height } = Dimensions.get('window');
const MENU_WIDTH = width * 0.75; // Largura do menu lateral

export default function TopHeader({ navigation }) {
  const insets = useSafeAreaInsets();
  const [menuAberto, setMenuAberto] = useState(false);
  const slideAnim = useRef(new Animated.Value(MENU_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  function abrirMenu() {
    setMenuAberto(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300, 
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }

  function fecharMenu() {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: MENU_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setMenuAberto(false);
    });
  }

  return (
    <>
      <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
        <View style={styles.logoContainer}>
          <Image source={Logo} style={styles.logo} resizeMode="contain" />
        </View>

        <TouchableOpacity onPress={abrirMenu}>
          <Ionicons name="person-circle" size={38} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      {menuAberto && (
        <View style={styles.overlayContainer}>
          <TouchableWithoutFeedback onPress={fecharMenu}>
            <Animated.View 
              style={[
                styles.fundoEscuro, 
                { opacity: fadeAnim }
              ]} 
            />
          </TouchableWithoutFeedback>

          <Animated.View 
            style={[
              styles.menuLateral, 
              { transform: [{ translateX: slideAnim }] }
            ]}
          >
            <View style={styles.perfilTopo}>
              <View style={styles.avatarCirculo}>
                <Ionicons name="person" size={50} color="#777777" />
              </View>
            </View>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => { fecharMenu(); navigation.navigate('Perfil'); }}
            >
              <Ionicons name="person-outline" size={22} color="#000000" />
              <Text style={styles.menuTexto}>Meu perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => { fecharMenu(); navigation.navigate('Configuracoes'); }}
            >
              <Ionicons name="settings-outline" size={22} color="#000000" />
              <Text style={styles.menuTexto}>Configurações</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItemSair} 
              onPress={async () => { fecharMenu(); await sair(); navigation.navigate('Login'); }}
            >
              <Ionicons name="log-out-outline" size={22} color="#000000" />
              <Text style={styles.menuTexto}>Sair</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#BC72DE',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10, 
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    zIndex: 10,
  },
  logoContainer: {
    height: 48, 
    justifyContent: 'center',
  },
  logo: {
    height: '100%', 
    width: 150,     
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: height,
    zIndex: 99,
    flexDirection: 'row',
  },
  fundoEscuro: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  menuLateral: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: MENU_WIDTH,
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderBottomLeftRadius: 32,
    paddingTop: 70,
    paddingHorizontal: 24,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: -5, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  perfilTopo: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  avatarCirculo: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    backgroundColor: '#EAEAEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 14,
  },
  menuItemSair: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 14,
    marginTop: 5,
  },
  menuTexto: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8c06da',
  },
});