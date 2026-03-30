import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

import { ref, update } from "firebase/database";
import { auth, db } from "./config"; // Ներմուծում ենք db-ն անմիջապես config-ից

const syncUserStatus = async (user, displayName = null) => {
  // Օգտագործում ենք արդեն գոյություն ունեցող db-ն
  const statusRef = ref(db, `status/${user.uid}`);

  const data = {
    id: user.uid,
    email: user.email,
    displayName: displayName || user.displayName || user.email.split('@')[0],
    state: "online",
    last_changed: Date.now(),
  };

  return update(statusRef, data);
};

export const register = async (email, password, displayName) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    
    // Թարմացնում ենք Auth պրոֆիլը
    await updateProfile(res.user, { displayName });
    
    // Սինխրոնացնում ենք բազայի հետ
    await syncUserStatus(res.user, displayName);
    
    return res;
  } catch (error) {
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    
    // Մուտք գործելիս թարմացնում ենք ստատուսը
    await syncUserStatus(res.user);
    
    return res;
  } catch (error) {
    throw error;
  }
};

export const logout = () => signOut(auth);

export const observeAuth = (cb) => onAuthStateChanged(auth, cb);