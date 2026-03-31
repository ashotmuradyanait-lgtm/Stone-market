import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage"; // Ավելացրինք սա

const firebaseConfig = {
  apiKey: "AIzaSyAhu6yCjm7mnNZV-mS5dSLh3hOUXG8R5dY",
  authDomain: "stone-market-4e65b.firebaseapp.com", // Սա սովորաբար այսպես է լինում
  projectId: "stone-market-4e65b",
  databaseURL: "https://stone-market-4e65b-default-rtdb.firebaseio.com/",
  storageBucket: "stone-market-4e65b.appspot.com", // Այս տողը ՊԱՐՏԱԴԻՐ է մեդիայի համար
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app); // Export ենք անում, որ chat.js-ում օգտագործենք