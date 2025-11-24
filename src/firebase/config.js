import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration - You'll need to replace these with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC-UbyiQLU2z1rxxdhpwCVdJZQBVdH6w40",
  authDomain: "finsurehub-d9354.firebaseapp.com",
  projectId: "finsurehub-d9354",
  storageBucket: "finsurehub-d9354.firebasestorage.app",
  messagingSenderId: "975020117840",
  appId: "1:975020117840:web:f53926a8ab69a82346e655",
  measurementId: "G-YG76W0P40Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;