import React, { useEffect, useMemo, useState } from 'react';
import {FlatList, View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity,} from 'react-native';
import {collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import {Ionicons} from '@expo/vector-icons';
import {db} from '../firebase';
import Post from '../components/Post';
import {alternarCurtida} from '../services/posts';
import {registrarBusca, registrarEscolha, carregarHistorico} from '../services/buscas';
import {postCorrespondeBusca, sugerirFiltros, montarPreferencias} from '../utils/busca';

function Chip({ label, ativo, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.chip, ativo && styles.chipAtivo]}
    >
      <Text style={[styles.chipTexto, ativo && styles.chipTextoAtivo]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const [posts, setPosts] = useState([]);
  const [historico, setHistorico] = useState([]);

  const [textoDigitado, setTextoDigitado] = useState('');
  const [termo, setTermo] = useState(''); 
  const [materia, setMateria] = useState(null);
  const [serie, setSerie] = useState(null);
  const [tipo, setTipo] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(200)
    );

    const cancelar = onSnapshot(
      q,
      (snap) => setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (erro) => console.log('Erro ao carregar posts:', erro.message)
    );

    return cancelar;
  }, []);

  useEffect(() => {
    carregarHistorico().then(setHistorico);
  }, []);

  const preferencias = useMemo(() => montarPreferencias(historico), [historico]);

  const resultadosDaBusca = useMemo(
    () => posts.filter((p) => postCorrespondeBusca(p, { termo })),
    [posts, termo]
  );

  const sugestoes = useMemo(
    () => sugerirFiltros(resultadosDaBusca, preferencias),
    [resultadosDaBusca, preferencias]
  );

  const exibidos = useMemo(
    () =>
      resultadosDaBusca.filter((p) =>
        postCorrespondeBusca(p, { termo, materia, serie, tipo })
      ),
    [resultadosDaBusca, termo, materia, serie, tipo]
  );

  const pesquisaAtiva = !!termo;
  const filtrosAtivos = [
    materia,
    serie,
    tipo === 'pdf' ? 'PDF' : tipo === 'imagem' ? 'Imagem' : null,
  ].filter(Boolean);

  function pesquisar() {
    const novo = textoDigitado.trim();
    setTermo(novo);
    setMateria(null);
    setSerie(null);
    setTipo(null);

    if (novo) {
      registrarBusca(novo);
      setHistorico((h) => [{ campo: 'busca', termo: novo }, ...h]);
    }
  }

  function limparTudo() {
    setTextoDigitado('');
    setTermo('');
    setMateria(null);
    setSerie(null);
    setTipo(null);
  }

  function limparFiltros() {
    setMateria(null);
    setSerie(null);
    setTipo(null);
  }

  function escolher(campo, valor) {
    const atual = { materia, serie, tipo }[campo];
    const novoValor = atual === valor ? null : valor;

    if (campo === 'materia') setMateria(novoValor);
    if (campo === 'serie') setSerie(novoValor);
    if (campo === 'tipo') setTipo(novoValor);

    if (novoValor) {
      registrarEscolha(termo, campo, novoValor);
      setHistorico((h) => [{ campo, valor: novoValor, termo }, ...h]);
    }
  }

  const cabecalho = (
    <View style={styles.cabecalho}>
      <View style={styles.campoBusca}>
        <TouchableOpacity onPress={pesquisar} hitSlop={8}>
          <Ionicons name="search" size={18} color="#8607cf" />
        </TouchableOpacity>
        <TextInput
          style={styles.inputBusca}
          placeholder="Pesquisar por palavras-chave..."
          placeholderTextColor="#999"
          value={textoDigitado}
          onChangeText={setTextoDigitado}
          onSubmitEditing={pesquisar}
          returnKeyType="search"
          autoCorrect={false}
        />
        {!!textoDigitado && (
          <TouchableOpacity onPress={limparTudo} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {pesquisaAtiva && resultadosDaBusca.length > 0 && (
        <View style={styles.painel}>
          <Text style={styles.rotulo}>SUGESTÕES PARA "{termo}"</Text>

          {sugestoes.materias.length > 0 && (
            <>
              <Text style={styles.subrotulo}>Matéria</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.linhaChips}>
                {sugestoes.materias.map(({ valor, n }) => (
                  <Chip
                    key={valor}
                    label={`${valor} (${n})`}
                    ativo={materia === valor}
                    onPress={() => escolher('materia', valor)}
                  />
                ))}
              </ScrollView>
            </>
          )}

          {sugestoes.series.length > 0 && (
            <>
              <Text style={styles.subrotulo}>Série</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.linhaChips}>
                {sugestoes.series.map(({ valor, n }) => (
                  <Chip
                    key={valor}
                    label={`${valor} (${n})`}
                    ativo={serie === valor}
                    onPress={() => escolher('serie', valor)}
                  />
                ))}
              </ScrollView>
            </>
          )}

          {sugestoes.tipos.length > 0 && (
            <>
              <Text style={styles.subrotulo}>Tipo</Text>
              <View style={styles.linhaChipsFixa}>
                {sugestoes.tipos.map(({ valor, n }) => (
                  <Chip
                    key={valor}
                    label={`${valor === 'pdf' ? 'PDF' : 'Imagem'} (${n})`}
                    ativo={tipo === valor}
                    onPress={() => escolher('tipo', valor)}
                  />
                ))}
              </View>
            </>
          )}
        </View>
      )}

      {filtrosAtivos.length > 0 && (
        <View style={styles.faixaAtivos}>
          <Text style={styles.textoAtivos} numberOfLines={1}>
            Filtrando por: {filtrosAtivos.join(' · ')}
          </Text>
          <TouchableOpacity onPress={limparFiltros} hitSlop={8}>
            <Text style={styles.removerTexto}>Remover</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={exibidos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Post
            post={item}
            onLike={(p) => alternarCurtida(p).catch((e) => alert(e.message))}
          />
        )}
        ListHeaderComponent={cabecalho}
        contentContainerStyle={{ paddingBottom: 110 }}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={styles.vazio}>
            {pesquisaAtiva
              ? `Nenhuma publicação encontrada para "${termo}".`
              : 'Nenhuma publicação ainda.'}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  cabecalho: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 4 },
  campoBusca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#e6d3f2',
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 12,
  },
  inputBusca: { flex: 1, fontSize: 15, color: '#222', outlineStyle: 'none' },
  painel: {
    borderWidth: 1,
    borderColor: '#f0e4f7',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#fdfaff',
  },
  rotulo: { fontSize: 11, fontWeight: '700', color: '#5C4100', letterSpacing: 1, marginBottom: 4 },
  subrotulo: { fontSize: 12, fontWeight: '600', color: '#777', marginTop: 8, marginBottom: 6 },
  linhaChips: { gap: 8, paddingBottom: 4 },
  linhaChipsFixa: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingBottom: 4 },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#f3f3f3',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  chipAtivo: { backgroundColor: '#9e2ad3', borderColor: '#9e2ad3' },
  chipTexto: { color: '#555', fontWeight: '600', fontSize: 13 },
  chipTextoAtivo: { color: '#fff' },
  faixaAtivos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f6e9fc',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  textoAtivos: { 
    color: '#9e2ad3', 
    fontWeight: '600', 
    fontSize: 13, 
    flex: 1 },
  removerTexto: { color: '#9e2ad3', fontWeight: '700', marginLeft: 10 },
  vazio: { textAlign: 'center', color: '#888', marginTop: 40 },
});