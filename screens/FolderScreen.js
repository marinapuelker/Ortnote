import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import HolidayCalendar from '../components/HolidayCalendar';

export default function FolderScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >

      <HolidayCalendar />

      <View style={styles.pastaArea}>
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

    </ScrollView>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,

    backgroundColor: '#ffff',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  pastaArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
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