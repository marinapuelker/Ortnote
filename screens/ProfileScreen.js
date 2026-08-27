import React from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>

      <Ionicons
        name="person-circle"
        size={100}
        color="#BC72DE"
      />

      <Text style={styles.title}>
        Profile
      </Text>

      <Text style={styles.subtitle}>
        Seu perfil
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