import React from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>

      <Ionicons
        name="notifications"
        size={70}
        color="#BC72DE"
      />

      <Text style={styles.title}>
        Notifications
      </Text>

      <Text style={styles.subtitle}>
        Você não possui novas notificações.
      </Text>

    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#DDDDDD',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',

    marginTop: 15,
  },

  subtitle: {
    fontSize: 16,
    color: '#666',

    marginTop: 5,
  },

});