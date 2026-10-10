import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Post({ post, onLike }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle" size={36} color="#BC72DE" />
        <Text style={styles.username}>{post.username}</Text>
      </View>

      <Image source={{ uri: post.imageUrl }} style={styles.image} />

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onLike?.(post)}>
          <Ionicons name="heart-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <Text style={styles.likes}>{post.likesCount} curtidas</Text>
      <Text style={styles.caption}>
        <Text style={styles.username}>{post.username} </Text>
        {post.caption}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 10, gap: 8 },
  username: { fontWeight: '600' },
  image: { width, height: width },
  actions: { flexDirection: 'row', padding: 10 },
  likes: { paddingHorizontal: 10, fontWeight: '600' },
  caption: { paddingHorizontal: 10, marginTop: 4 },
});