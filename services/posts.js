import { Platform } from 'react-native';
import {addDoc, collection, doc, updateDoc, deleteDoc,arrayUnion, arrayRemove, serverTimestamp,} from 'firebase/firestore';
import { auth, db } from '../firebase';

const CLOUD_NAME = 'rnfxcgah';
const UPLOAD_PRESET = 'ortnote_posts';

async function enviarArquivo(arquivo) {
  const formData = new FormData();

  if (Platform.OS === 'web') {
    const blob = await (await fetch(arquivo.uri)).blob();
    formData.append('file', blob, arquivo.nome);
  } else {
    formData.append('file', {
      uri: arquivo.uri,
      type: arquivo.mimeType,
      name: arquivo.nome,
    });
  }
  formData.append('upload_preset', UPLOAD_PRESET);

  const resposta = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    { method: 'POST', body: formData }
  );

  const dados = await resposta.json();
  if (!resposta.ok) {
    throw new Error(dados?.error?.message ?? 'Falha ao enviar o arquivo');
  }
  return dados.secure_url;
}

export async function criarPost(arquivo, { materia, serie, tipo, descricao }) {
  const user = auth.currentUser;
  if (!user) throw new Error('Você precisa estar logado para publicar');

  const arquivoUrl = await enviarArquivo(arquivo);

  await addDoc(collection(db, 'posts'), {
    userId: user.uid,
    username: user.displayName ?? 'usuario',
    materia,
    serie,
    tipo,
    descricao: descricao.trim(),
    arquivoUrl,
    likedBy: [],
    createdAt: serverTimestamp(),
  });
}

export async function alternarCurtida(post) {
  const user = auth.currentUser;
  console.log('1) curtir', { postId: post.id, uid: user?.uid, likedBy: post.likedBy });

  if (!user) throw new Error('Você precisa estar logado para curtir');

  const jaCurtiu = (post.likedBy ?? []).includes(user.uid);

  try {
    await updateDoc(doc(db, 'posts', post.id), {
      likedBy: jaCurtiu ? arrayRemove(user.uid) : arrayUnion(user.uid),
    });
    console.log('2) gravou no Firestore');
  } catch (e) {
    console.log('2) ERRO ao gravar:', e.code, e.message);
    throw e;
  }
}
export async function editarPost(post, {descricao}) {
  const user = auth.currentUser;
  if (!user || post.userId !== user.uid) {
    throw new Error('Você não pode editar esta publicação');
  }

  const texto = descricao.trim();
  if (!texto) throw new Error('A biografia não pode ficar vazia');

  await updateDoc(doc(db, 'posts', post.id), {
    descricao: texto,
    editadoEm: serverTimestamp(),
  });
}
export async function excluirPost(post) {
  const user = auth.currentUser;
  if (!user || post.userId !== user.uid) {
    throw new Error('Você não pode excluir esta publicação');
  }

  await deleteDoc(doc(db, 'posts', post.id));
}