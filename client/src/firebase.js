import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "movieapp-783ea.firebaseapp.com",
  projectId: "movieapp-783ea",
  storageBucket: "movieapp-783ea.firebasestorage.app",
  messagingSenderId: "742808330597",
  appId: "1:742808330597:web:698de4c8d6339bbb0a418c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
