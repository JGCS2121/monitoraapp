import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  initializeAuth, 
  getReactNativePersistence, 
  getAuth,
  onAuthStateChanged, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCJLQVpzxs-G4ssLpk2FlcGrhR4tPpRjs4",
  authDomain: "aeternum-3fd16.firebaseapp.com",
  projectId: "aeternum-3fd16",
  storageBucket: "aeternum-3fd16.firebasestorage.app",
  messagingSenderId: "171874374153",
  appId: "1:171874374153:web:8e8a91c93158acf42f5ed8",
  measurementId: "G-CE6LB0LMST"
};

// Singleton para la App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Singleton para Auth con persistencia en React Native
let auth;
try {
  auth = getAuth(app);
} catch (e) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
}

const db = getFirestore(app);

export { auth, db, onAuthStateChanged, signInWithEmailAndPassword };
