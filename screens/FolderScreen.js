import React from 'react';
import {StyleSheet, Text, View, ScrollView,} from 'react-native';
import HolidayCalendar from '../components/HolidayCalendar';

export default function FolderScreen() {
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >

      <HolidayCalendar/>
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