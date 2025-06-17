// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from 'firebase/firestore';
import { collection, addDoc } from 'firebase/firestore'; 

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPGQkvxtiLmp9zWvGJWC_RKftnKHgUfN4",
  authDomain: "expenses-tracker-28670.firebaseapp.com",
  projectId: "expenses-tracker-28670",
  storageBucket: "expenses-tracker-28670.firebasestorage.app",
  messagingSenderId: "210671733588",
  appId: "1:210671733588:web:437ae957e6d8217016d6c1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

