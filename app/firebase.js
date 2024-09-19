// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from 'firebase/firestore';
import { collection, addDoc } from 'firebase/firestore'; 

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqAoIYIxZnx8XmIL7OGEUbBgdxWDxhB78",
  authDomain: "expenses-tracker-bfade.firebaseapp.com",
  projectId: "expenses-tracker-bfade",
  storageBucket: "expenses-tracker-bfade.appspot.com",
  messagingSenderId: "17745216753",
  appId: "1:17745216753:web:3e67b9e73b9d952c4c9550"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);