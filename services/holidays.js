import { Platform } from 'react-native';
const HEBCAL_URL = (ano) =>
  `https://www.hebcal.com/hebcal?v=1&cfg=json&year=${ano}&month=x&maj=on&min=on&mod=on&i=off&c=off&lg=pt`;

const BRASIL_URL = (ano) =>
  `https://brasilapi.com.br/api/feriados/v1/${ano}`;
const cache = new Map();
const emCurso = new Map();

function apenasData(str) {
  if (typeof str !== 'string' || str.length < 10) return null;
  return str.slice(0, 10);
}
function normalizarHebcal(items) {
  const eventos = [];
  for (const item of items) {
    const data = apenasData(item.date);
    if (!data) continue;

    let categoria;
    if (item.category === 'holiday') {
      categoria = item.subcat === 'modern' ? 'comemorativa' : 'judaico';
    } else if (item.category === 'fast') {
      categoria = 'comemorativa';
    } else {
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

function normalizarBrasil(lista) {
  const eventos = [];
  for (const item of lista) {
    const data = apenasData(item.date);
    if (!data) continue;
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
      return {
        eventos: [],
        fontes: { judaico: 'erro', nacional: 'erro' },
      };
    });

  if (!forcar) emCurso.set(ano, promessa);
  return promessa;
}
