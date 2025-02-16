import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAP7l8dLrbVoxPWN2QUFBoI_Y-ILzP48e8",
  authDomain: "top-10-movies-app.firebaseapp.com",
  databaseURL: "https://top-10-movies-app-default-rtdb.firebaseio.com",
  projectId: "top-10-movies-app",
  storageBucket: "top-10-movies-app.appspot.com",
  messagingSenderId: "865010208389",
  appId: "1:865010208389:web:0b8545dd7b9e1ffd1063ec",
  measurementId: "G-HR9GS8P3BF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
