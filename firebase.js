import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "COLE_AQUI",
  authDomain: "COLE_AQUI",
  projectId: "COLE_AQUI",
  storageBucket: "COLE_AQUI",
  messagingSenderId: "COLE_AQUI",
  appId: "COLE_AQUI"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();

// LOGIN GOOGLE
export function loginGoogle() {
  return signInWithPopup(auth, provider);
}

// USUÁRIO LOGADO
export function observarUsuario(callback) {
  onAuthStateChanged(auth, callback);
}

// SALVAR PROGRESSO
export async function salvarProgresso(userId, data) {
  await setDoc(doc(db, "usuarios", userId), data);
}

// CARREGAR PROGRESSO
export async function carregarProgresso(userId) {
  const ref = doc(db, "usuarios", userId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}
