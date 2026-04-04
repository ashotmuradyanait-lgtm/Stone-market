import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAhu6yCjm7mnNZV-mS5dSLh3hOUXG8R5dY",
  authDomain: "stone-market-4e65b.firebaseapp.com",
  databaseURL: "https://stone-market-4e65b-default-rtdb.firebaseio.com",
  projectId: "stone-market-4e65b",
  // ՈՒՇԱԴՐՈՒԹՅՈՒՆ. Այստեղ փոխվել է վերջավորությունը՝ ըստ քո նոր Firebase Config-ի
  storageBucket: "stone-market-4e65b.firebasestorage.app",
  messagingSenderId: "20791220674",
  appId: "1:20791220674:web:22ac427338773b183fde5b",
  measurementId: "G-YL0TKDZFV1"
};

// Ստուգում ենք՝ արդյոք App-ը արդեն ինիցիալիզացված է, թե ոչ
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Էքսպորտ ենք անում բոլոր անհրաժեշտ սերվիսները
export const auth = getAuth(app);
export const storage = getStorage(app);
export const rtdb = getDatabase(app); // Realtime DB (Online/Offline ստատուսների համար)
export const db = getFirestore(app);   // Firestore (Messages, Stories & Calls-ի համար)

export default app;