import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Platform } from 'react-native';

// Serviço de tarefas/lembretes do ORTNOTE
//
// Cada tarefa segue o formato:
//   { id, uid, titulo, descricao, data: 'AAAA-MM-DD', hora, cor, concluida, createdAt }
//
// A coleção 'tarefas' é consultada assincronamente e reage aos eventos do
// Firestore (onSnapshot), então o calendário sempre mostra o estado mais
// recente sem precisar recarregar a página.

// Escuta as tarefas do usuário autenticado e notifica o callback.
export function ouvirTarefas(uid, onChange, onError) {
  if (!uid) return () => {};

  const q = query(collection(db, 'tarefas'), where('uid', '==', uid));

  return onSnapshot(
    q,
    (snap) => {
      const map = {};
      for (const docSnap of snap.docs) {
        map[docSnap.id] = { id: docSnap.id, ...docSnap.data() };
      }
      onChange(Object.values(map));
    },
    (erro) => {
      console.log('Erro ao listar tarefas:', erro.message);
      if (onError) onError(erro);
    }
  );
}

// Cria ou atualiza uma tarefa.
export async function salvarTarefa(tarefa) {
  const user = auth.currentUser;
  if (!user) throw new Error('Você precisa estar logado para gerenciar tarefas.');

  const dados = {
    titulo: tarefa.titulo,
    descricao: tarefa.descricao,
    data: tarefa.data,
    hora: tarefa.hora,
    cor: tarefa.cor,
    concluida: Boolean(tarefa.concluida),
    editadoEm: serverTimestamp(),
    uid: user.uid,
  };

  if (tarefa.id) {
    await updateDoc(doc(db, 'tarefas', tarefa.id), dados);
    return tarefa.id;
  }

  const ref = await addDoc(collection(db, 'tarefas'), {
    ...dados,
    concluida: false,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// Remove uma tarefa.
export async function excluirTarefa(id) {
  const user = auth.currentUser;
  if (!user) throw new Error('Você precisa estar logado para gerenciar tarefas.');
  await deleteDoc(doc(db, 'tarefas', id));
}
