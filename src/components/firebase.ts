// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getFirestore, Firestore } from "firebase/firestore";

// 1. Սահմանում ենք կոնֆիգուրացիայի տիպը (FirebaseConfig)
// Սա օգնում է, որ եթե ինչ-որ բան սխալ գրես, TS-ը միանգամից հուշի
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string; // "?" նշանակում է պարտադիր չէ
}

const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyAhu6yCjm7mnNZV-mS5dSLh3hOUXG8R5dY",
  authDomain: "stone-market-4e65b.firebaseapp.com",
  projectId: "stone-market-4e65b",
  storageBucket: "stone-market-4e65b.firebasestorage.app",
  messagingSenderId: "20791220674",
  appId: "1:20791220674:web:22ac427338773b183fde5b",
  measurementId: "G-YL0TKDZFV1"
};

// 2. Initialize Firebase (նշելով վերադարձվող տիպերը)
const app: FirebaseApp = initializeApp(firebaseConfig);

// Analytics-ը աշխատում է միայն բրաուզերում, ուստի լավ է ստուգել window-ի առկայությունը
let analytics: Analytics | undefined;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export const db: Firestore = getFirestore(app);

export { app, analytics };