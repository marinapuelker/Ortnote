import React, { useState } from 'react';
import {
  View, Text, TextInput, Image, TouchableOpacity,
  StyleSheet, ScrollView, Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function NovoPostScreen({ navigation }) {
  const [imagem, setImagem] = useState(null);
  const [legenda, setLegenda] = useState('');

  async function escolherImagem() {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!resultado.canceled) {
      setImagem(resultado.assets[0].uri);
    }
  }

  function publicar() {
    if (!imagem) {
      Alert.alert('Escolha uma imagem', 'Selecione uma foto antes de publicar.');
      return;
    }

    // Aqui depois entra o upload para o Firebase
    Alert.alert('Publicado!', 'Seu post foi criado (simulação).');
    setImagem(null);
    setLegenda('');
    navigation.navigate('Home');
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.titulo}>Novo post</Text>

      <TouchableOpacity style={styles.areaImagem} onPress={escolherImagem}>
        {imagem ? (
          <Image source={{ uri: imagem }} style={styles.preview} />
        ) : (
          <View style={styles.vazio}>
            <Ionicons name="image-outline" size={48} color="#BC72DE" />
            <Text style={styles.textoVazio}>Toque para escolher uma foto</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Escreva uma legenda..."
        placeholderTextColor="#888"
        value={legenda}
        onChangeText={setLegenda}
        multiline
      />

      <TouchableOpacity style={styles.botao} onPress={publicar}>
        <Text style={styles.textoBotao}>Publicar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, paddingBottom: 120 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  areaImagem: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#f1e4f8',
    overflow: 'hidden',
    marginBottom: 16,
  },
  preview: { width: '100%', height: '100%' },
  vazio: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  textoVazio: { color: '#9e2ad3', fontWeight: '600' },
  input: {
    minHeight: 80,
    backgroundColor: '#dadada',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  botao: {
    backgroundColor: '#9e2ad3',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  textoBotao: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});