import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

function colecaoBuscas() {
  const user = auth.currentUser;
  if (!user) return null;
  return collection(db, 'users', user.uid, 'buscas');
}

export async function registrarBusca(termo) {
  const ref = colecaoBuscas();
  if (!ref) return;
  try {
    await addDoc(ref, { campo: 'busca', termo, criadoEm: serverTimestamp() });
  } catch (e) {
    console.log('Erro ao salvar busca:', e.message);
  }
}

export async function registrarEscolha(termo, campo, valor) {
  const ref = colecaoBuscas();
  if (!ref) return;
  try {
    await addDoc(ref, { campo, valor, termo, criadoEm: serverTimestamp() });
  } catch (e) {
    console.log('Erro ao salvar filtro:', e.message);
  }
}

export async function carregarHistorico(limite = 200) {
  const ref = colecaoBuscas();
  if (!ref) return [];
  try {
    const snap = await getDocs(query(ref, orderBy('criadoEm', 'desc'), limit(limite)));
    return snap.docs.map((d) => d.data());
  } catch (e) {
    console.log('Erro ao carregar histórico:', e.message);
    return [];
  }
}