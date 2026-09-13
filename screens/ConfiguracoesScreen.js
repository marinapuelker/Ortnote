import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ConfiguracoesScreen() {
  return (
    <View style={styles.container}>

      {/* MENU DE CONFIG */}
      <View style={styles.menuHeader}>
        <Ionicons name="settings-outline" size={26} color="#BC72DE" />
        <Text style={styles.title}>Configurações</Text>
      </View>

      {/* OPÇOES */}
      <View style={styles.menuList}>

        <View style={styles.menuItem}>
          <Ionicons name="person-outline" size={20} color="#BC72DE" />
          <Text style={styles.menuItemText}>Perfil</Text>
          <Ionicons name="chevron-forward" size={18} color="#888" />
        </View>

        <View style={styles.menuItem}>
          <Ionicons name="notifications-outline" size={20} color="#BC72DE" />
          <Text style={styles.menuItemText}>Notificações</Text>
          <Ionicons name="chevron-forward" size={18} color="#888" />
        </View>

        <View style={styles.menuItem}>
          <Ionicons name="lock-closed-outline" size={20} color="#BC72DE" />
          <Text style={styles.menuItemText}>Privacidade</Text>
          <Ionicons name="chevron-forward" size={18} color="#888" />
        </View>

        <View style={styles.menuItem}>
          <Ionicons name="information-circle-outline" size={20} color="#BC72DE" />
          <Text style={styles.menuItemText}>Sobre</Text>
          <Ionicons name="chevron-forward" size={18} color="#888" />
        </View>

      </View>

      <Text style={styles.subtitle}>Em breve.</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DDDDDD',
    paddingHorizontal: 20,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  menuList: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 6,
    textAlign: 'center',
  },
});