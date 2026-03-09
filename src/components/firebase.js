// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhu6yCjm7mnNZV-mS5dSLh3hOUXG8R5dY",
  authDomain: "stone-market-4e65b.firebaseapp.com",
  projectId: "stone-market-4e65b",
  storageBucket: "stone-market-4e65b.firebasestorage.app",
  messagingSenderId: "20791220674",
  appId: "1:20791220674:web:22ac427338773b183fde5b",
  measurementId: "G-YL0TKDZFV1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);