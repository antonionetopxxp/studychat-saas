// Importa Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Configuração do seu projeto
const firebaseConfig = {
  apiKey: "AIzaSyBO0Ml85drfObZMl00FGGskR9bqHVkQ02k",
  authDomain: "studychat-saas.firebaseapp.com",
  projectId: "studychat-saas",
  storageBucket: "studychat-saas.firebasestorage.app",
  messagingSenderId: "336469459364",
  appId: "1:336469459364:web:2767036983bcb1f6ff0131"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Serviços
export const auth = getAuth(app);
export const db = getFirestore(app);

// Login Google
const provider = new GoogleAuthProvider();

export function loginGoogle() {
  return signInWithPopup(auth, provider);
}

export function logout() {
  return signOut(auth);
}

export function usuarioLogado(callback) {
  onAuthStateChanged(auth, callback);
}
