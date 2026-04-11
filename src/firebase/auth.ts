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
import { doc, setDoc, serverTimestamp } from "firebase/firestore"; // Ավելացված է Firestore-ի համար
import { auth, rtdb, db } from "./config"; 

/**
 * 1. Սինխրոնացում Firestore-ի հետ (Հիմնական ցուցակի համար)
 * Սա թույլ կտա, որ հեռախոսով մտնողը տեսնի բոլորին
 */
export const syncUserToFirestore = async (user: User, displayName?: string | null, photoURL?: string | null) => {
  const userRef = doc(db, "users", user.uid);
  const data = {
    uid: user.uid,
    email: user.email,
    displayName: displayName || user.displayName || user.email?.split('@')[0] || "User",
    photoURL: photoURL || user.photoURL || "",
    lastLogin: serverTimestamp(),
  };

  try {
    await setDoc(userRef, data, { merge: true });
  } catch (error) {
    console.error("Firestore sync error:", error);
  }
};

/**
 * 2. Ստատուսի սինխրոնացում RTDB-ի հետ (Online/Offline կետիկի համար)
 */
const syncUserStatus = async (user: User, displayName: string | null = null): Promise<void> => {
  const statusRef = ref(rtdb, `status/${user.uid}`);
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
export const register = async (email: string, password: string, displayName: string, photoURL: string = ""): Promise<UserCredential> => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    
    // Թարմացնում ենք Auth պրոֆիլը (Firebase-ի ներքին պրոֆիլը)
    await updateProfile(res.user, { displayName, photoURL });
    
    // Գրանցում ենք Firestore-ում (որպեսզի հեռախոսով երևա)
    await syncUserToFirestore(res.user, displayName, photoURL);
    
    // Սինխրոնացնում ենք RTDB ստատուսը
    await syncUserStatus(res.user, displayName);
    
    return res;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

/**
 * Մուտք
 */
export const login = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    
    // Մուտք գործելիս թարմացնում ենք և՛ Firestore-ը, և՛ RTDB-ն
    await syncUserToFirestore(res.user);
    await syncUserStatus(res.user);
    
    return res;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

/**
 * Ելք
 */
export const logout = (): Promise<void> => {
  // Ելքի ժամանակ RTDB-ում կարելի է նշել offline (ըստ ցանկության)
  if (auth.currentUser) {
    const statusRef = ref(rtdb, `status/${auth.currentUser.uid}`);
    update(statusRef, { state: "offline", last_changed: Date.now() });
  }
  return signOut(auth);
};

/**
 * Օգտատիրոջ վիճակի հետևում
 */
export const observeAuth = (cb: (user: User | null) => void) => 
  onAuthStateChanged(auth, cb);