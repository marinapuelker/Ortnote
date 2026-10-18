export function normalizar(texto = '') {
  return String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function postCorrespondeBusca(post, { termo, materia, serie, tipo }) {
  if (materia && post.materia !== materia) return false;
  if (serie && post.serie !== serie) return false;
  if (tipo && post.tipo !== tipo) return false;

  const palavras = normalizar(termo).split(/\s+/).filter(Boolean);
  if (palavras.length === 0) return true;

  const textoDoPost = normalizar(
    [post.descricao, post.materia, post.serie, post.username].join(' ')
  );

  return palavras.every((palavra) => textoDoPost.includes(palavra));
} 
export function sugerirFiltros(resultados, preferencias = {}) {
  const contar = (campo) => {
    const mapa = {};
    resultados.forEach((p) => {
      const valor = p[campo];
      if (valor) mapa[valor] = (mapa[valor] ?? 0) + 1;
    });
    return Object.entries(mapa)
      .map(([valor, n]) => ({
        valor,
        n,
        score: n + 2 * (preferencias[campo]?.[valor] ?? 0),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  };

  const tipos = [
    { valor: 'imagem', n: resultados.filter((p) => p.tipo !== 'pdf').length },
    { valor: 'pdf', n: resultados.filter((p) => p.tipo === 'pdf').length },
  ].filter((t) => t.n > 0);

  return { materias: contar('materia'), series: contar('serie'), tipos };
}

export function montarPreferencias(historico = []) {
  const prefs = { materia: {}, serie: {} };
  historico.forEach((h) => {
    if (h.campo === 'materia' || h.campo === 'serie') {
      prefs[h.campo][h.valor] = (prefs[h.campo][h.valor] ?? 0) + 1;
    }
  });
  return prefs;
}