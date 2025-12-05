// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from 'firebase/firestore';
import { collection, addDoc } from 'firebase/firestore'; 

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBoWynebuup-JESbKvaEnZTyMYm5RuWCsM",
  authDomain: "expenses-tracker-644ea.firebaseapp.com",
  databaseURL: "https://expenses-tracker-644ea-default-rtdb.firebaseio.com",
  projectId: "expenses-tracker-644ea",
  storageBucket: "expenses-tracker-644ea.firebasestorage.app",
  messagingSenderId: "239172656256",
  appId: "1:239172656256:web:e0aa10d640f6f58b5cda65"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

