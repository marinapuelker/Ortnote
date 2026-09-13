import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PerfilScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#B77FD1" />
        </TouchableOpacity>

        <View style={styles.headerAvatar}>
          <Ionicons name="person" size={18} color="#fff" />
        </View>
      </View>

      <View style={styles.profileRow}>
        <View style={styles.avatarWrapper}>
          <Ionicons name="person" size={45} color="#fff" />
          <View style={styles.plusIcon}>
            <Ionicons name="add" size={14} color="#B77FD1" />
          </View>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.nome}>Nome perfil</Text>
          <Text style={styles.email}>nome.sobrenome@ort.org.br</Text>
        </View>
      </View>

      <View style={styles.diamondsRow}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={styles.diamond}>
            <Ionicons name="add" size={16} color="#fff" style={styles.diamondIcon} />
          </View>
        ))}
      </View>

      <View style={styles.bioBox}>
        <Text style={styles.bioText}>Biografia</Text>
      </View>

      <View style={{ flex: 1 }} />

      <TouchableOpacity style={styles.sairButton}>
        <Text style={styles.sairText}>SAIR</Text>
      </TouchableOpacity>
    </View>
  );
}

const BACKGROUND = '#DCA8E8';
const HEADER_BG = '#CB93DE';
const WHITE_TRANSPARENT = 'rgba(255,255,255,0.35)';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND },
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
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  avatarWrapper: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: WHITE_TRANSPARENT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 2,
  },
  profileInfo: { marginLeft: 14 },
  nome: { color: '#fff', fontSize: 16, fontWeight: '600' },
  email: { color: '#f2e3fa', fontSize: 11, marginTop: 2 },
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
    marginHorizontal: 20,
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bioText: { color: '#fff', fontSize: 13 },
  sairButton: {
    backgroundColor: '#6FC2B0',
    marginHorizontal: 24,
    marginBottom: 30,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  sairText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});