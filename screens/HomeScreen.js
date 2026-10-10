import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import Post from '../components/Post';

const POSTS_FALSOS = [1, 2, 3, 4, 5].map((n) => ({
  id: String(n),
  username: `usuario${n}`,
  imageUrl: `https://picsum.photos/seed/${n}/600`,
  caption: `Post de teste ${n}`,
  likesCount: n * 3,
}));

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={POSTS_FALSOS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Post post={item} />}
        contentContainerStyle={{ paddingBottom: 110 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});