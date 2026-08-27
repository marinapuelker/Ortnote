import React from 'react';

import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  TextInput,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>

        <Text style={styles.title}>
          Home
        </Text>

        <Ionicons
          name="person-circle"
          size={45}
          color="#FFFFFF"
        />

      </View>


      {/* CONTEÚDO */}
      <View style={styles.content}>

        <Text style={styles.welcome}>
          Olá! 👋
        </Text>

        <Text style={styles.subtitle}>
          O que você está procurando?
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Digite alguma coisa..."
          placeholderTextColor="#888"
        />

      </View>

    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#DDDDDD',
  },

  header: {
    width: '100%',
    height: Dimensions.get('window').height * 0.1,

    backgroundColor: '#BC72DE',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 20,

    elevation: 5,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },

  content: {
    flex: 1,

    width: '100%',

    paddingHorizontal: 20,
    paddingTop: 30,
  },

  welcome: {
    fontSize: 28,
    fontWeight: 'bold',

    marginBottom: 5,
  },

  subtitle: {
    fontSize: 16,
    color: '#555',

    marginBottom: 20,
  },

  input: {
    width: '100%',
    height: 50,

    backgroundColor: '#FFFFFF',

    borderRadius: 10,

    paddingHorizontal: 15,

    fontSize: 16,
  },

});