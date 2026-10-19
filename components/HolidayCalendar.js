import { Alert, Platform, View, 
  Text, Pressable, TouchableOpacity, 
  StyleSheet, TextInput, Modal, 
  ActivityIndicator } from 'react-native';
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { obterFeriadosDoAno } from '../services/holidays';
import { ouvirTarefas, salvarTarefa, excluirTarefa } from '../services/tasks';
import { auth } from '../firebase';

const ROXO = '#9e2ad3';

const CORES = [
  { cor: '#9e2ad3', label: 'Roxo' },
  { cor: '#d81b60', label: 'Rosa' },
  { cor: '#f9a825', label: 'Laranja' },
  { cor: '#fdd835', label: 'Amarelo' },
  { cor: '#2e9e5b', label: 'Verde' },
  { cor: '#039be5', label: 'Azul' },
  { cor: '#00acc1', label: 'Ciano' },
  { cor: '#e53935', label: 'Vermelho' },
];

const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function mostrarAviso(titulo, mensagem) {
  if (Platform.OS === 'web') {
    window.alert(`${titulo}\n\n${mensagem}`);
  } else {
    mostrarAviso(titulo, mensagem);
  }
}

function confirmarAcao(titulo, mensagem, aoConfirmar) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${titulo}\n\n${mensagem}`)) aoConfirmar();
  } else {
    mostraAviso(titulo, mensagem, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: aoConfirmar },
    ]);
  }
}

function hojeObj() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function chave(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function inicioSemana(ref) {
  const d = new Date(ref);
  const off = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - off);
  d.setHours(0, 0, 0, 0);
  return d;
}

function diasDaSemana(inicio) {
  const arr = [];
  for (let i = 0; i < 7; i += 1) {
    const d = new Date(inicio);
    d.setDate(inicio.getDate() + i);
    arr.push(d);
  }
  return arr;
}

function fmtDataCurta(ch) {
  const [a, m, dia] = ch.split('-');
  return `${dia}/${m}`;
}

function isoParaBR(iso) {
  if (!iso || iso.length < 10) return '';
  const [a, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${a}`;
}

function brParaISO(texto) {
  const num = (texto || '').replace(/[^0-9]/g, '');
  if (num.length !== 8) return null;
  const dia = parseInt(num.slice(0, 2), 10);
  const mes = parseInt(num.slice(2, 4), 10);
  const ano = parseInt(num.slice(4, 8), 10);
  if (mes < 1 || mes > 12 || dia < 1 || dia > 31) return null;
  const dt = new Date(ano, mes - 1, dia);
  if (dt.getFullYear() !== ano || dt.getMonth() !== mes - 1 || dt.getDate() !== dia) return null;
  return `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

function mascaraData(texto) {
  const n = (texto || '').replace(/[^0-9]/g, '').slice(0, 8);
  if (n.length <= 2) return n;
  if (n.length <= 4) return `${n.slice(0, 2)}/${n.slice(2)}`;
  return `${n.slice(0, 2)}/${n.slice(2, 4)}/${n.slice(4)}`;
}

function mascaraHora(texto) {
  const n = (texto || '').replace(/[^0-9]/g, '').slice(0, 4);
  if (n.length <= 2) return n;
  return `${n.slice(0, 2)}:${n.slice(2)}`;
}

function horaValida(texto) {
  const n = (texto || '').replace(/[^0-9]/g, '');
  if (n.length !== 4) return null;
  const h = parseInt(n.slice(0, 2), 10);
  const m = parseInt(n.slice(2, 4), 10);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function corFeriado(ev) {
  if (ev.categoria === 'nacional') return '#2e9e5b';
  if (ev.categoria === 'judaico') return '#3f51b5';
  return '#f9a825';
}

export default function HolidayCalendar() {
  const [semanaInicio, setSemanaInicio] = useState(() => inicioSemana(hojeObj()));
  const [diaSel, setDiaSel] = useState(() => chave(hojeObj()));
  const [feriados, setFeriados] = useState([]);
  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [uid, setUid] = useState(auth.currentUser ? auth.currentUser.uid : null);

  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [fData, setFData] = useState('');
  const [fHora, setFHora] = useState('');
  const [fTitulo, setFTitulo] = useState('');
  const [fDesc, setFDesc] = useState('');
  const [fCor, setFCor] = useState(CORES[0].cor);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUid(u ? u.uid : null));
    return () => unsub && unsub();
  }, []);

  useEffect(() => {
    let vivo = true;
    setCarregando(true);
    const ano = semanaInicio.getFullYear();
    obterFeriadosDoAno(ano)
      .then((res) => {
        if (vivo) setFeriados(res.eventos || []);
      })
      .catch(() => {
        if (vivo) setFeriados([]);
      })
      .finally(() => {
        if (vivo) setCarregando(false);
      });
    return () => {
      vivo = false;
    };
  }, [semanaInicio]);

  useEffect(() => {
    if (!uid) {
      setTarefas([]);
      return undefined;
    }
    const off = ouvirTarefas(
      uid,
      (lista) => setTarefas(Array.isArray(lista) ? lista : []),
      () => {}
    );
    return () => {
      if (typeof off === 'function') off();
    };
  }, [uid]);

  const dias = useMemo(() => diasDaSemana(semanaInicio), [semanaInicio]);

  const mapa = useMemo(() => {
    const m = {};
    for (const ev of feriados) {
      if (!ev.data) continue;
      if (!m[ev.data]) m[ev.data] = [];
      m[ev.data].push({ tipo: 'feriado', nome: ev.nome, cor: corFeriado(ev), key: `f-${ev.data}-${ev.nome}` });
    }
    for (const t of tarefas) {
      if (!t.data) continue;
      if (!m[t.data]) m[t.data] = [];
      m[t.data].push({ tipo: 'tarefa', ref: t, cor: t.cor || ROXO, key: `t-${t.id}` });
    }
    for (const k of Object.keys(m)) {
      m[k].sort((a, b) => {
        const ha = a.tipo === 'tarefa' ? a.ref.hora || '99:99' : '00:00';
        const hb = b.tipo === 'tarefa' ? b.ref.hora || '99:99' : '00:00';
        return ha.localeCompare(hb);
      });
    }
    return m;
  }, [feriados, tarefas]);

  const tituloSemana = useMemo(() => {
    const fim = new Date(semanaInicio);
    fim.setDate(semanaInicio.getDate() + 6);
    const mesmoMes = fim.getMonth() === semanaInicio.getMonth();
    if (mesmoMes) {
      return `${semanaInicio.getDate()}–${fim.getDate()} de ${MESES[semanaInicio.getMonth()]} ${semanaInicio.getFullYear()}`;
    }
    return `${semanaInicio.getDate()} ${MESES[semanaInicio.getMonth()]} – ${fim.getDate()} ${MESES[fim.getMonth()]} ${fim.getFullYear()}`;
  }, [semanaInicio]);

  function irSemana(delta) {
    const d = new Date(semanaInicio);
    d.setDate(d.getDate() + delta * 7);
    setSemanaInicio(inicioSemana(d));
  }

  function irHoje() {
    const h = hojeObj();
    setSemanaInicio(inicioSemana(h));
    setDiaSel(chave(h));
  }

  function abrirNovo(diaIso) {
    setEditId(null);
    setFData(mascaraData(isoParaBR(diaIso || diaSel)));
    setFHora('');
    setFTitulo('');
    setFDesc('');
    setFCor(CORES[0].cor);
    setModal(true);
  }

  function abrirEditar(t) {
    setEditId(t.id);
    setFData(mascaraData(isoParaBR(t.data)));
    setFHora(t.hora || '');
    setFTitulo(t.titulo || '');
    setFDesc(t.descricao || '');
    setFCor(t.cor || CORES[0].cor);
    setModal(true);
  }

  function fechar() {
    if (salvando) return;
    setModal(false);
    setEditId(null);
  }

  async function salvar() {
    const iso = brParaISO(fData);
    if (!iso) {
      Alert.alert('Atenção', 'Informe uma data válida (DD/MM/AAAA).');
      return;
    }
    const hv = horaValida(fHora);
    if (!hv) {
      Alert.alert('Atenção', 'Informe um horário válido (HH:MM).');
      return;
    }
    if (!uid) {
      Alert.alert('Atenção', 'Você precisa estar logado para criar lembretes.');
      return;
    }
    setSalvando(true);
    try {
      if (editId) {
        const atual = tarefas.find((x) => x.id === editId);
        await salvarTarefa({
          id: editId,
          titulo: fTitulo.trim(),
          descricao: fDesc.trim(),
          data: iso,
          hora: hv,
          cor: fCor,
          concluida: atual ? Boolean(atual.concluida) : false,
        });
      } else {
        await salvarTarefa({
          titulo: fTitulo.trim(),
          descricao: fDesc.trim(),
          data: iso,
          hora: hv,
          cor: fCor,
          concluida: false,
        });
      }
      setDiaSel(iso);
      const dt = new Date(parseInt(iso.slice(0, 4), 10), parseInt(iso.slice(5, 7), 10) - 1, parseInt(iso.slice(8, 10), 10));
      setSemanaInicio(inicioSemana(dt));
      setModal(false);
      setEditId(null);
  } catch (e) {
      console.log('Erro ao salvar lembrete:', e.code, e.message);
      mostrarAviso('Erro', e.message || 'Não foi possível salvar.');
    } finally {
      setSalvando(false);
    }
  }

  function alternar(t) {
    salvarTarefa({ ...t, concluida: !t.concluida }).catch((e) => mostrarAviso('Erro', e.message));
  }

  function excluir(t) {
    confirmarAcao('Excluir', `Remover "${t.titulo || 'lembrete'}"?`, () =>
      excluirTarefa(t.id).catch((e) => mostrarAviso('Erro', e.message))
    );
  }
  const chHoje = chave(hojeObj());

  const eventosSel = useMemo(() => {
    const lista = mapa[diaSel] || [];
    return [...lista].sort((a, b) => {
      if (a.tipo !== b.tipo) return a.tipo === 'tarefa' ? -1 : 1;
      return 0;
    });
  }, [mapa, diaSel]);

  return (
    <View style={styles.card}>
      <View style={styles.topo}>
        <View style={styles.topoLinha}>
          <View>
            <Text style={styles.titulo}>Semana</Text>
            <Text style={styles.sub}>{tituloSemana}</Text>
          </View>
          <View style={styles.topoBtns}>
            <Pressable onPress={() => irSemana(-1)} style={styles.nav}>
              <Ionicons name="chevron-back" size={20} color={ROXO} />
            </Pressable>
            <Pressable onPress={irHoje} style={styles.hoje}>
              <Text style={styles.hojeTxt}>Hoje</Text>
            </Pressable>
            <Pressable onPress={() => irSemana(1)} style={styles.nav}>
              <Ionicons name="chevron-forward" size={20} color={ROXO} />
            </Pressable>
          </View>
        </View>
        <View style={styles.faixa}>
          {dias.map((d, i) => {
            const k = chave(d);
            const sel = k === diaSel;
            const eHoje = k === chHoje;
            const evs = mapa[k] || [];
            const pontos = evs.slice(0, 3);
            const extra = evs.length - pontos.length;
            return (
              <Pressable key={k} onPress={() => setDiaSel(k)} onLongPress={() => abrirNovo(k)} style={[styles.dia, sel && styles.diaSel]}>
                <Text style={[styles.diaSem, sel && styles.diaSemSel]}>{DIAS[i]}</Text>
                <View style={[styles.diaNum, eHoje && styles.diaNumHoje, sel && styles.diaNumSel]}>
                  <Text style={[styles.diaNumTxt, (eHoje || sel) && styles.diaNumTxtClaro]}>{d.getDate()}</Text>
                </View>
                <View style={styles.pontos}>
                  {pontos.map((p) => (
                    <View key={p.key} style={[styles.ponto, { backgroundColor: p.cor }]} />
                  ))}
                  {extra > 0 && <Text style={styles.extra}>+{extra}</Text>}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
      <View style={styles.listaTopo}>
        <Text style={styles.listaTitulo}>{fmtDataCurta(diaSel)} - {eventosSel.length === 0 ? 'nada agendado' : `${eventosSel.length} item(ns)`}</Text>
        <TouchableOpacity onPress={() => abrirNovo(diaSel)} style={styles.add}>
          <Ionicons name="add" size={16} color="#fff" />
          <Text style={styles.addTxt}>Lembrete</Text>
        </TouchableOpacity>
      </View>
      {carregando ? (
        <View style={styles.load}>
          <ActivityIndicator color={ROXO} />
          <Text style={styles.loadTxt}>Carregando…</Text>
        </View>
      ) : eventosSel.length === 0 ? (
        <View style={styles.vazio}>
          <Ionicons name="calendar-outline" size={26} color="#c9a9d8" />
          <Text style={styles.vazioTxt}>Nenhum evento neste dia.</Text>
          <Pressable onPress={() => abrirNovo(diaSel)}>
            <Text style={styles.vazioLink}>Criar prova, simulado ou lembrete</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.lista}>
          {eventosSel.map((ev) => {
            if (ev.tipo === 'feriado') {
              return (
                <View key={ev.key} style={[styles.item, { borderLeftColor: ev.cor }]}>
                  <View style={[styles.dot, { backgroundColor: ev.cor }]} />
                  <View style={styles.itemTxt}>
                    <Text style={styles.itemNome}>{ev.nome}</Text>
                    <Text style={styles.itemSub}>Feriado</Text>
                  </View>
                </View>
              );
            }
            const t = ev.ref;
            return (
              <View key={ev.key} style={[styles.item, { borderLeftColor: ev.cor }, t.concluida && styles.itemOk]}>
                <Pressable onPress={() => alternar(t)} style={styles.check}>
                  {t.concluida ? (
                    <Ionicons name="checkmark-circle" size={22} color="#2e9e5b" />
                  ) : (
                    <View style={[styles.checkOff, { borderColor: ev.cor }]} />
                  )}
                </Pressable>
                <View style={styles.itemTxt}>
                  <Text style={[styles.itemNome, t.concluida && styles.riscado]} numberOfLines={1}>{t.titulo || 'Lembrete'}</Text>
                  <Text style={styles.itemSub}>{(t.hora || '—') + (t.descricao ? ` · ${t.descricao}` : '')}</Text>
                </View>
                <TouchableOpacity onPress={() => abrirEditar(t)} style={styles.ico}>
                  <Ionicons name="pencil" size={17} color={ROXO} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => excluir(t)} style={styles.ico}>
                  <Ionicons name="trash-outline" size={17} color="#e53935" />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}
      <Modal visible={modal} animationType="slide" transparent onRequestClose={fechar}>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTit}>{editId ? 'Editar lembrete' : 'Novo lembrete'}</Text>
            <Text style={styles.sheetSub}>Prova, simulado ou qualquer compromisso.</Text>
            <Text style={styles.lab}>Data *</Text>
            <TextInput style={styles.inp} value={fData} onChangeText={(v) => setFData(mascaraData(v))} placeholder="DD/MM/AAAA" placeholderTextColor="#bbb" keyboardType="numeric" maxLength={10} />
            <Text style={styles.lab}>Horario *</Text>
            <TextInput style={styles.inp} value={fHora} onChangeText={(v) => setFHora(mascaraHora(v))} placeholder="HH:MM" placeholderTextColor="#bbb" keyboardType="numeric" maxLength={5} />
            <Text style={styles.lab}>Legenda (opcional)</Text>
            <TextInput style={styles.inp} value={fTitulo} onChangeText={setFTitulo} placeholder="Ex.: Prova de Matematica" placeholderTextColor="#bbb" maxLength={120} />
            <Text style={styles.lab}>Cor do lembrete</Text>
            <View style={styles.cores}>
              {CORES.map((c) => (
                <Pressable key={c.cor} onPress={() => setFCor(c.cor)} style={[styles.cor, fCor === c.cor && styles.corSel]}>
                  <View style={[styles.corDot, { backgroundColor: c.cor }]} />
                  <Text style={styles.corTxt}>{c.label}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.lab}>Descricao (opcional)</Text>
            <TextInput style={[styles.inp, styles.multi]} value={fDesc} onChangeText={setFDesc} placeholder="Detalhe opcional" placeholderTextColor="#bbb" multiline maxLength={300} />
            <View style={styles.btns}>
              <Pressable onPress={fechar} style={styles.cancel} disabled={salvando}>
                <Text style={styles.cancelTxt}>Cancelar</Text>
              </Pressable>
              <Pressable onPress={salvar} style={styles.ok} disabled={salvando}>
                <Text style={styles.okTxt}>{salvando ? 'Salvando' : editId ? 'Salvar' : 'Criar'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: '100%', backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#eadcf1', padding: 12, marginTop: 12 },
  topo: { backgroundColor: '#fbf5fe', borderRadius: 10, padding: 10 },
  topoLinha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titulo: { fontSize: 16, fontWeight: '800', color: '#2b1b33' },
  sub: { fontSize: 12, color: '#666', marginTop: 2 },
  topoBtns: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  nav: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#f6e9fc', alignItems: 'center', justifyContent: 'center' },
  hoje: { paddingHorizontal: 10, height: 30, borderRadius: 15, backgroundColor: '#fff', borderWidth: 1, borderColor: '#eadcf1', alignItems: 'center', justifyContent: 'center' },
  hojeTxt: { fontSize: 12, fontWeight: '700', color: ROXO },
  faixa: { flexDirection: 'row', marginTop: 10, gap: 4 },
  dia: { flex: 1, alignItems: 'center', paddingVertical: 6, borderRadius: 10 },
  diaSel: { backgroundColor: '#f6e9fc' },
  diaSem: { fontSize: 10, color: '#888', fontWeight: '700' },
  diaSemSel: { color: ROXO },
  diaNum: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 2, backgroundColor: '#eee' },
  diaNumHoje: { backgroundColor: ROXO },
  diaNumSel: { backgroundColor: ROXO },
  diaNumTxt: { fontSize: 13, fontWeight: '800', color: '#444' },
  diaNumTxtClaro: { color: '#fff' },
  pontos: { flexDirection: 'row', alignItems: 'center', marginTop: 3, height: 12 },
  ponto: { width: 6, height: 6, borderRadius: 3, marginHorizontal: 1 },
  extra: { fontSize: 9, color: '#888', marginLeft: 2 },
  listaTopo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  listaTitulo: { fontSize: 13, fontWeight: '700', color: '#2b1b33' },
  add: { flexDirection: 'row', alignItems: 'center', backgroundColor: ROXO, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6, gap: 4 },
  addTxt: { color: '#fff', fontSize: 12, fontWeight: '700' },
  load: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14, justifyContent: 'center' },
  loadTxt: { color: '#666', fontSize: 12 },
  vazio: { alignItems: 'center', paddingVertical: 16 },
  vazioTxt: { color: '#666', fontSize: 12, marginTop: 6 },
  vazioLink: { color: ROXO, fontSize: 12, fontWeight: '700', marginTop: 4 },
  lista: { marginTop: 8, gap: 8 },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#eadcf1', borderLeftWidth: 4, padding: 8, gap: 8 },
  itemOk: { opacity: 0.7 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  itemTxt: { flex: 1 },
  itemNome: { fontSize: 13, fontWeight: '700', color: '#2b1b33' },
  itemSub: { fontSize: 11, color: '#666', marginTop: 1 },
  riscado: { textDecorationLine: 'line-through', color: '#999' },
  check: { padding: 2 },
  checkOff: { width: 20, height: 20, borderRadius: 10, borderWidth: 2 },
  ico: { padding: 4 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16, maxHeight: '90%' },
  sheetTit: { fontSize: 16, fontWeight: '800', color: '#2b1b33' },
  sheetSub: { fontSize: 12, color: '#666', marginBottom: 10 },
  lab: { fontSize: 12, fontWeight: '700', color: '#2b1b33', marginTop: 8, marginBottom: 4 },
  inp: { borderWidth: 1, borderColor: '#eadcf1', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, fontSize: 13, backgroundColor: '#fbf5fe' },
  multi: { minHeight: 60, textAlignVertical: 'top' },
  cores: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  cor: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#eadcf1', borderRadius: 14, paddingHorizontal: 8, paddingVertical: 5, gap: 5 },
  corSel: { borderColor: ROXO, backgroundColor: '#f6e9fc' },
  corDot: { width: 12, height: 12, borderRadius: 6 },
  corTxt: { fontSize: 11, color: '#444' },
  btns: { flexDirection: 'row', gap: 8, marginTop: 14 },
  cancel: { flex: 1, borderWidth: 1, borderColor: '#eadcf1', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  cancelTxt: { color: '#666', fontWeight: '700' },
  ok: { flex: 1, backgroundColor: ROXO, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  okTxt: { color: '#fff', fontWeight: '700' },
});
