import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBaciBUHFV0SvlK31BqJ0giSh6glWgNo9Y",
  authDomain: "hotel-management-web-app-b2e74.firebaseapp.com",
  projectId: "hotel-management-web-app-b2e74",
  storageBucket: "hotel-management-web-app-b2e74.firebasestorage.app",
  messagingSenderId: "498622150587",
  appId: "1:498622150587:web:ed0eda9da7b379ba7e369e",
  measurementId: "G-HHJN0E1QEQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and EXPORT Firebase services.
// The "export" keyword is the crucial part.
export const auth = getAuth(app);
export const db = getFirestore(app);