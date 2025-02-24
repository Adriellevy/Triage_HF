import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAGwlWDf94SqJOGjJAtKv5RqjnOlP7uDFA",
  authDomain: "triage-app-manager.firebaseapp.com",
  projectId: "triage-app-manager",
  storageBucket: "triage-app-manager.firebasestorage.app",
  messagingSenderId: "343255357790",
  appId: "1:343255357790:web:a7afda729cfab96e0957cf",
  measurementId: "G-8NM51HJ8H7"
};

const app = initializeApp(firebaseConfig);
export const dbfs = getFirestore()