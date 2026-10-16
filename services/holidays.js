import { Platform } from 'react-native';

// ---------------------------------------------------------------------------
// Serviço de feriados do ORTNOTE
//
// Consulta duas fontes públicas e confiáveis:
//   1. Feriados judaicos  -> Hebcal (https://www.hebcal.com/home/developer-apis)
//      - Usamos o calendário da DIÁSPORA (i=off), adequado para estudantes no
//        Brasil, e habilitamos feriados principais (maj), secundários (min) e
//        modernos (mod). NÃO habilitamos jejuns (mf), parashot (s), Rosh
//        Chodesh (nx), Omer etc., para não poluir o calendário.
//      - lg=pt devolve os títulos já em português.
//   2. Feriados nacionais -> BrasilAPI (https://brasilapi.com.br/docs)
//      - Devolve apenas feriados nacionais oficiais (type === 'national').
//        Datas como Dia das Mães/Pais NÃO aparecem aqui, portanto não são
//        classificadas como feriado nacional.
//
// Ambas as APIs retornam dados ANUAIS, então buscamos uma vez por ano e
// reutilizamos para todos os meses daquele ano. Mantemos cache em memória e
// deduplicação de requisições em curso.
//
// Nenhuma chave de API é necessária. Nenhum dado é inventado: só exibimos o
// que as fontes realmente retornarem.
// ---------------------------------------------------------------------------

const HEBCAL_URL = (ano) =>
  `https://www.hebcal.com/hebcal?v=1&cfg=json&year=${ano}&month=x&maj=on&min=on&mod=on&i=off&c=off&lg=pt`;

const BRASIL_URL = (ano) =>
  `https://brasilapi.com.br/api/feriados/v1/${ano}`;

// cache: ano -> { eventos, fontes: { judaico, nacional } }
const cache = new Map();
// requisições em andamento por ano (evita chamadas duplicadas simultâneas)
const emCurso = new Map();

// Extrai 'YYYY-MM-DD' de forma segura, SEM conversão de fuso horário.
// Aceita 'YYYY-MM-DD' ou 'YYYY-MM-DDTHH:mm:ss...'.
function apenasData(str) {
  if (typeof str !== 'string' || str.length < 10) return null;
  return str.slice(0, 10);
}

// Normaliza os itens do Hebcal para o formato interno do app.
// Diferenciamos feriados religiosos (judaico) de comemorações modernas/jejuns.
function normalizarHebcal(items) {
  const eventos = [];
  for (const item of items) {
    const data = apenasData(item.date);
    if (!data) continue;

    let categoria;
    if (item.category === 'holiday') {
      // 'modern' = feriados modernos de Israel (Yom HaShoah, Yom HaAtzmaut...)
      // tratados como data comemorativa, não como feriado religioso.
      categoria = item.subcat === 'modern' ? 'comemorativa' : 'judaico';
    } else if (item.category === 'fast') {
      // Jejuns não são feriados religiosos propriamente ditos.
      categoria = 'comemorativa';
    } else {
      // Ignora parashot, omer, rosh chodesh, etc.
      continue;
    }

    eventos.push({
      data,
      nome: item.title || item.title_orig || 'Feriado judaico',
      categoria,
      descricao: item.memo || '',
      inicio: null,
      fim: null,
    });
  }
  return eventos;
}

// Normaliza a resposta da BrasilAPI. Apenas feriados nacionais oficiais.
function normalizarBrasil(lista) {
  const eventos = [];
  for (const item of lista) {
    const data = apenasData(item.date);
    if (!data) continue;
    // Defensivo: só aceitamos feriados nacionais oficiais.
    if (item.type && item.type !== 'national') continue;

    eventos.push({
      data,
      nome: item.name || 'Feriado nacional',
      categoria: 'nacional',
      descricao: '',
      inicio: null,
      fim: null,
    });
  }
  return eventos;
}

// fetch com timeout para não travar a interface em conexões ruins.
function buscarComTimeout(url, ms = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { signal: controller.signal })
    .then((resp) => {
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return resp.json();
    })
    .finally(() => clearTimeout(timer));
}

// Carrega e normaliza os feriados de um ano, tolerando falhas parciais:
// se uma fonte falhar, a outra continua disponível.
async function carregarAno(ano) {
  const fontes = { judaico: 'ok', nacional: 'ok' };
  let eventos = [];

  const [hebcal, brasil] = await Promise.allSettled([
    buscarComTimeout(HEBCAL_URL(ano)),
    buscarComTimeout(BRASIL_URL(ano)),
  ]);

  if (
    hebcal.status === 'fulfilled' &&
    hebcal.value &&
    Array.isArray(hebcal.value.items)
  ) {
    eventos = eventos.concat(normalizarHebcal(hebcal.value.items));
  } else {
    fontes.judaico = 'erro';
  }

  if (brasil.status === 'fulfilled' && Array.isArray(brasil.value)) {
    eventos = eventos.concat(normalizarBrasil(brasil.value));
  } else {
    fontes.nacional = 'erro';
  }

  return { eventos, fontes };
}

// Obtém os feriados de um ano, usando cache em memória.
// opcoes.forcar = true ignora o cache (usado no "tentar novamente").
export function obterFeriadosDoAno(ano, opcoes = {}) {
  const forcar = opcoes.forcar === true;

  if (!forcar) {
    if (cache.has(ano)) return Promise.resolve(cache.get(ano));
    if (emCurso.has(ano)) return emCurso.get(ano);
  }

  const promessa = carregarAno(ano)
    .then((resultado) => {
      cache.set(ano, resultado);
      emCurso.delete(ano);
      return resultado;
    })
    .catch(() => {
      emCurso.delete(ano);
      // Falha inesperada: não derruba a tela, apenas sinaliza indisponível.
      return {
        eventos: [],
        fontes: { judaico: 'erro', nacional: 'erro' },
      };
    });

  if (!forcar) emCurso.set(ano, promessa);
  return promessa;
}
