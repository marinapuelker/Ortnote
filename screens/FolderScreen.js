import React from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default function FolderScreen() {
  return (
    <View style={styles.container}>

      <Ionicons
        name="folder"
        size={70}
        color="#BC72DE"
      />

      <Text style={styles.title}>
        Folder
      </Text>

      <Text style={styles.subtitle}>
        Seus arquivos aparecerão aqui.
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