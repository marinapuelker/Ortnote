import React from 'react';

import {
  StyleSheet, Text, View, TextInput,} from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>

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