import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function PerfilScreen({ navigation }) {
  const [imagemPerfil, setImagemPerfil] = useState(null);
  async function escolherFoto() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      alert('Precisamos de permissão para aceder à sua galeria de fotos!');
      return;
    }
    let resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!resultado.canceled) {
      setImagemPerfil(resultado.assets[0].uri);
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name='arrow-back' size={20} color='#B77FD1' />
        </TouchableOpacity>

        <View style={styles.headerAvatar}>
          {imagemPerfil ? (
            <Image source={{ uri: imagemPerfil }} style={styles.headerAvatarImg} />
          ) : (
            <Ionicons name="person" size={18} color="#fff" />
          )}
        </View>
      </View>

      <View style={styles.profileRow}>
        <TouchableOpacity onPress={escolherFoto} activeOpacity={0.8} style={styles.avatarWrapper}>
          {imagemPerfil ? (
            <Image source={{ uri: imagemPerfil }} style={styles.avatarImg} />
          ) : (
            <Ionicons name='person' size={45} color='#fff' />
          )}
        </TouchableOpacity>
      <View style={styles.plusIcon}>
        <Ionicons name='add' size={14} color='#B77FD1' />
      </View>

        <View style={styles.profileInfo}>
          <Text style={styles.nome}>Nome perfil</Text>
        </View>
      </View>

      <View style={styles.diamondsRow}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={styles.diamond}>
            <Ionicons name='add' size={16} color='#fff' style={styles.diamondIcon} />
          </View>
        ))}
      </View>

      <View style={styles.bioBox}>
        <Text style={styles.bioText}>Biografia</Text>
      </View>

      <View style={{ flex: 1 }} />
    </View>
  );
}

const BACKGROUND = '#DCA8E8';
const HEADER_BG = '#a24cbe';
const WHITE_TRANSPARENT = 'rgba(255,255,255,0.35)';

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: BACKGROUND 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: HEADER_BG,
    paddingHorizontal: 16,
    paddingTop: 45,
    paddingBottom: 12,
  },
  backButton: {
    backgroundColor: '#fff',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#bbb',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  headerAvatarImg: {
    width: '100%',
    height: '100%',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 70,
    marginLeft: 110,
  },
  avatarWrapper: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: WHITE_TRANSPARENT,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  plusIcon: {
    position: 'absolute',
    bottom: 1,
    left: 2,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 1,
    zIndex: 2,
    marginLeft: 20,
  },
  profileInfo: { marginLeft: 14 },
  nome: { color: '#fff', fontSize: 22, fontWeight: '600' },
  diamondsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 28,
    marginTop: 24,
    marginBottom: 24,
  },
  diamond: {
    width: 34,
    height: 34,
    borderWidth: 1.5,
    marginTop: 10,
    borderColor: '#fff',
    transform: [{ rotate: '45deg' }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  diamondIcon: { transform: [{ rotate: '-45deg' }] },
  bioBox: {
    borderWidth: 1.5,
    borderColor: '#fff',
    borderRadius: 14,
    marginTop: 20,
    marginHorizontal: 30,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bioText: { color: '#fff', fontSize: 13 },
});