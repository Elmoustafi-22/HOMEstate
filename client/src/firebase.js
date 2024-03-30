// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "homestate-15d28.firebaseapp.com",
  projectId: "homestate-15d28",
  storageBucket: "homestate-15d28.appspot.com",
  messagingSenderId: "741896548601",
  appId: "1:741896548601:web:228920726c9a70d2493228"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);