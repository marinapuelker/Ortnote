import React, { useState } from 'react';
import {
  View, Text, TextInput, Image, TouchableOpacity,
  StyleSheet, ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { criarPost } from '../services/posts';

const MATERIAS = [
  { nome: 'Biologia', cor: '#2e9e5b' },
  { nome: 'Matemática', cor: '#e53935' },
  { nome: 'Português', cor: '#29b6f6' },
  { nome: 'História', cor: '#f9a825' },
  { nome: 'Geografia', cor: '#b266d9' },
  { nome: 'Física', cor: '#3f51b5' },
  { nome: 'Química', cor: '#26a69a' },
  { nome: 'Literatura', cor: '#ec407a' },
];

const SERIES = [
  '6º ano', '7º ano', '8º ano', '9º ano',
  '1º ano EM', '2º ano EM', '3º ano EM',
];

export default function NovoPostScreen({ navigation }) {
  const [materia, setMateria] = useState(null);
  const [serie, setSerie] = useState(null);
  const [tipo, setTipo] = useState(null); // 'pdf' | 'imagem'
  const [arquivo, setArquivo] = useState(null);
  const [descricao, setDescricao] = useState('');
  const [enviando, setEnviando] = useState(false);

  function escolherTipo(novoTipo) {
    if (novoTipo !== tipo) {
      setTipo(novoTipo);
      setArquivo(null);
    }
  }

  async function escolherArquivo() {
    if (tipo === 'imagem') {
      const r = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.7,
      });
      if (!r.canceled) {
        const a = r.assets[0];
        setArquivo({
          uri: a.uri,
          nome: a.fileName ?? 'imagem.jpg',
          mimeType: a.mimeType ?? 'image/jpeg',
        });
      }
    } else if (tipo === 'pdf') {
      const r = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });
      if (!r.canceled) {
        const a = r.assets[0];
        setArquivo({
          uri: a.uri,
          nome: a.name,
          mimeType: a.mimeType ?? 'application/pdf',
        });
      }
    }
  }

  const faltando = [];
  if (!materia) faltando.push('matéria');
  if (!serie) faltando.push('série');
  if (!tipo) faltando.push('tipo de arquivo');
  else if (!arquivo) faltando.push(tipo === 'pdf' ? 'o PDF' : 'a imagem');
  const pronto = faltando.length === 0;

  async function publicar() {
  if (!pronto || enviando) return;

  try {
    setEnviando(true);
    await criarPost(arquivo, { materia, serie, tipo, descricao });

    setMateria(null);
    setSerie(null);
    setTipo(null);
    setArquivo(null);
    setDescricao('');
    navigation.navigate('Home');
  } catch (e) {
    alert('Não foi possível publicar: ' + e.message);
  } finally {
    setEnviando(false);
  }
}

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.titulo}>Nova publicação</Text>

      {/* MATÉRIA */}
      <View style={styles.secao}>
        <Text style={styles.rotulo}>Matéria <Text style={styles.obrig}>*</Text></Text>
        <View style={styles.chips}>
          {MATERIAS.map((m) => {
            const ativo = materia === m.nome;
            return (
              <TouchableOpacity
                key={m.nome}
                onPress={() => setMateria(m.nome)}
                style={[
                  styles.chip,
                  { borderColor: m.cor },
                  ativo && { backgroundColor: m.cor },
                ]}
              >
                <View style={[styles.ponto, { backgroundColor: ativo ? '#fff' : m.cor }]} />
                <Text style={[styles.chipTexto, ativo && styles.chipTextoAtivo]}>
                  {m.nome}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* SÉRIE */}
      <View style={styles.secao}>
        <Text style={styles.rotulo}>Série <Text style={styles.obrig}>*</Text></Text>
        <View style={styles.chips}>
          {SERIES.map((s) => {
            const ativo = serie === s;
            return (
              <TouchableOpacity
                key={s}
                onPress={() => setSerie(s)}
                style={[styles.chip, styles.chipSerie, ativo && styles.chipSerieAtivo]}
              >
                <Text style={[styles.chipTexto, ativo && styles.chipTextoAtivo]}>{s}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* TIPO DE ARQUIVO */}
      <View style={styles.secao}>
        <Text style={styles.rotulo}>Tipo de arquivo <Text style={styles.obrig}>*</Text></Text>
        <View style={styles.tipos}>
          <TouchableOpacity
            style={[styles.cartaoTipo, tipo === 'pdf' && styles.cartaoTipoAtivo]}
            onPress={() => escolherTipo('pdf')}
          >
            <Ionicons name="document-text-outline" size={36} color="#e53935" />
            <Text style={styles.tipoTexto}>PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cartaoTipo, tipo === 'imagem' && styles.cartaoTipoAtivo]}
            onPress={() => escolherTipo('imagem')}
          >
            <Ionicons name="image-outline" size={36} color="#3f51b5" />
            <Text style={styles.tipoTexto}>Imagem</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ARQUIVO */}
      <View style={styles.secao}>
        <Text style={styles.rotulo}>Arquivo <Text style={styles.obrig}>*</Text></Text>

        {!tipo && (
          <Text style={styles.dica}>Escolha o tipo de arquivo acima.</Text>
        )}

        {tipo && !arquivo && (
          <TouchableOpacity style={styles.areaArquivo} onPress={escolherArquivo}>
            <Ionicons name="cloud-upload-outline" size={40} color="#BC72DE" />
            <Text style={styles.areaTexto}>
              Toque para escolher {tipo === 'pdf' ? 'um PDF' : 'uma imagem'}
            </Text>
          </TouchableOpacity>
        )}

        {tipo === 'imagem' && arquivo && (
          <TouchableOpacity onPress={escolherArquivo}>
            <Image source={{ uri: arquivo.uri }} style={styles.preview} />
            <Text style={styles.trocar}>Toque na imagem para trocar</Text>
          </TouchableOpacity>
        )}

        {tipo === 'pdf' && arquivo && (
          <View style={styles.pdfLinha}>
            <Ionicons name="document-text" size={32} color="#e53935" />
            <Text style={styles.pdfNome} numberOfLines={1}>{arquivo.nome}</Text>
            <TouchableOpacity onPress={escolherArquivo}>
              <Text style={styles.trocar}>Trocar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* DESCRIÇÃO (opcional) */}
      <View style={styles.secao}>
        <Text style={styles.rotulo}>Descrição</Text>
        <TextInput
          style={styles.input}
          placeholder="Escreva algo sobre o material (opcional)"
          placeholderTextColor="#888"
          value={descricao}
          onChangeText={setDescricao}
          multiline
        />
      </View>

      {!pronto && (
        <Text style={styles.faltando}>Falta: {faltando.join(', ')}</Text>
      )}

      <TouchableOpacity
        style={[styles.botao, !pronto && styles.botaoDesativado]}
        onPress={publicar}
        disabled={!pronto || enviando}
        activeOpacity={0.8}
      >
        <Text style={styles.botaoTexto}>{enviando ? 'Enviando...' : 'Publicar'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const ROXO = '#9e2ad3';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f2f8' },
  content: { padding: 16, paddingBottom: 120 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#2b1b33' },

  secao: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#eadcf1',
  },
  rotulo: { fontSize: 14, fontWeight: '700', color: '#2b1b33', marginBottom: 12 },
  obrig: { color: '#e53935' },

  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  ponto: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  chipTexto: { fontSize: 14, color: '#333', fontWeight: '500' },
  chipTextoAtivo: { color: '#fff', fontWeight: '700' },
  chipSerie: { borderColor: '#cdb4db' },
  chipSerieAtivo: { backgroundColor: ROXO, borderColor: ROXO },

  tipos: { flexDirection: 'row', gap: 12 },
  cartaoTipo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#eadcf1',
    backgroundColor: '#fff',
    gap: 6,
  },
  cartaoTipoAtivo: { borderColor: ROXO, backgroundColor: '#f6e9fc' },
  tipoTexto: { fontWeight: '700', color: '#2b1b33' },

  dica: { color: '#888' },
  areaArquivo: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#BC72DE',
    backgroundColor: '#fbf5fe',
    gap: 8,
  },
  areaTexto: { color: ROXO, fontWeight: '600' },
  preview: { width: '100%', aspectRatio: 1, borderRadius: 12 },
  trocar: { color: ROXO, fontWeight: '600', marginTop: 8, textAlign: 'center' },
  pdfLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fbf5fe',
  },
  pdfNome: { flex: 1, color: '#2b1b33', fontWeight: '500' },

  input: {
    minHeight: 80,
    backgroundColor: '#f1ecf4',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    textAlignVertical: 'top',
  },

  faltando: { color: '#e53935', marginBottom: 10, textAlign: 'center' },
  botao: {
    backgroundColor: ROXO,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  botaoDesativado: { backgroundColor: '#d9b8ea' },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});