import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAhu6yCjm7mnNZV-mS5dSLh3hOUXG8R5dY",
  authDomain: "stone-market-4e65b.firebaseapp.com",
  projectId: "stone-market-4e65b",
  databaseURL: "https://stone-market-4e65b-default-rtdb.firebaseio.com/",
  storageBucket: "stone-market-4e65b.appspot.com",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const rtdb = getDatabase(app); // Realtime DB (Status-ների համար)
export const db = getFirestore(app);   // Firestore (Messages & Calls-ի համար)