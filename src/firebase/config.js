import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAhu6yCjm7mnNZV-mS5dSLh3hOUXG8R5dY",
  authDomain: "XXX",
  projectId: "XXX",
  databaseURL: "https://stone-market-4e65b-default-rtdb.firebaseio.com/",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);