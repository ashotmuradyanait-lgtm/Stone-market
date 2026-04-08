import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getDatabase, Database } from "firebase/database";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Ֆայիրբեյսի կոնֆիգուրացիայի տիպավորումը (ըստ Firebase-ի ստանդարտի)
const firebaseConfig = {
  apiKey: "AIzaSyAhu6yCjm7mnNZV-mS5dSLh3hOUXG8R5dY",
  authDomain: "stone-market-4e65b.firebaseapp.com",
  databaseURL: "https://stone-market-4e65b-default-rtdb.firebaseio.com",
  projectId: "stone-market-4e65b",
  storageBucket: "stone-market-4e65b.firebasestorage.app",
  messagingSenderId: "20791220674",
  appId: "1:20791220674:web:22ac427338773b183fde5b",
  measurementId: "G-YL0TKDZFV1"
};

// Ինիցիալիզացիա՝ նշելով FirebaseApp տիպը
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Էքսպորտ ենք անում սերվիսները՝ հստակ տիպավորմամբ
export const auth: Auth = getAuth(app);
export const storage: FirebaseStorage = getStorage(app);
export const rtdb: Database = getDatabase(app); 
export const db: Firestore = getFirestore(app);

export default app;