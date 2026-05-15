import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración sincronizada con tu google-services.json
const firebaseConfig = {
  apiKey: "AIzaSyAkiRcNexxCLVzoSGpcy0hh0FWWFbNLrRY", // La de tu archivo
  authDomain: "aeternum-3fd16.firebaseapp.com",
  projectId: "aeternum-3fd16",
  storageBucket: "aeternum-3fd16.firebasestorage.app",
  messagingSenderId: "171874374153",
  appId: "1:171874374153:android:c9bb71296b38a90d2f5ed8" // ID de Android de tu archivo
};

// Inicialización segura
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Quitamos la persistencia avanzada por ahora para asegurar que NO CRASHee
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, onAuthStateChanged, signInWithEmailAndPassword, db };
