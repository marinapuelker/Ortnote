import React, { useState } from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet, Linking, Modal, TextInput, Pressable,} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {auth} from '../firebase';
import {editarPost, excluirPost} from '../services/posts';

const MAX_WIDTH = 600;

export default function Post({ post, onLike }) {
  const uid = auth.currentUser?.uid;
  const curtidas = post.likedBy ?? [];
  const curtiu = uid ? curtidas.includes(uid) : false;
  const ehDono = !!uid && post.userId === uid;

  const [menuVisivel, setMenuVisivel] = useState(false);
  const [editando, setEditando] = useState(false);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [descricaoEditada, setDescricaoEditada] = useState(post.descricao ?? '');
  const [salvando, setSalvando] = useState(false);

  function abrirEdicao() {
    setMenuVisivel(false);
    setDescricaoEditada(post.descricao ?? '');
    setEditando(true);
  }

  async function salvarEdicao() {
    if (salvando) return;
    try {
      setSalvando(true);
      await editarPost(post, { descricao: descricaoEditada });
      setEditando(false);
    } catch (e) {
      alert(e.message);
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarExclusao() {
    if (salvando) return;
    try {
      setSalvando(true);
      await excluirPost(post); 
      setConfirmandoExclusao(false);
    } catch (e) {
      alert(e.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle" size={36} color="#BC72DE" />
        <Text style={styles.username}>{post.username}</Text>

        {ehDono && (
          <TouchableOpacity
            style={styles.menuBotao}
            onPress={() => setMenuVisivel(true)}
            hitSlop={10}
          >
            <Ionicons name="ellipsis-vertical" size={20} color="#555" />
          </TouchableOpacity>
        )}
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
          <Ionicons
            name={curtiu ? 'heart' : 'heart-outline'}
            size={28}
            color={curtiu ? '#e53935' : '#000'}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.likes}>
        {curtidas.length} {curtidas.length === 1 ? 'curtida' : 'curtidas'}
      </Text>

      {!!post.descricao && (
        <Text style={styles.descricao}>
          <Text style={styles.username}>{post.username} </Text>
          {post.descricao}
        </Text>
      )}

      <Modal
        visible={menuVisivel}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisivel(false)}
      >
        <Pressable style={styles.fundoModal} onPress={() => setMenuVisivel(false)}>
          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuItem} onPress={abrirEdicao}>
              <Ionicons name="create-outline" size={20} color="#9e2ad3" />
              <Text style={styles.menuTexto}>Editar biografia</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisivel(false);
                setConfirmandoExclusao(true);
              }}
            >
              <Ionicons name="trash-outline" size={20} color="#e53935" />
              <Text style={[styles.menuTexto, { color: '#e53935' }]}>Excluir postagem</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={editando}
        transparent
        animationType="fade"
        onRequestClose={() => setEditando(false)}
      >
        <View style={styles.fundoModal}>
          <View style={styles.cardModal}>
            <Text style={styles.tituloModal}>Editar biografia</Text>
            <TextInput
              style={styles.inputEditar}
              value={descricaoEditada}
              onChangeText={setDescricaoEditada}
              multiline
              maxLength={500}
              placeholder="Escreva a biografia..."
              placeholderTextColor="#999"
            />
            <View style={styles.linhaBotoes}>
              <TouchableOpacity style={styles.botaoSecundario} onPress={() => setEditando(false)}>
                <Text style={styles.botaoSecundarioTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botaoPrimario}
                onPress={salvarEdicao}
                disabled={salvando}
              >
                <Text style={styles.botaoPrimarioTexto}>
                  {salvando ? 'Salvando...' : 'Salvar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={confirmandoExclusao}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmandoExclusao(false)}
      >
        <View style={styles.fundoModal}>
          <View style={styles.cardModal}>
            <Text style={styles.tituloModal}>Excluir postagem?</Text>
            <Text style={styles.textoModal}>
              Essa ação não pode ser desfeita. A postagem será removida do app.
            </Text>
            <View style={styles.linhaBotoes}>
              <TouchableOpacity
                style={styles.botaoSecundario}
                onPress={() => setConfirmandoExclusao(false)}
              >
                <Text style={styles.botaoSecundarioTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.botaoPrimario, {backgroundColor: '#e53935'}]}
                onPress={confirmarExclusao}
                disabled={salvando}
              >
                <Text style={styles.botaoPrimarioTexto}>
                  {salvando ? 'Excluindo...' : 'Excluir'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    width: '100%', 
    maxWidth: MAX_WIDTH, 
    alignSelf: 'center', 
    marginBottom: 20 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 10, gap: 8 },
  username: { 
    fontWeight: '600' },
  menuBotao: { 
    marginLeft: 'auto', 
    padding: 4 },
  tags: { 
    flexDirection: 'row', 
    gap: 8, paddingHorizontal: 10, 
    marginBottom: 8 },
  tag: {
    fontSize: 12,
    fontWeight: '700',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tagMateria: { 
    backgroundColor: '#f6e9fc', 
    color: '#9e2ad3' },
  tagSerie: { 
    backgroundColor: '#fff1d6', 
    color: '#a86400' },
  image: { 
    width: '100%', 
    aspectRatio: 1, 
    resizeMode: 'contain', 
    backgroundColor: '#f5f5f5' },
  pdf: {
    width: '100%',
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fbf5fe',
    gap: 8,
  },
  pdfTexto: { 
    color: '#9e2ad3', 
    fontWeight: '700' },
  actions: { 
    flexDirection: 'row', 
    padding: 10 },
  likes: { 
    paddingHorizontal: 10, 
    fontWeight: '600' },
  descricao: { 
    paddingHorizontal: 10, 
    marginTop: 4 },

  fundoModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 14,
    width: '100%',
    maxWidth: 320,
    paddingVertical: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  menuTexto: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#222' },
  cardModal: {
    backgroundColor: '#fff',
    borderRadius: 14,
    width: '100%',
    maxWidth: 380,
    padding: 18,
  },
  tituloModal: { 
    fontSize: 18, 
    fontWeight: '700', 
    marginBottom: 10, 
    color: '#222' },
  textoModal: { 
    color: '#555', 
    marginBottom: 16 },
  inputEditar: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 15,
    color: '#222',
    marginBottom: 16,
  },
  linhaBotoes: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    gap: 10 },
  botaoSecundario: { 
    paddingVertical: 10, 
    paddingHorizontal: 16, 
    borderRadius: 10 },
  botaoSecundarioTexto: { 
    color: '#555', 
    fontWeight: '600' },
  botaoPrimario: {
    backgroundColor: '#9e2ad3',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  botaoPrimarioTexto: { 
    color: '#fff', 
    fontWeight: '700' 
  },
});