import React from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Post({ post, onLike }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle" size={36} color="#BC72DE" />
        <Text style={styles.username}>{post.username}</Text>
      </View>

      <View style={styles.tags}>
        <Text style={[styles.tag, styles.tagMateria]}>{post.materia}</Text>
        <Text style={[styles.tag, styles.tagSerie]}>{post.serie}</Text>
      </View>

      {post.tipo === 'pdf' ? (
        <TouchableOpacity
          style={styles.pdf}
          onPress={() => Linking.openURL(post.arquivoUrl)}
        >
          <Ionicons name="document-text" size={56} color="#e53935" />
          <Text style={styles.pdfTexto}>Abrir PDF</Text>
        </TouchableOpacity>
      ) : (
        <Image source={{ uri: post.arquivoUrl }} style={styles.image} />
      )}

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onLike?.(post)}>
          <Ionicons name="heart-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <Text style={styles.likes}>{post.likesCount ?? 0} curtidas</Text>

      {!!post.descricao && (
        <Text style={styles.descricao}>
          <Text style={styles.username}>{post.username} </Text>
          {post.descricao}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 10, gap: 8 },
  username: { fontWeight: '600' },
  tags: { flexDirection: 'row', gap: 8, paddingHorizontal: 10, marginBottom: 8 },
  tag: {
    fontSize: 12,
    fontWeight: '700',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tagMateria: { backgroundColor: '#f6e9fc', color: '#9e2ad3' },
  tagSerie: { backgroundColor: '#fff1d6', color: '#a86400' },
  image: { width, height: width },
  pdf: {
    width,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fbf5fe',
    gap: 8,
  },
  pdfTexto: { color: '#9e2ad3', fontWeight: '700' },
  actions: { flexDirection: 'row', padding: 10 },
  likes: { paddingHorizontal: 10, fontWeight: '600' },
  descricao: { paddingHorizontal: 10, marginTop: 4 },
});