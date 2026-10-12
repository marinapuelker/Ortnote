import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { obterFeriadosDoAno } from '../services/holidays';

const ROXO = '#9e2ad3';
const ROXO_CLARO = '#BC72DE';
const TEXTO = '#2b1b33';
const TEXTO_SEC = '#666';
const BORDA = '#eadcf1';
const FUNDO_SELECAO = '#f6e9fc';
const FUNDO_LEVE = '#fbf5fe';


const CATEGORIAS = {
  judaico: { rotulo: 'Feriado judaico', cor: '#3f51b5' },
  nacional: { rotulo: 'Feriado nacional', cor: '#2e9e5b' },
  comemorativa: { rotulo: 'Comemorativa', cor: '#f9a825' },
};
const ORDEM_CATEGORIAS = ['judaico', 'nacional', 'comemorativa'];

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];
const DIAS_SEMANA = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

function dataAtual() {
  const d = new Date();
  return { ano: d.getFullYear(), mes: d.getMonth(), dia: d.getDate() };
}
function chaveData(ano, mes, dia) {
  return `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}
function formatarData(chave) {
  const partes = chave.split('-');
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}
function construirGrade(ano, mes) {
  const primeiroDom = new Date(ano, mes, 1).getDay(); 
  const deslocamento = (primeiroDom + 6) % 7; 
  const totalDias = new Date(ano, mes + 1, 0).getDate();
  const celulas = [];
  for (let i = 0; i < deslocamento; i++) celulas.push(null);
  for (let d = 1; d <= totalDias; d++) celulas.push(d);
  while (celulas.length % 7 !== 0) celulas.push(null);
  return celulas;
}

export default function HolidayCalendar() {
  const inicial = useMemo(dataAtual, []);
  const [viewAno, setViewAno] = useState(inicial.ano);
  const [viewMes, setViewMes] = useState(inicial.mes);


  const [hoje, setHoje] = useState(inicial);
  useEffect(() => {
    const id = setInterval(() => {
      setHoje((prev) => {
        const agora = dataAtual();
        if (
          prev.ano === agora.ano &&
          prev.mes === agora.mes &&
          prev.dia === agora.dia
        ) {
          return prev;
        }
        return agora;
      });
    }, 60000);
    return () => clearInterval(id);
  }, []);

  const [dados, setDados] = useState({
    eventos: [],
    fontes: { judaico: 'ok', nacional: 'ok' },
  });
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    obterFeriadosDoAno(viewAno)
      .then((res) => {
        if (ativo) {
          setDados(res);
          setCarregando(false);
        }
      })
      .catch(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
  }, [viewAno]);


  const mapaEventos = useMemo(() => {
    const mapa = {};
    for (const ev of dados.eventos) {
      if (!mapa[ev.data]) mapa[ev.data] = [];
      mapa[ev.data].push(ev);
    }
    return mapa;
  }, [dados.eventos]);


  const [selecionado, setSelecionado] = useState(null);
  function selecionarDia(chave) {
    setSelecionado((prev) => (prev === chave ? null : chave));
  }


  const [tooltip, setTooltip] = useState(null);
  const [tooltipTam, setTooltipTam] = useState({ w: 220, h: 90 });
  const [gradeTam, setGradeTam] = useState({ w: 320, h: 280 });
  const celulasLayout = useRef({});
  const habilitarHover = Platform.OS === 'web';

  function fecharDetalhes() {
    setSelecionado(null);
    setTooltip(null);
  }
  function mostrarTooltip(chave) {
    const eventos = mapaEventos[chave];
    if (!eventos || eventos.length === 0) return;
    const layout = celulasLayout.current[chave];
    if (!layout) return;
    setTooltip({ chave, eventos, ...layout });
  }
  function esconderTooltip() {
    setTooltip(null);
  }


  function mesAnterior() {
    fecharDetalhes();
    if (viewMes === 0) {
      setViewMes(11);
      setViewAno((a) => a - 1);
    } else {
      setViewMes((m) => m - 1);
    }
  }
  function mesSeguinte() {
    fecharDetalhes();
    if (viewMes === 11) {
      setViewMes(0);
      setViewAno((a) => a + 1);
    } else {
      setViewMes((m) => m + 1);
    }
  }


  let tooltipEstilo = { left: 4, top: 4, width: tooltipTam.w };
  if (tooltip) {
    const largura = Math.min(tooltipTam.w, gradeTam.w - 8);
    const centroX = tooltip.x + tooltip.width / 2;
    let left = centroX - largura / 2;
    left = Math.max(4, Math.min(left, gradeTam.w - largura - 4));
    const metadeGrade = gradeTam.h / 2;
    const abaixo = tooltip.y < metadeGrade;
    const top = abaixo
      ? tooltip.y + tooltip.height + 6
      : Math.max(4, tooltip.y - tooltipTam.h - 6);
    tooltipEstilo = { left, top, width: largura };
  }

  const grade = construirGrade(viewAno, viewMes);
  const titulo = `${MESES[viewMes]} ${viewAno}`;
  const chaveHoje = chaveData(hoje.ano, hoje.mes, hoje.dia);
  const eventosSelecionados = selecionado ? mapaEventos[selecionado] || [] : [];
  const algumaFonteFalhou =
    dados.fontes.judaico === 'erro' || dados.fontes.nacional === 'erro';

  function recarregar() {
    setCarregando(true);
    obterFeriadosDoAno(viewAno, { forcar: true })
      .then((res) => {
        setDados(res);
        setCarregando(false);
      })
      .catch(() => setCarregando(false));
  }


  return (
    <View style={styles.card}>
      <View style={styles.cabecalho}>
        <Pressable
          onPress={mesAnterior}
          style={({ pressed }) => [
            styles.botaoNav,
            pressed && styles.botaoNavAtivo,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Mês anterior"
          hitSlop={10}
        >
          <Ionicons name="chevron-back" size={22} color={ROXO} />
        </Pressable>

        <View style={styles.tituloWrap}>
          <Text style={styles.titulo} numberOfLines={1}>
            {titulo}
          </Text>
        </View>

        <Pressable
          onPress={mesSeguinte}
          style={({ pressed }) => [
            styles.botaoNav,
            pressed && styles.botaoNavAtivo,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Próximo mês"
          hitSlop={10}
        >
          <Ionicons name="chevron-forward" size={22} color={ROXO} />
        </Pressable>
      </View>
      <View style={styles.semanaLinha}>
        {DIAS_SEMANA.map((d) => (
          <View key={d} style={styles.celulaSemana}>
            <Text style={styles.semanaTexto}>{d}</Text>
          </View>
        ))}
      </View>
      <View
        style={styles.grade}
        onLayout={(e) =>
          setGradeTam({
            w: e.nativeEvent.layout.width,
            h: e.nativeEvent.layout.height,
          })
        }
      >
        {grade.map((dia, idx) => {
          if (dia === null) {
            return <View key={`vazio-${idx}`} style={styles.celula} />;
          }
          const chave = chaveData(viewAno, viewMes, dia);
          const eventos = mapaEventos[chave] || [];
          const ehHoje = chave === chaveHoje;
          const ehSelecionado = selecionado === chave;
          const fimDeSemana = idx % 7 >= 5;

          const categorias = ORDEM_CATEGORIAS.filter((c) =>
            eventos.some((ev) => ev.categoria === c)
          );

          const propsHover = habilitarHover
            ? {
                onHoverIn: () => mostrarTooltip(chave),
                onHoverOut: esconderTooltip,
              }
            : {};

          const rotulo =
            `${dia} de ${MESES[viewMes]} de ${viewAno}` +
            (eventos.length
              ? '. ' + eventos.map((ev) => ev.nome).join(', ')
              : '. Sem feriados');

          return (
            <Pressable
              key={chave}
              style={({ pressed }) => [
                styles.celula,
                ehSelecionado && !ehHoje && styles.celulaSelecionada,
                ehHoje && styles.celulaHoje,
                ehHoje && ehSelecionado && styles.celulaHojeSelecionada,
                pressed && styles.celulaPressionada,
              ]}
              onPress={() => selecionarDia(chave)}
              onLayout={(e) => {
                celulasLayout.current[chave] = e.nativeEvent.layout;
              }}
              accessibilityRole="button"
              accessibilityLabel={rotulo}
              {...propsHover}
            >
              <Text
                style={[
                  styles.diaNumero,
                  fimDeSemana && !ehHoje && styles.diaNumeroFimDeSemana,
                  ehSelecionado && !ehHoje && styles.diaNumeroSelecionado,
                  ehHoje && styles.diaNumeroHoje,
                ]}
              >
                {dia}
              </Text>

              {categorias.length > 0 && (
                <View style={styles.indicadores}>
                  {categorias.map((c) => (
                    <View
                      key={c}
                      style={[
                        styles.indicador,
                        { backgroundColor: CATEGORIAS[c].cor },
                      ]}
                    />
                  ))}
                </View>
              )}
            </Pressable>
          );
        })}
        {tooltip && habilitarHover && (
          <View
            style={[styles.tooltip, tooltipEstilo]}
            pointerEvents="none"
            onLayout={(e) =>
              setTooltipTam({
                w: e.nativeEvent.layout.width,
                h: e.nativeEvent.layout.height,
              })
            }
          >
            <Text style={styles.tooltipData}>{formatarData(tooltip.chave)}</Text>
            {tooltip.eventos.map((ev, i) => (
              <View
                key={`${ev.data}-${ev.nome}-${i}`}
                style={styles.tooltipEvento}
              >
                <View style={styles.eventoTopo}>
                  <View
                    style={[
                      styles.eventoPonto,
                      { backgroundColor: CATEGORIAS[ev.categoria].cor },
                    ]}
                  />
                  <Text style={styles.tooltipNome} numberOfLines={2}>
                    {ev.nome}
                  </Text>
                </View>
                <Text style={styles.eventoCategoria}>
                  {CATEGORIAS[ev.categoria].rotulo}
                </Text>
                {!!ev.descricao && (
                  <Text style={styles.eventoDesc} numberOfLines={3}>
                    {ev.descricao}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
      {selecionado && (
        <View style={styles.detalhes}>
          <View style={styles.detalhesTopo}>
            <Text style={styles.detalhesTitulo}>
              {formatarData(selecionado)}
            </Text>
            <Pressable
              onPress={() => setSelecionado(null)}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Fechar detalhes do dia"
            >
              <Ionicons name="close" size={18} color={TEXTO_SEC} />
            </Pressable>
          </View>
          {eventosSelecionados.length === 0 ? (
            <Text style={styles.detalhesVazio}>Sem feriados nesta data.</Text>
          ) : (
            eventosSelecionados.map((ev, i) => (
              <View
                key={`${ev.data}-${ev.nome}-${i}`}
                style={styles.detalheItem}
              >
                <View style={styles.eventoTopo}>
                  <View
                    style={[
                      styles.eventoPonto,
                      { backgroundColor: CATEGORIAS[ev.categoria].cor },
                    ]}
                  />
                  <Text style={styles.detalheNome}>{ev.nome}</Text>
                </View>
                <Text style={styles.detalheCategoria}>
                  {CATEGORIAS[ev.categoria].rotulo}
                </Text>
                {!!ev.descricao && (
                  <Text style={styles.eventoDesc}>{ev.descricao}</Text>
                )}
              </View>
            ))
          )}
        </View>
      )}
      {carregando ? (
        <Text style={styles.status}>Carregando feriados…</Text>
      ) : algumaFonteFalhou ? (
        <View style={styles.statusErroWrap}>
          <Text style={styles.status}>
            Alguns feriados podem estar indisponíveis no momento.
          </Text>
          <Pressable
            onPress={recarregar}
            hitSlop={8}
            accessibilityRole="button"
          >
            <Text style={styles.statusErroAcao}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : null}

      {/* Legenda */}
      <View style={styles.legenda}>
        <View style={styles.legendaItem}>
          <View style={[styles.legendaPonto, { backgroundColor: ROXO }]} />
          <Text style={styles.legendaTexto}>Hoje</Text>
        </View>
        {ORDEM_CATEGORIAS.map((c) => (
          <View key={c} style={styles.legendaItem}>
            <View
              style={[
                styles.legendaPonto,
                { backgroundColor: CATEGORIAS[c].cor },
              ]}
            />
            <Text style={styles.legendaTexto}>{CATEGORIAS[c].rotulo}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDA,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginTop: 16,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  botaoNav: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: FUNDO_LEVE,
  },
  botaoNavAtivo: { backgroundColor: FUNDO_SELECAO },
  tituloWrap: { flex: 1, alignItems: 'center' },
  titulo: { fontSize: 17, fontWeight: '700', color: TEXTO },

  semanaLinha: { flexDirection: 'row', marginBottom: 2 },
  celulaSemana: {
    width: '14.2857%',
    alignItems: 'center',
    paddingVertical: 4,
  },
  semanaTexto: { fontSize: 11, fontWeight: '700', color: ROXO },

  grade: { position: 'relative', flexDirection: 'row', flexWrap: 'wrap' },
  celula: {
    width: '14.2857%',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  celulaPressionada: { backgroundColor: FUNDO_LEVE },
  celulaSelecionada: {
    backgroundColor: FUNDO_SELECAO,
    borderWidth: 1.5,
    borderColor: ROXO,
  },
  celulaHoje: { backgroundColor: ROXO },
  celulaHojeSelecionada: { borderWidth: 2, borderColor: ROXO_CLARO },
  diaNumero: { fontSize: 13, color: TEXTO, fontWeight: '500' },
  diaNumeroFimDeSemana: { color: TEXTO_SEC },
  diaNumeroSelecionado: { color: ROXO, fontWeight: '700' },
  diaNumeroHoje: { color: '#fff', fontWeight: '700' },
  indicadores: {
    position: 'absolute',
    bottom: 5,
    flexDirection: 'row',
    gap: 3,
  },
  indicador: { width: 5, height: 5, borderRadius: 2.5 },

  // Tooltip (desktop)
  tooltip: {
    position: 'absolute',
    zIndex: 50,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDA,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
  },
  tooltipData: {
    fontSize: 11,
    fontWeight: '700',
    color: TEXTO_SEC,
    marginBottom: 4,
  },
  tooltipEvento: { marginTop: 4 },
  eventoTopo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  eventoPonto: { width: 8, height: 8, borderRadius: 4 },
  tooltipNome: { fontSize: 13, fontWeight: '700', color: TEXTO, flex: 1 },
  eventoCategoria: {
    fontSize: 10,
    color: TEXTO_SEC,
    marginTop: 1,
    marginLeft: 14,
  },
  eventoDesc: {
    fontSize: 11,
    color: TEXTO_SEC,
    marginTop: 2,
    marginLeft: 14,
  },
  detalhes: {
    marginTop: 10,
    backgroundColor: FUNDO_LEVE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDA,
    padding: 10,
  },
  detalhesTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detalhesTitulo: { fontSize: 14, fontWeight: '700', color: TEXTO },
  detalhesVazio: { fontSize: 12, color: TEXTO_SEC },
  detalheItem: { marginTop: 6 },
  detalheNome: { fontSize: 13, fontWeight: '700', color: TEXTO, flex: 1 },
  detalheCategoria: {
    fontSize: 11,
    color: ROXO,
    marginTop: 1,
    marginLeft: 14,
    fontWeight: '600',
  },
  status: {
    fontSize: 11,
    color: TEXTO_SEC,
    marginTop: 8,
    textAlign: 'center',
  },
  statusErroWrap: { alignItems: 'center', marginTop: 4 },
  statusErroAcao: {
    fontSize: 12,
    color: ROXO,
    fontWeight: '700',
    marginTop: 2,
  },
  legenda: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: BORDA,
  },
  legendaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendaPonto: { width: 8, height: 8, borderRadius: 4 },
  legendaTexto: { fontSize: 10, color: TEXTO_SEC, fontWeight: '600' },
});

