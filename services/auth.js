import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signOut,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

export async function cadastrar(email, senha, nome) {
  const emailLimpo = email.trim().toLowerCase();

  const cred = await createUserWithEmailAndPassword(auth, emailLimpo, senha);
  await updateProfile(cred.user, { displayName: nome.trim() });
  await sendEmailVerification(cred.user);
  await signOut(auth);
}

export async function entrar(email, senha) {
  const emailLimpo = email.trim().toLowerCase();
  const cred = await signInWithEmailAndPassword(auth, emailLimpo, senha);

  await cred.user.reload();
  if (!cred.user.emailVerified) {
    await signOut(auth);
    throw new Error(
      'Confirme seu e-mail antes de entrar. Veja a caixa de entrada e o spam.'
    );
  }

  await cred.user.getIdToken(true);
  await setDoc(
    doc(db, 'users', cred.user.uid),
    { nome: cred.user.displayName ?? '', criadoEm: serverTimestamp() },
    { merge: true }
  );
}

export const sair = () => signOut(auth);