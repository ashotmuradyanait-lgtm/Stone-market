import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
  UserCredential
} from "firebase/auth";

import { ref, update } from "firebase/database";
import { auth, rtdb } from "./config"; 

/**
 * Օգտատիրոջ ստատուսի սինխրոնացում Realtime Database-ի հետ
 */
const syncUserStatus = async (user: User, displayName: string | null = null): Promise<void> => {
 const statusRef = ref(rtdb, `status/${user.uid}`);

  // Սահմանում ենք տվյալների կառուցվածքը
  const data = {
    id: user.uid,
    email: user.email,
    displayName: displayName || user.displayName || user.email?.split('@')[0] || "Unknown",
    state: "online",
    last_changed: Date.now(),
  };

  return update(statusRef, data);
};

/**
 * Գրանցում
 */
export const register = async (email: string, password: string, displayName: string): Promise<UserCredential> => {
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

/**
 * Մուտք
 */
export const login = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    
    // Մուտք գործելիս թարմացնում ենք ստատուսը
    await syncUserStatus(res.user);
    
    return res;
  } catch (error) {
    throw error;
  }
};

/**
 * Ելք
 */
export const logout = (): Promise<void> => signOut(auth);

/**
 * Օգտատիրոջ վիճակի հետևում
 */
export const observeAuth = (cb: (user: User | null) => void) => 
  onAuthStateChanged(auth, cb);