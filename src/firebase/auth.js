import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

import { getDatabase, ref, set, update } from "firebase/database";
import { auth } from "./config";

const updateUserData = async (user, displayName = null) => {
  const db = getDatabase();
  const userRef = ref(db, `users/${user.uid}`);

  const data = {
    uid: user.uid,
    email: user.email,
    displayName: displayName || user.displayName || "Անուն",
    photoURL: user.photoURL || "",
    lastLogin: Date.now(),
  };

  return update(userRef, data);
};


export const register = async (email, password, displayName) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(res.user, { displayName });
  await updateUserData(res.user, displayName);
  
  return res;
};


export const login = async (email, password) => {
  const res = await signInWithEmailAndPassword(auth, email, password);
  
  await updateUserData(res.user);
  
  return res;
};

export const logout = () => signOut(auth);


export const observeAuth = (cb) => onAuthStateChanged(auth, cb);