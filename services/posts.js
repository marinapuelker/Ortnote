import { Platform } from 'react-native';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

const CLOUD_NAME = 'SEU_CLOUD_NAME';
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
    likesCount: 0,
    createdAt: serverTimestamp(),
  });
}