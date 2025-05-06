import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBpK94BiYY-4f5PljHlsIa2iKQX0BF4Eks",
    authDomain: "easy-book-c6426.firebaseapp.com",
    projectId: "easy-book-c6426",
    storageBucket: "easy-book-c6426.firebasestorage.app",
    messagingSenderId: "400547245506",
    appId: "1:400547245506:web:f9a718fd3b055eab50fa5b",
    measurementId: "G-HXCH3J4NJ0"
  };

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();